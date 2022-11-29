package com.vervetronics.cloudapp.storage.influx

import com.influxdb.client.domain.WritePrecision
import com.influxdb.client.kotlin.InfluxDBClientKotlinFactory
import com.influxdb.client.write.Point
import com.influxdb.exceptions.InfluxException
import com.influxdb.query.FluxRecord
import com.vervetronics.cloudapp.storage.SensorReading
import com.vervetronics.cloudapp.storage.SensorReadingRepository
import kotlinx.coroutines.channels.toList
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.actuate.health.Health
import org.springframework.boot.actuate.health.HealthIndicator
import org.springframework.stereotype.Component
import org.springframework.stereotype.Repository
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneOffset.UTC

private const val HEX_BASE = 16

@SuppressWarnings("kotlin:S1192")
@ExperimentalUnsignedTypes
@Repository
@Component("influxdb")
class InfluxSensorReadingRepository(
    @Value("\${influx.url}")
    url: String,
    @Value("\${influx.token}")
    token: String,
    @Value("\${influx.bucket}")
    private val bucket: String,
) : SensorReadingRepository, HealthIndicator {
    private val org = "organization"
    private val client = InfluxDBClientKotlinFactory.create(url, token.toCharArray(), org, bucket)
    private val queryApi = client.getQueryKotlinApi()
    private val writeApi = client.getWriteKotlinApi()

    @SuppressWarnings("ImplicitDefaultLocale") // False positive on String.format("%04x")
    override fun save(sensorReading: SensorReading) = runBlocking {
        val hexValue = sensorReading.value.toString()
        val longValue = try { hexValue.toLong(HEX_BASE) } catch (ignore: NumberFormatException) { null }
        val doubleValue = if (longValue != null) Double.fromBits(longValue) else null
        val booleanValue = longValue != null && longValue != 0L
        val point = Point.measurement("sensor")
            .addTag("deviceId", sensorReading.factoryDeviceId.toString())
            .addTag("sensorId", String.format("%04x", sensorReading.sensorId.toInt()))
            .addField("rawValue", sensorReading.value.toString())
            .addField("long", longValue)
            .addField("double", doubleValue)
            .addField("boolean", booleanValue)
            .time(sensorReading.timestamp, WritePrecision.NS)
        try {
            writeApi.writePoint(point)
        } catch (e: InfluxException) {
            println(e)
        }
    }

    override fun findAllDevices(): List<String> = runBlocking {
        try {
            queryApi.query(
                """
                from(bucket: "$bucket")
                  |> range(start: -30d)
                  |> filter(fn: (r) => r._measurement == "sensor")
                  |> keep(columns: ["deviceId"])
                  |> group()
                  |> distinct(column: "deviceId")
                  |> sort()
                """.trimIndent()
            ).toList().map {
                it.value as String
            }
        } catch (e: InfluxException) {
            println(e)
            emptyList()
        }
    }

    override fun findAllSensors(factoryDeviceId: String): List<String> = runBlocking {
        try {
            queryApi.query(
                """
                from(bucket: "$bucket")
                  |> range(start: -30d)
                  |> filter(fn: (r) => r._measurement == "sensor" and r.deviceId == "$factoryDeviceId")
                  |> keep(columns: ["sensorId"])
                  |> group()
                  |> distinct(column: "sensorId")
                  |> sort()
                """.trimIndent()
            ).toList().map {
                it.value as String
            }
        } catch (e: InfluxException) {
            println(e)
            emptyList()
        }
    }

    override fun findAllDays(factoryDeviceId: String, sensor: String): List<String> = runBlocking {
        try {
            queryApi.query(
                """
                import "date"
                from(bucket: "$bucket")
                |> range(start: -1y)
                |> filter(fn: (r) =>
                    r._measurement == "sensor"
                    and r.deviceId == "$factoryDeviceId"
                    and r.sensorId == "$sensor"
                )
                |> keep(columns: ["_time"])
                |> map(fn: (r) => ({ r with date: date.truncate(t: r._time, unit: 1d)}))
                |> distinct(column: "date")
                """.trimIndent()
            ).toList().map {
                LocalDate.ofInstant(it.value as Instant, UTC).toString()
            }
        } catch (e: InfluxException) {
            println(e)
            emptyList()
        }
    }

    override fun findAllSensorReadings(factoryDeviceId: String, sensor: String, date: String) =
        with(LocalDate.parse(date).atStartOfDay()) {
            getSensorReadingInBetweenDays(factoryDeviceId, sensor, this, this.plusDays(1))
        }

    override fun getLatestSensorReadings(factoryDeviceId: String): List<SensorReading> = runBlocking {
        try {
            queryApi.query(
                """
                from(bucket: "$bucket")
                |> range(start: -30d)
                |> filter(fn: (r) =>
                    r._measurement == "sensor"
                    and r.deviceId == "$factoryDeviceId"
                    and r._field == "rawValue"
                )
                |> last()
                """.trimIndent()
            ).toList().map {
                SensorReading(it)
            }
        } catch (e: InfluxException) {
            println(e)
            emptyList()
        }
    }

    override fun getSensorReadingInBetweenDays(
        factoryDeviceId: String,
        sensor: String,
        startDate: LocalDateTime,
        endDate: LocalDateTime
    ) = runBlocking {
        try {
            queryApi.query(
                """
                from(bucket: "$bucket")
                |> range(start: ${startDate.toInstant(UTC)}, stop: ${endDate.toInstant(UTC)})
                |> filter(fn: (r) =>
                    r._measurement == "sensor"
                    and r.deviceId == "$factoryDeviceId"
                    and r.sensorId == "$sensor"
                    and r._field == "rawValue"
                )
                """.trimIndent()
            ).toList().map {
                SensorReading(it)
            }
        } catch (e: InfluxException) {
            println(e)
            emptyList()
        }
    }

    @SuppressWarnings("FunctionNaming") // Intentionally named like a constructor.
    private fun SensorReading(it: FluxRecord) = SensorReading(
        it.getValueByKey("deviceId") as String,
        (it.getValueByKey("sensorId") as String).toUShort(),
        it.time!!,
        it.value as String,
    )

    override fun health(): Health = (
        if (client.ping()) Health.up().withDetail("version", client.version())
        else Health.unknown()
        ).build()
}
