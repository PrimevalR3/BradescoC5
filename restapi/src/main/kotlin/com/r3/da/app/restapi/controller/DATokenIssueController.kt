package com.r3.da.app.restapi.controller

import com.r3.corda.api.FlowStatusResponse
import com.r3.da.app.restapi.dto.NFTDigitalAsset
import com.r3.da.app.restapi.service.token.issue.DigitalAssetIssuanceService
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
class DATokenIssueController(private val digitalAssetIssuanceService: DigitalAssetIssuanceService) {

    companion object {
        private val logger = LoggerFactory.getLogger(DATokenIssueController::class.java)
    }

    @PostMapping("/issuedigitalassettoken")
    @ApiOperation(
        value = "API to issue digit asset token",
        notes = "API to issue digit asset token"
    )
    open fun issueDigitalAssetToken(@RequestBody nftdigitalasset: NFTDigitalAsset): ResponseEntity<FlowStatusResponse> {
        val flowStatusResponse = digitalAssetIssuanceService.issueDigitalAssetToken(nftdigitalasset.title,nftdigitalasset.description,nftdigitalasset.artist)
        return ResponseEntity(flowStatusResponse, HttpStatus.OK)
    }

}
