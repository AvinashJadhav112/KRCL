package com.nelkinda.template.lib.acceptance

import io.cucumber.spring.CucumberContextConfiguration
import org.junit.platform.suite.api.IncludeEngines
import org.junit.platform.suite.api.SelectClasspathResource
import org.junit.platform.suite.api.Suite

@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
@CucumberContextConfiguration
class AcceptanceTest
