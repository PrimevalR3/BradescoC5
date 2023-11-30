package com.r3.da.app.restapi.service.token.valuation

import com.r3.corda.api.CordaApi
import com.r3.corda.api.FlowStartRequest
import com.r3.corda.api.FlowStatus
import com.r3.corda.api.FlowStatusResponse
import com.r3.da.app.restapi.service.token.query.DigitalAssetQueryService
import com.r3.da.app.restapi.service.token.withdraw.DAWithdrawService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.math.BigDecimal
import java.util.*

@Component
class DARatingAndValuationService(
    @Autowired
    val cordaApi: CordaApi,
    @Value("\${corda.da-cpiname}")
    private val daCpiName: String,

    @Value("\${corda.legal-identity.valuator}")
    private val valuatorLegalIdentity: String,

    @Value("\${corda.legal-identity.issuer}")
    private val corporateLegalIdentity: String,

    @Value("\${com.r3.org.digitalasset.valuateAsset.fullyqualifiedclassname}")
    private val valuateAssetFlowClassname: String,

    @Value("\${com.r3.org.digitalasset.valuationApproval.fullyqualifiedclassname}")
    private val valuateApprovalFlowClassname: String


) {
    companion object {
        private val logger = LoggerFactory.getLogger(DARatingAndValuationService::class.java)
    }

    fun getIdentityShortHashForLegalIdentity(legalEntity: String): String {
        val virtualNode = cordaApi.getVirtualNodeByX500NameAndCpiName(legalEntity, daCpiName)
            ?: throw Exception("Cannot find virtual node for identity: $legalEntity")
        logger.info("Shorthash for LegalIdentity: $legalEntity is ${virtualNode.holdingIdentity.shortHash}")
        return virtualNode.holdingIdentity.shortHash
    }

    fun valuateAsset(assetRef: String, valuation: BigDecimal): FlowStatusResponse {
        val holdingIdentityShortHash = getIdentityShortHashForLegalIdentity(valuatorLegalIdentity)
        val flowStartRequestId = UUID.randomUUID().toString()
        cordaApi.startFlow(holdingIdentityShortHash,
            FlowStartRequest(flowStartRequestId,
                valuateAssetFlowClassname,
                " {\n" + " \"assetRef\" : \"${assetRef}\"\n" + "," + " \"valuation\" : \"${valuation}\"\n" +"}"
            )
        )

        var flowResponse: FlowStatusResponse
        val runningStatus = listOf(FlowStatus.START_REQUESTED, FlowStatus.RUNNING)
        do {
            Thread.sleep(1000)
            flowResponse = getFlowStatus(holdingIdentityShortHash, flowStartRequestId)
        } while (runningStatus.contains(flowResponse.flowStatus))
        return flowResponse
    }

    fun valuationApproval(assetRef: String, action: String): FlowStatusResponse{
        val holdingIdentityShortHash = getIdentityShortHashForLegalIdentity(corporateLegalIdentity)
        val flowStartRequestId = UUID.randomUUID().toString()
        cordaApi.startFlow(holdingIdentityShortHash,
            FlowStartRequest(flowStartRequestId,
                valuateApprovalFlowClassname,
                " {\n" + " \"assetRef\" : \"${assetRef}\"\n" + "," + " \"action\" : \"${action}\"\n" +"}"
            )
        )

        var flowResponse: FlowStatusResponse
        val runningStatus = listOf(FlowStatus.START_REQUESTED, FlowStatus.RUNNING)
        do {
            Thread.sleep(1000)
            flowResponse = getFlowStatus(holdingIdentityShortHash, flowStartRequestId)
        } while (runningStatus.contains(flowResponse.flowStatus))
        return flowResponse
    }

    private fun getFlowStatus(holdingIdentityshorthash: String, clientId: String): FlowStatusResponse {
        return cordaApi.getFlowStatus(holdingIdentityshorthash, clientId)
    }
}