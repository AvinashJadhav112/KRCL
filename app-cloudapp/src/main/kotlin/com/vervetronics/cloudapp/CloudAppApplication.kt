package com.vervetronics.cloudapp

import com.nelkinda.kotlin.JavaDetectionStrategy
import com.nelkinda.kotlin.KotlinDetectionStrategy
import com.nelkinda.kotlin.getJavaHome
import com.nelkinda.kotlin.getKotlinHome
import com.nelkinda.rel.CachingExpressionCompilerDecorator
import com.nelkinda.rel.CompilationErrorException
import com.nelkinda.rel.ExpressionCompiler
import com.nelkinda.rel.KotlinExpressionCompiler
import com.vervetronics.cloudapp.storage.SensorReadingRepository
import com.vervetronics.cloudapp.storage.file.FileSensorReadingRepository
import com.vervetronics.cloudapp.storage.influx.InfluxSensorReadingRepository
import com.vervetronics.cloudapp.storage.multiplex.MultiplexSensorReadingRepository
import com.vervetronics.cloudapp.user.UserService
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.actuate.health.Health
import org.springframework.boot.actuate.health.HealthIndicator
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary
import org.springframework.core.task.AsyncTaskExecutor
import org.springframework.core.task.SimpleAsyncTaskExecutor
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.stereotype.Component
import java.io.File
import java.io.FileNotFoundException
import java.nio.file.Path
import java.time.Clock
import java.time.Clock.systemUTC
import kotlin.reflect.KFunction

@EnableAsync
@SpringBootApplication
class CloudAppApplication {
    @Bean
    fun clock(): Clock = systemUTC()

    @Bean
    fun customOpenApi(): OpenAPI =
        OpenAPI().info(
            Info()
                .title("VerveTronics CloudApp API")
                .version("v1")
        )

    @Suppress("kotlin:S1135", "UnusedPrivateMember")
    // TODO Remove the run command that implements CommandLineRunner
    @Bean
    fun run(
        userService: UserService,
    ): CommandLineRunner {
        return CommandLineRunner { }
    }

    @Bean
    fun expressionCompiler(): ExpressionCompiler {
        return CachingExpressionCompilerDecorator(KotlinExpressionCompiler(File("/tmp")))
    }

    @Bean
    fun asyncTaskExecutor(): AsyncTaskExecutor = SimpleAsyncTaskExecutor("async")

    @ExperimentalUnsignedTypes
    @Primary
    @Bean
    fun sensorReadingRepository(
        @Value("\${application.storage.path:data}") base: Path,
        @Value("\${influx.url}") url: String,
        @Value("\${influx.token}") token: String,
        @Value("\${influx.bucket}") bucket: String,
    ): SensorReadingRepository =
        MultiplexSensorReadingRepository(
            listOf(
                FileSensorReadingRepository(base),
                InfluxSensorReadingRepository(url, token, bucket),
            )
        )
}

internal lateinit var appContext: ApplicationContext
    private set

fun main(vararg args: String) {
    appContext = runApplication<CloudAppApplication>(*args)
}

@ExperimentalUnsignedTypes
@Component
class ToolsHealthIndicator(
    @Autowired private val expressionCompiler: ExpressionCompiler,
) : HealthIndicator {
    override fun health(): Health = try {
        getJavaHome()
        getKotlinHome()
        Health.up()
    } catch (e: FileNotFoundException) {
        Health.down().withException(e)
    }
        .withDetail(
            KotlinDetectionStrategy.name,
            LinkedHashMap(
                KotlinDetectionStrategy.strategies.associate {
                    (if (it is KFunction<*>) it.name else it.toString()) to (it.invoke() ?: "n/a (null)")
                }
            ).apply {
                put("effective", KotlinDetectionStrategy.getHome())
                put("version", KotlinDetectionStrategy.getVersion())
                put("compile value result", getCompilationResult())
            }
        )
        .withDetail(
            JavaDetectionStrategy.name,
            LinkedHashMap(
                JavaDetectionStrategy.strategies.associate {
                    (if (it is KFunction<*>) it.name else it.toString()) to (it.invoke() ?: "n/a (null)")
                }
            ).apply {
                put("effective", JavaDetectionStrategy.getHome())
                put("version", JavaDetectionStrategy.getVersion())
            }
        )
        .build()

    @SuppressWarnings("MagicNumber")
    private fun getCompilationResult(): String {
        return try {
            val function = expressionCompiler.compile<Int, Int>("value", "Int", "Int")
            if (function.apply(42) == 42)
                "Compilation successful, function executed"
            else
                "Compilation successful, but function not executed"
        } catch (e: CompilationErrorException) {
            e.toString()
        }
    }
}
