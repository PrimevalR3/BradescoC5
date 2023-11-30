package com.r3.da.app.restapi.cucumber

import io.cucumber.spring.CucumberContextConfiguration
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Configuration

@CucumberContextConfiguration
@SpringBootTest(classes = [TestConfig::class])
class CucumberSpringConfiguration {
}

@Configuration
class TestConfig {
}