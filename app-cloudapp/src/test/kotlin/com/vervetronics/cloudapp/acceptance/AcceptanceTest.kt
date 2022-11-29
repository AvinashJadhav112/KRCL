package com.vervetronics.cloudapp.acceptance

import com.vervetronics.cloudapp.TestUserFactory
import com.vervetronics.cloudapp.user.UserRepository
import com.vervetronics.cloudapp.user.UserService
import io.cucumber.java.en.Given
import io.cucumber.java.en.Then
import io.cucumber.java.en.When
import io.cucumber.spring.CucumberContextConfiguration
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.platform.suite.api.IncludeEngines
import org.junit.platform.suite.api.SelectClasspathResource
import org.junit.platform.suite.api.Suite
import org.openqa.selenium.By
import org.openqa.selenium.WebDriver
import org.openqa.selenium.support.ui.ExpectedConditions
import org.openqa.selenium.support.ui.WebDriverWait
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.web.server.LocalServerPort

@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
@CucumberContextConfiguration
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AcceptanceTest(
    @Autowired private val testUserFactory: TestUserFactory,
    @Autowired private val userService: UserService,
    @Autowired private val userRepository: UserRepository,
    @LocalServerPort private val localServerPort: Int,
    @Autowired driver: WebDriver
) : WebDriver by driver {
    private val wait = WebDriverWait(driver, 10)

    @Given("a user {string} with password {string} exists")
    fun theUserExistInTheSystem(username: String, password: String) {
        val user = userRepository.findByEmail(username) ?: testUserFactory.createUser(username)
        user.password = password
        userService.save(user)
    }

    @When("logging in user {string} with password {string}")
    fun theUserLogsIn(username: String, password: String) {
        this["http://localhost:$localServerPort/"]

        // The existing user logs in
        findElement(By.xpath("//a[@href='#/login']")).click()
        findElement(By.xpath("//input[@placeholder='Your email']")).sendKeys(username)
        findElement(By.xpath("//input[@placeholder='Your password']")).sendKeys(password)
        findElement(By.xpath("//button[contains(text(),'Login')]")).click()
    }

    @When("enrolling a new user {string} with password {string}")
    fun enrollsAnotherUser(username: String, password: String) {
        findElement(By.xpath("//a[@href='#/signup']")).click()
        findElement(By.xpath("//input[@placeholder='Enter Email']")).sendKeys(username)
        findElement(By.xpath("//input[@placeholder='Enter Password']")).sendKeys(password)
        findElement(By.xpath("//input[@placeholder='Enter Password Again']")).sendKeys(password)
        findElement(By.xpath("//button[contains(text(),'Enroll User')]")).click()
    }

    @When("logging out")
    fun logsOut() {
        findElement(By.xpath("//li[contains(text(),'Logout')]")).click()
    }

    @Then("login MUST be successful")
    fun loginMustBeSuccessful() {
        assertTrue(false)
        wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.xpath("//a[@href='#/signup']")))
    }
}
