package com.r3.da.app.restapi.service.token.issue

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
class DigitalAssetIssuanceService(
    @Autowired val cordaApi: CordaApi,
    @Value("\${corda.legal-identity.issuer}") private val issuerLegalIdentity: String,
    @Value("\${com.r3.org.digitalasset.tokenissueflow.fullyqualifiedclassname}") private val daassetissueflowclassname: String,
    @Value("\${corda.da-cpiname}") private val daCpiName: String,

    ) {

    companion object {
        private val logger = LoggerFactory.getLogger(DigitalAssetIssuanceService::class.java)
    }


    fun getLegalIdentity(): String = issuerLegalIdentity

    fun getIdentityShortHashForLegalIdentity(): String {
        val virtualNode = cordaApi.getVirtualNodeByX500NameAndCpiName(issuerLegalIdentity,daCpiName)
            ?: throw Exception("Cannot find virtual node for identity: ${issuerLegalIdentity}")
        logger.info("Shorthash for LegalIdentity:${issuerLegalIdentity} is ${virtualNode.holdingIdentity.shortHash}")
        return virtualNode.holdingIdentity.shortHash
    }

    fun issueDigitalAssetToken(title:String,description:String,artist:String): FlowStatusResponse {

        val holdingIdentityShortHash=getIdentityShortHashForLegalIdentity()
        val flowStartRequestId = UUID.randomUUID().toString()
         cordaApi.startFlow(holdingIdentityShortHash,
            FlowStartRequest(flowStartRequestId,
                daassetissueflowclassname,
                " {\n" + "      \"title\" : \"${title}\"\n" + "," + "      \"description\" : \"${description}\"\n" + "," + "      \"artist\" : \"${artist}\"\n" + "}"))

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
