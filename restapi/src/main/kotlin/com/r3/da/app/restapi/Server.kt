package com.r3.da.app.restapi

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.web.servlet.config.annotation.EnableWebMvc
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

/**
 * Our Spring Boot application.
 */
@EnableWebMvc
@EnableCaching
@SpringBootApplication
@EnableAsync
@EntityScan("com.r3.bol.sandbox.restapi.model")
@EnableJpaRepositories("com.r3.bol.sandbox.restapi.repository")
private open class Server

/**
 * Starts our Spring Boot application.
 */
fun main(args: Array<String>) {
    runApplication<Server>(*args)
}
