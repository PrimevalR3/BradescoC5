package com.r3.da.app.restapi.service

import com.r3.corda.api.CordaApi
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class IdentityService (
    @Autowired val cordaApi: CordaApi,
    @Value("\${corda.legal-identity.issuer}") private val issuerLegalIdentity : String) {

    companion object {
        private val logger = LoggerFactory.getLogger(IdentityService::class.java)
    }

    init {
        logger.info("Legal identity: ${issuerLegalIdentity}")
    }

    fun getLegalIdentity() : String = issuerLegalIdentity

    fun getIdentityShortHash() : String {
        val virtualNode = cordaApi.getVirtualNodeByX500Name(issuerLegalIdentity)
            ?: throw Exception("Cannot find virtual node for identity: ${issuerLegalIdentity}")
        return virtualNode.holdingIdentity.shortHash
    }
}