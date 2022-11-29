package com.vervetronics.cloudapp.acceptance

import io.github.bonigarcia.wdm.WebDriverManager
import org.openqa.selenium.WebDriver
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component
import javax.annotation.PreDestroy

@Component
class WebDriverProvider {
    @get:Bean
    val driver: WebDriver = run {
        WebDriverManager.chromedriver().setup()
        val options = ChromeOptions()
        options.addArguments("headless")
        ChromeDriver(options)
    }

    @PreDestroy
    fun quitDriver() {
        driver.quit()
    }
}
