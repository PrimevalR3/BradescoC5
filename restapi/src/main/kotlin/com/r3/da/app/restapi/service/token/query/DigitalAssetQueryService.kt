package com.r3.da.app.restapi.service.token.query

import com.r3.corda.api.CordaApi
import com.r3.corda.api.FlowStartRequest
import com.r3.corda.api.FlowStatus
import com.r3.corda.api.FlowStatusResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.*

@Component
class DigitalAssetQueryService(
    @Autowired val cordaApi: CordaApi,
    @Value("\${corda.legal-identity.issuer}") private val issuerLegalIdentity: String,
    @Value("\${com.r3.org.digitalasset.listassets.fullyqualifiedclassname}") private val daassetListFlowClassName: String,
    @Value("\${com.r3.org.digitalasset.listtokens.fullyqualifiedclassname}") private val daasseLinkedTokensListFlowClassName: String,
    @Value("\${corda.da-cpiname}") private val daCpiName: String,

    ) {

    companion object {
        private val logger = LoggerFactory.getLogger(DigitalAssetQueryService::class.java)
    }


    fun getLegalIdentity(): String = issuerLegalIdentity

    fun getIdentityShortHashForLegalIdentity(legalentity:String): String {
        val virtualNode = cordaApi.getVirtualNodeByX500NameAndCpiName(legalentity,daCpiName)
            ?: throw Exception("Cannot find virtual node for identity: ${legalentity}")
        logger.info("Shorthash for LegalIdentity:${legalentity} is ${virtualNode.holdingIdentity.shortHash}")
        return virtualNode.holdingIdentity.shortHash
    }

    fun listDigitalAssets(legalentity:String): FlowStatusResponse {
        val holdingIdentityShortHash=getIdentityShortHashForLegalIdentity(legalentity)
        val flowStartRequestId = UUID.randomUUID().toString()
        cordaApi.startFlow(holdingIdentityShortHash,
            FlowStartRequest(flowStartRequestId,
                daassetListFlowClassName,
                ""))

        var flowResponse: FlowStatusResponse
        val runningStatus = listOf(FlowStatus.START_REQUESTED, FlowStatus.RUNNING)
        do {
            Thread.sleep(1000)
            flowResponse = getFlowStatus(holdingIdentityShortHash, flowStartRequestId)
        } while (runningStatus.contains(flowResponse.flowStatus))

        return flowResponse
    }


    fun listDigitalAssetLinkedTokens(legalentity:String): FlowStatusResponse {
        val holdingIdentityShortHash=getIdentityShortHashForLegalIdentity(legalentity)
        val flowStartRequestId = UUID.randomUUID().toString()
        cordaApi.startFlow(holdingIdentityShortHash,
            FlowStartRequest(flowStartRequestId,
                daasseLinkedTokensListFlowClassName,
                ""))

        var flowResponse: FlowStatusResponse
        val runningStatus = listOf(FlowStatus.START_REQUESTED, FlowStatus.RUNNING)
        do {
            Thread.sleep(1000)
            flowResponse = getFlowStatus(holdingIdentityShortHash, flowStartRequestId)
        } while (runningStatus.contains(flowResponse.flowStatus))

        return flowResponse
    }

    fun getFlowStatus(holdingIdentityshorthash: String, clientId: String): FlowStatusResponse {
        return cordaApi.getFlowStatus(holdingIdentityshorthash, clientId)
    }


}
