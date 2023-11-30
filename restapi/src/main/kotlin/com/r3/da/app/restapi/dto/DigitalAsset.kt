package com.r3.da.app.restapi.dto
import com.fasterxml.jackson.annotation.JsonProperty
import java.math.BigDecimal
import java.util.*

data class NFTDigitalAsset(
    @JsonProperty("title")
    val title: String,
    @JsonProperty("description")
    val description: String,
    @JsonProperty("artist")
    val artist: String
)

data class DigitalAssetApprovalRejectRequest(
    @JsonProperty("assetRef")
    val assetRef: String
)

data class NftMarketPlaceOrderRequest(
    @JsonProperty("assetId")
    val assetId: String,
    @JsonProperty("isValuationRequired")
    val isValuationRequired: Boolean,
    @JsonProperty("amount")
    val amount: BigDecimal,
    @JsonProperty("custodian")
    val custodian: String
)

data class WithdrawPlacementRequest(
    @JsonProperty("assetRef")
    val assetRef: String,
)

data class ValuateAssetRequest(
    @JsonProperty("assetRef")
    val assetRef: String,
    @JsonProperty("valuation")
    val valuation: BigDecimal,
)