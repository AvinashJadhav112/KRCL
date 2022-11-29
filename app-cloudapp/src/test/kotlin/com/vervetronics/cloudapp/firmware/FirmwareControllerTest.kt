package com.vervetronics.cloudapp.firmware

import com.vervetronics.cloudapp.CloudAppApplication
import com.vervetronics.cloudapp.assertStatus
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.mockito.BDDMockito.then
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.client.getForEntity
import org.springframework.http.HttpStatus
import org.springframework.mock.web.MockMultipartFile
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@ExperimentalUnsignedTypes
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    classes = [CloudAppApplication::class, FirmwareController::class],
)
@MockBean(classes = [FirmwareService::class])
@AutoConfigureMockMvc
class FirmwareControllerTest(
    @Autowired
    private val mockMvc: MockMvc,
    @Autowired
    private val firmwareService: FirmwareService,
    @Autowired
    private val testRestTemplate: TestRestTemplate,
) {
    @Test
    fun without_available_firmwares_returns_empty_array() {
        mockMvc.get("/api/v1/firmwares")
            .andExpect { status { isOk() } }
            .andExpect { content { contentType("application/json") } }
            .andExpect { content { json("[]") } }
    }

    @Test
    fun with_available_firmwares_returns_list() {
        val firmwareVersion = "Test"
        given(firmwareService.list()).willReturn(listOf(Firmware(firmwareVersion)))

        mockMvc.get("/api/v1/firmwares")
            .andExpect {
                status {
                    isOk()
                }
            }
            .andExpect {
                content {
                    contentType("application/json")
                }
            }
            .andExpect {
                content {
                    json(
                        """
                            [
                                {
                                    "firmwareVersion" : $firmwareVersion,
                                    "bank1Path": "/api/v1/firmwares/$firmwareVersion/bank1.bin",
                                    "bank2Path": "/api/v1/firmwares/$firmwareVersion/bank2.bin"
                                }
                            ]
                        """.trimIndent()
                    )
                }
            }
    }

    @Test
    fun upload_firmware() {
        val multipartFile1 = mockFirmwareMultipartFile(1)
        val multipartFile2 = mockFirmwareMultipartFile(2)
        val firmwareVersion = "test"
        mockMvc.perform(
            multipart("/api/v1/firmwares/{firmwareVersion}", firmwareVersion)
                .file(multipartFile1)
                .file(multipartFile2)
        )
            .andExpect(status().isNoContent)

        then(firmwareService).should().store(firmwareVersion, multipartFile1, multipartFile2)
    }

    @Test
    @DisplayName("GET /api/v1/firmwares/getFirmwareDetails returns 200 Ok and added firmwares")
    fun `GET Firmware details returns 200 Status and Firmware`() {
        val path = "/api/v1/firmwares/getFirmwareDetails"
        val response = testRestTemplate.getForEntity<Any>(path)
        response.assertStatus(HttpStatus.OK)
    }

    private fun mockFirmwareMultipartFile(number: Int): MockMultipartFile =
        MockMultipartFile(
            "bank$number image",
            "firmware$number.bin",
            "application/octet-stream",
            "Test Firmware Bank $number".toByteArray(),
        )
}
