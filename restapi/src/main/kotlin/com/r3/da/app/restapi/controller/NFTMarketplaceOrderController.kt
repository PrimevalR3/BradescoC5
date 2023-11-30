package com.r3.da.app.restapi.controller

import com.r3.corda.api.FlowStatusResponse
import com.r3.da.app.restapi.dto.NftMarketPlaceOrderRequest
import com.r3.da.app.restapi.service.token.place.NFTMarketplaceOrderService
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
class NFTMarketplaceOrderController(private val nftMarketplaceOrderService: NFTMarketplaceOrderService) {

    companion object {
        private val logger = LoggerFactory.getLogger(NFTMarketplaceOrderController::class.java)
    }

    @PostMapping("/placenftmarketplaceorder")
    @ApiOperation(
        value = "API to place order in nft marketplace",
        notes = "API to place order in nft marketplace"
    )
    open fun placeOrderNFTMarketplace(@RequestBody nftMarketPlaceOrderRequest: NftMarketPlaceOrderRequest)
        : ResponseEntity<FlowStatusResponse> {
            val flowStatusResponse = nftMarketplaceOrderService.placeMarketplaceOrder(
                nftMarketPlaceOrderRequest.assetId,
                nftMarketPlaceOrderRequest.isValuationRequired,
                nftMarketPlaceOrderRequest.amount,
                nftMarketPlaceOrderRequest.custodian);
        return ResponseEntity(flowStatusResponse, HttpStatus.OK)
    }

}
