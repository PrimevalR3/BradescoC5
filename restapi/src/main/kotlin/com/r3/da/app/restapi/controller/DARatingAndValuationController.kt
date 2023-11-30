package com.r3.da.app.restapi.controller

import com.r3.corda.api.FlowStatusResponse
import com.r3.da.app.restapi.dto.DigitalAssetApprovalRejectRequest
import com.r3.da.app.restapi.dto.ValuateAssetRequest
import com.r3.da.app.restapi.model.enum.MarketplacePlaceOrderStatus
import com.r3.da.app.restapi.service.token.valuation.DARatingAndValuationService
import io.swagger.annotations.ApiOperation
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/valuation")
class DARatingAndValuationController(private val daRatingAndValuationService: DARatingAndValuationService) {

    companion object {
        private val logger = LoggerFactory.getLogger(DARatingAndValuationController::class.java)
    }

    @PostMapping("/valuate")
    @ApiOperation(
        value = "API to valuate and asset",
        notes = "API to valuate and asset"
    )
    open fun placeOrderNFTMarketplace(
        @RequestBody valuateAssetRequest: ValuateAssetRequest): ResponseEntity<FlowStatusResponse> {
        val flowStatusResponse = daRatingAndValuationService.valuateAsset(
            valuateAssetRequest.assetRef, valuateAssetRequest.valuation)
        return ResponseEntity(flowStatusResponse, HttpStatus.OK)
    }

    @PostMapping("/accept")
    @ApiOperation(value = "API to accept Asset Valuation from the Valuator",
        notes = "API to accept Asset Valuation from the Valuator")
    open fun approveNFTPlaceOrder(@RequestBody digitalAssetApprovalRejectRequest: DigitalAssetApprovalRejectRequest): ResponseEntity<FlowStatusResponse> {
        val flowStatusResponse = daRatingAndValuationService.valuationApproval(
            digitalAssetApprovalRejectRequest.assetRef,
            MarketplacePlaceOrderStatus.APPROVE.toString()
        )
        return ResponseEntity(flowStatusResponse, HttpStatus.OK)
    }



    @PostMapping("/reject")
    @ApiOperation(value = "API to reject Asset Valuation from the Valuator",
        notes = "API to reject Asset Valuation from the Valuator")
    open fun rejectNFTPlaceOrder(@RequestBody digitalAssetApprovalRejectRequest: DigitalAssetApprovalRejectRequest): ResponseEntity<FlowStatusResponse> {
        val flowStatusResponse = daRatingAndValuationService.valuationApproval(
            digitalAssetApprovalRejectRequest.assetRef,
            MarketplacePlaceOrderStatus.REJECT.toString()
        )
        return ResponseEntity(flowStatusResponse, HttpStatus.OK)
    }
}