package com.vervetronics.cloudapp.storage

import com.nelkinda.kotlin.Data
import com.nelkinda.kotlin.toHexString
import com.vervetronics.cloudapp.CloudAppApplication
import com.vervetronics.cloudapp.storage.TestFactoryDeviceIdentifierFactory.id1
import com.vervetronics.cloudapp.storage.TestFactoryDeviceIdentifierFactory.id2
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito.`when`
import org.mockito.kotlin.doAnswer
import org.mockito.kotlin.whenever
import org.skyscreamer.jsonassert.JSONAssert.assertEquals
import org.skyscreamer.jsonassert.JSONCompareMode
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.web.server.LocalServerPort
import java.io.FileNotFoundException
import java.net.URI
import java.net.URL
import java.nio.charset.StandardCharsets
import java.nio.file.NoSuchFileException
import java.time.Clock
import java.time.Instant
import java.time.ZoneOffset

@ExperimentalUnsignedTypes
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    classes = [CloudAppApplication::class, SensorReadingController::class],
)
@MockBean(SensorReadingRepository::class)
class SensorReadingControllerTest(
    @Autowired private val sensorReadingRepository: SensorReadingRepository,
    @LocalServerPort private val port: Int,
) {
    @Test
    fun getDevices() {
        `when`(sensorReadingRepository.findAllDevices())
            .thenReturn(
                listOf(
                    id1.toHexString(),
                    id2.toHexString(),
                )
            )
        assertJsonEqualsFromUrls("expected/findAllDevices.json", "http://localhost:$port/api/alpha/devices")
    }

    @Test
    fun getSensors() {
        `when`(sensorReadingRepository.findAllSensors(id1.toHexString()))
            .thenReturn(listOf("0001", "0002", "0003"))
        assertJsonEqualsFromUrls(
            "expected/findAllSensors.json",
            "http://localhost:$port/api/alpha/device/${id1.toHexString()}/sensors"
        )
    }

    @Test
    fun getSensorsNotFound() {
        doAnswer { throw NoSuchFileException("data/${id1.toHexString()}") }
            .whenever(sensorReadingRepository)
            .findAllSensors(id1.toHexString())
        assertThrows<FileNotFoundException> {
            read("http://localhost:$port/api/alpha/device/${id1.toHexString()}/sensors")
        }
    }

    @Test
    fun getDays() {
        `when`(
            sensorReadingRepository.findAllDays(
                id1.toHexString(),
                "0001"
            )
        ).thenReturn(listOf("2020-12-18", "2020-12-19"))
        assertJsonEqualsFromUrls(
            "expected/findAllDays.json",
            "http://localhost:$port/api/alpha/device/${id1.toHexString()}/sensor/0001/days"
        )
    }

    @Test
    fun getReadings() {
        val clock = Clock.fixed(Instant.parse("2020-12-28T12:00:00Z"), ZoneOffset.UTC)
        `when`(
            sensorReadingRepository.findAllSensorReadings(
                id1.toHexString(),
                "0001",
                "2020-12-18"
            )
        ).thenReturn(
            listOf(
                SensorReading(id1, 0x0001U, clock.instant(), "01020304"),
                SensorReading(id1, 0x0001U, clock.instant(), "01020305"),
                SensorReading(id1, 0x0001U, clock.instant(), "01020306"),
            )
        )
        assertJsonEqualsFromUrls(
            "http://localhost:$port/api/alpha/device/${id1.toHexString()}/sensor/0001/day/2020-12-18/readings",
            "http://localhost:$port/api/alpha/device/${id1.toHexString()}/sensor/0001/day/2020-12-18/readings"
        )
        assertJsonEqualsFromUrls("expected/findAllSensorReadings.json", "expected/findAllSensorReadings.json")
        assertJsonEqualsFromUrls(
            "expected/findAllSensorReadings.json",
            "http://localhost:$port/api/alpha/device/${id1.toHexString()}/sensor/0001/day/2020-12-18/readings"
        )
    }

    @Test
    fun getLatest() {
        val clock = Clock.fixed(Instant.parse("2020-12-28T12:00:00Z"), ZoneOffset.UTC)
        `when`(
            sensorReadingRepository.getLatestSensorReadings(id1.toHexString())
        ).thenReturn(
            listOf(
                SensorReading(id1, 0x0001U, clock.instant().plusMillis(300), "0303"),
                SensorReading(id1, 0x0002U, clock.instant().plusMillis(200), "02020202"),
            )
        )
        assertJsonEqualsFromUrls(
            "expected/getLatest.json",
            "http://localhost:$port/api/alpha/device/${id1.toHexString()}/sensors/latest"
        )
    }

    @Test
    fun bulkExport() {
        val clock = Clock.fixed(Instant.parse("2020-12-28T12:00:00Z"), ZoneOffset.UTC)
        `when`(sensorReadingRepository.findAllDevices())
            .thenReturn(
                listOf(
                    id1.toHexString(),
                    id2.toHexString()
                )
            )
        `when`(sensorReadingRepository.findAllSensors(id1.toHexString()))
            .thenReturn(listOf("0001", "0002", "0003"))
        `when`(
            sensorReadingRepository.findAllDays(
                id1.toHexString(),
                "0001"
            )
        ).thenReturn(listOf("2020-12-18", "2020-12-19"))
        `when`(
            sensorReadingRepository.findAllSensorReadings(
                id1.toHexString(),
                "0001",
                "2020-12-18"
            )
        ).thenReturn(
            listOf(
                SensorReading(id1, 0x0001U, clock.instant(), "01020304"),
                SensorReading(id1, 0x0001U, clock.instant(), "01020305"),
                SensorReading(id1, 0x0001U, clock.instant(), "01020306"),
            )
        )
        val expectedCsv = read("expected/bulk-export.csv")
        val actualCsv = read("http://localhost:$port/api/alpha/bulk-export")
        assertEquals(expectedCsv, actualCsv)
    }

    @Test
    fun bulkExportContentType() {
        val url = URL("http://localhost:$port/api/alpha/bulk-export")
        val connection = url.openConnection()
        assertEquals("text/csv", connection.getHeaderField("Content-Type"))
        assertEquals(
            "attachment; filename=\"sensor-data.csv\"",
            connection.getHeaderField("Content-Disposition")
        )
    }

    @Suppress("SameParameterValue", "TestFunctionName")
    private fun SensorReading(
        factoryDeviceId: UByteArray,
        sensorId: UShort,
        timestamp: Instant,
        value: String,
    ) = SensorReading(
        Data(factoryDeviceId),
        sensorId,
        timestamp,
        Data(value),
    )

    private fun assertJsonEqualsFromUrls(asserted: String, actual: String) =
        assertEquals(read(asserted), read(actual), JSONCompareMode.LENIENT)

    private fun read(url: String) = read(URI(url))
    private fun read(uri: URI) =
        read(if (uri.isAbsolute) uri.toURL() else javaClass.getResource("SensorReadingControllerTest/$uri")!!)

    private fun read(url: URL): String = url.openStream().use { String(it.readAllBytes(), StandardCharsets.UTF_8) }
}
