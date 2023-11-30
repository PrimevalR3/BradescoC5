package com.r3.da.app.restapi.cucumber

import io.cucumber.junit.Cucumber
import io.cucumber.junit.CucumberOptions
import org.junit.runner.RunWith

@RunWith(Cucumber::class)
@CucumberOptions(
    features = ["src/integrationTest/resources/cucumber"],
    plugin = ["pretty", "html:target/cucumber-report.html", "json:target/cucumber-report.json"]
)
open class CucumberIntegrationTests {
}