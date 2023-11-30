package com.r3.da.app.restapi.health

import com.r3.corda.api.CordaApi
import com.r3.da.app.restapi.service.IdentityService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.actuate.health.Health
import org.springframework.boot.actuate.health.HealthIndicator
import org.springframework.stereotype.Component

@Component
class CordaApiHealthIndicator(
    @Autowired val cordaApi: CordaApi,
    @Autowired val identityService: IdentityService
) : HealthIndicator {

    private val logger = LoggerFactory.getLogger(CordaApiHealthIndicator::class.java)
    override fun health(): Health {
        logger.info("Checking health of CordaApi on ${cordaApi.url()}")
        val builder = try {
            cordaApi.isAvailable()
            logger.info("CordaApi is UP")
            Health.up().withDetail("legalIdentity", identityService.getLegalIdentity())
        } catch (e: Exception) {
            logger.info("CordaApi is DOWN: ${e.message}")
            Health.down(e)
        }
        return builder.build()
    }
}