package com.vervetronics.cloudapp.firmware

import com.nelkinda.java.nio.file.deleteOnExitRecursively
import com.vervetronics.cloudapp.iot.device.DeviceIotService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.MethodOrderer
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestMethodOrder
import org.junit.jupiter.api.assertAll
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.mock.mockito.MockBeans
import org.springframework.mock.web.MockMultipartFile
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import java.nio.file.Files

@ExperimentalUnsignedTypes
@MockBeans(
    MockBean(FirmwareRepository::class),
    MockBean(DeviceIotService::class),
)
@SpringBootTest(
    classes = [FirmwareService::class],
)
@TestMethodOrder(MethodOrderer.OrderAnnotation::class)
class FirmwareServiceTest(
    @Autowired
    private val firmwareService: FirmwareService,
) {
    @Test
    @Order(1)
    fun testList() {
        assertEquals(listOf<Firmware>(), firmwareService.list())
    }

    @Test
    @Order(2)
    fun testStore() {
        println(firmwareService.firmwarePath)
        val firmwareVersion = "Test"
        val multipartFile1 = mockFirmwareMultipartFile(1)
        val multipartFile2 = mockFirmwareMultipartFile(2)
        firmwareService.store(
            firmwareVersion,
            multipartFile1,
            multipartFile2,
        )
        val devicePath = firmwareService.firmwarePath.resolve(firmwareVersion.toString())
        assertAll(
            { assertTrue(Files.exists(devicePath.resolve("bank1.bin"))) },
            { assertTrue(Files.exists(devicePath.resolve("bank2.bin"))) },
        )

        assertEquals(listOf(Firmware(firmwareVersion)), firmwareService.list())
    }

    private fun mockFirmwareMultipartFile(number: Int): MockMultipartFile =
        MockMultipartFile(
            "bank$number image",
            "firmware$number.bin",
            "application/octet-stream",
            "Test Firmware Bank $number".toByteArray(),
        )

    companion object {
        @JvmStatic @DynamicPropertySource
        fun testProperties(registry: DynamicPropertyRegistry) {
            registry.add("application.firmwares.path") {
                val tempDirectory = Files.createTempDirectory("firmwares")
                deleteOnExitRecursively(tempDirectory)
                tempDirectory.toString()
            }
        }
    }
}
