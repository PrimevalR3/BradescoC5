package com.r3.da.app.restapi.controller

import com.r3.corda.api.FlowStatusResponse
import com.r3.da.app.restapi.dto.DigitalAssetApprovalRejectRequest
import com.r3.da.app.restapi.model.enum.MarketplacePlaceOrderStatus
import com.r3.da.app.restapi.service.token.approval.ApproveRejectPlaceOrderService
import io.swagger.annotations.ApiOperation
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("/api/v1") // The paths for HTTP requests are relative to this base path.
class ApproveRejectNFTPlaceOrderController(private val approveRejectPlaceOrderService: ApproveRejectPlaceOrderService) {

    companion object {
        private val logger = LoggerFactory.getLogger(ApproveRejectNFTPlaceOrderController::class.java)
    }

    @PostMapping("/approveNFTPlaceOrder")
    @ApiOperation(value = "API to approve NFT marketplace place order from issuer",
        notes = "API to approve NFT marketplace place order from issuer")
    open fun approveNFTPlaceOrder(@RequestBody digitalAssetApprovalRejectRequest: DigitalAssetApprovalRejectRequest): ResponseEntity<FlowStatusResponse> {
        val flowStatusResponse = approveRejectPlaceOrderService.approveorRejectNFTMarketplacePlaceOrder(
            digitalAssetApprovalRejectRequest.assetRef,
            MarketplacePlaceOrderStatus.APPROVE.toString())
     return ResponseEntity(flowStatusResponse, HttpStatus.OK)
    }



    @PostMapping("/rejectNFTPlaceOrder")
    @ApiOperation(value = "API to reject NFT marketplace place order from issuer",
        notes = "API to reject NFT marketplace place order from issuer")
    open fun rejectNFTPlaceOrder(@RequestBody digitalAssetApprovalRejectRequest: DigitalAssetApprovalRejectRequest): ResponseEntity<FlowStatusResponse> {
        val flowStatusResponse = approveRejectPlaceOrderService.approveorRejectNFTMarketplacePlaceOrder(
            digitalAssetApprovalRejectRequest.assetRef,
            MarketplacePlaceOrderStatus.REJECT.toString())
      return ResponseEntity(flowStatusResponse, HttpStatus.OK)
    }


}
