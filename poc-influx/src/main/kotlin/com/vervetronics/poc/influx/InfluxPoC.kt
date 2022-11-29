@file:SuppressWarnings("MagicNumber", "UnusedPrivateMember", "kotlin:S125")
package com.vervetronics.poc.influx

import com.influxdb.client.domain.WritePrecision
import com.influxdb.client.kotlin.InfluxDBClientKotlin
import com.influxdb.client.kotlin.InfluxDBClientKotlinFactory
import com.influxdb.client.kotlin.WriteKotlinApi
import com.influxdb.client.write.Point
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.consumeAsFlow
import kotlinx.coroutines.runBlocking
import java.time.Instant

@SuppressWarnings("kotlin:S125")
fun main() = runBlocking {
    val token = "7p7SGfKrH8uwAUUZWevKDPGnk4k6_4Aco6UzpLy4Vm3UEVQgknWD2eJvlA5QDwuHBwI9m6U6x48rsLRbwTuIwg=="
    val org = "organization"
    val bucket = "bucket"
    val client = InfluxDBClientKotlinFactory.create("http://localhost:8086", token.toCharArray(), org, bucket)
    client.use {
        val writeApi = client.getWriteKotlinApi()

//        example1(writeApi)
//        example2(writeApi)
//        example3(writeApi)

        pocSensorData(writeApi)

        exampleQuery(client)
    }
}

private suspend fun exampleQuery(client: InfluxDBClientKotlin) {
    // Execute query
    val query = """from(bucket: "bucket")
            |> range(start: -1d)
            """

    val results = client.getQueryKotlinApi().query(query)
    results.consumeAsFlow().collect { println("$it") }
}

private suspend fun pocSensorData(writeApi: WriteKotlinApi) {
    writeApi.writePoint(
        Point.measurement("sensor")
            .addTag("deviceId", "ABCDEFGH")
            .addTag("sensorId", "12")
            .addField("data", 0x00010203)
            .time(Instant.now(), WritePrecision.NS)
    )
}

private suspend fun example3(writeApi: WriteKotlinApi) {
    writeApi.writeMeasurement(Mem("host3", 12.12431241, Instant.now()), WritePrecision.NS)
}

private suspend fun example2(writeApi: WriteKotlinApi) {
    writeApi.writePoint(
        Point
            .measurement("mem")
            .addTag("host", "host2")
            .addField("used_percent", 23.12312131)
            .time(Instant.now(), WritePrecision.NS)
    )
}

private suspend fun example1(writeApi: WriteKotlinApi) {
    writeApi.writeRecord(
        "mem,host=host1 used_percent=23.123412",
        WritePrecision.NS,
    )
}
