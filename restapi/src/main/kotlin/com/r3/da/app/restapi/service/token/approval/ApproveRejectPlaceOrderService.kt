package com.r3.da.app.restapi.service.token.approval

import com.r3.corda.api.CordaApi
import com.r3.corda.api.FlowStartRequest
import com.r3.corda.api.FlowStatus
import com.r3.corda.api.FlowStatusResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.math.BigDecimal
import java.util.*

@Component
class ApproveRejectPlaceOrderService(
    @Autowired val cordaApi: CordaApi,
    @Value("\${corda.legal-identity.issuer}") private val issuerLegalIdentity: String,
    @Value("\${corda.legal-identity.custodian}") private val custodianLegalIdentity: String,
    @Value("\${corda.legal-identity.valuator}") private val valuatorLegalIdentity: String,
    @Value("\${corda.legal-identity.marketplace}") private val marketPlaceLegalIdentity: String,
    @Value("\${com.r3.org.digitalasset.approveplaceorder.fullyqualifiedclassname}") private val approvePlaceOrderFlowClassname: String,
    @Value("\${corda.da-cpiname}") private val daCpiName: String,

    ) {

    companion object {
        private val logger = LoggerFactory.getLogger(ApproveRejectPlaceOrderService::class.java)
    }


    fun getLegalIdentity(): String = issuerLegalIdentity

    fun getIdentityShortHashForLegalIdentity(): String {
        val virtualNode = cordaApi.getVirtualNodeByX500NameAndCpiName(custodianLegalIdentity, daCpiName)
            ?: throw Exception("Cannot find virtual node for identity: ${custodianLegalIdentity}")
        logger.info("Shorthash for LegalIdentity:${custodianLegalIdentity} is ${virtualNode.holdingIdentity.shortHash}")
        return virtualNode.holdingIdentity.shortHash
    }

    fun approveorRejectNFTMarketplacePlaceOrder(assetRef: String, action: String): FlowStatusResponse {

        val holdingIdentityShortHash = getIdentityShortHashForLegalIdentity()
        val flowStartRequestId = UUID.randomUUID().toString()
        cordaApi.startFlow(holdingIdentityShortHash,
            FlowStartRequest(flowStartRequestId,
                approvePlaceOrderFlowClassname,
                " {\n" + " \"assetRef\" : \"${assetRef}\"\n" +
                        "," + " \"action\" : \"${action}\"\n" +
                        "," + " \"valuator\" : \"${valuatorLegalIdentity}\"\n" +
                        "," + " \"marketPlace\" : \"${marketPlaceLegalIdentity}\"\n" +"}" )
        )

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
