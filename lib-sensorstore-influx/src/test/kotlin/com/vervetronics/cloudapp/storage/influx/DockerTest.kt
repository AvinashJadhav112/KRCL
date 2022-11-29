package com.vervetronics.cloudapp.storage.influx

import com.github.dockerjava.api.DockerClient
import com.github.dockerjava.api.exception.NotModifiedException
import com.github.dockerjava.core.DefaultDockerClientConfig
import com.github.dockerjava.core.DockerClientConfig
import com.github.dockerjava.core.DockerClientImpl
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient
import com.github.dockerjava.transport.DockerHttpClient
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import java.net.Socket
import java.time.Duration

@Disabled("Not yet ready for the pipeline")
class DockerTest {
    @Test
    fun someTest() {
        Socket("localhost", 8086).use {
        }
    }

    companion object {
        @JvmStatic
        private lateinit var transport: DockerHttpClient

        @JvmStatic
        private lateinit var client: DockerClient

        @JvmStatic @BeforeAll
        fun startInfluxWithDocker() {
            val standard: DockerClientConfig = DefaultDockerClientConfig.createDefaultConfigBuilder().build()
            transport = ApacheDockerHttpClient.Builder()
                .dockerHost(standard.dockerHost)
                .sslConfig(standard.sslConfig)
                .maxConnections(10)
                .connectionTimeout(Duration.ofSeconds(30))
                .responseTimeout(Duration.ofSeconds(45))
                .build()
            client = DockerClientImpl.getInstance(standard, transport)
            try {
                client.startContainerCmd("influxdb").exec()
            } catch (ignore: NotModifiedException) {}
        }

        @JvmStatic @AfterAll
        fun stopDocker() = transport.close()
        @JvmStatic @AfterAll
        fun stopClient() = client.close()
    }
}
