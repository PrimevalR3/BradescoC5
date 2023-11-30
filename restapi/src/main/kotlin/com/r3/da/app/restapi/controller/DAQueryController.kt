package com.r3.da.app.restapi.controller

import com.r3.corda.api.FlowStatusResponse
import com.r3.da.app.restapi.service.token.query.DigitalAssetQueryService
import io.swagger.annotations.ApiOperation
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/v1") // The paths for HTTP requests are relative to this base path.
class DAQueryController(private val digitalAssetQueryService: DigitalAssetQueryService) {

    companion object {
        private val logger = LoggerFactory.getLogger(DAQueryController::class.java)
    }

    @GetMapping("/listDigitalAssets")
    @ApiOperation(
        value = "API to list Digital Assets in vault",
        notes = "API to list Digital Assets in vault"
    )
    open fun listDigitalAssets(@RequestParam legalEntity:String): ResponseEntity<FlowStatusResponse> {
        val flowStatusResponse = digitalAssetQueryService.listDigitalAssets(legalEntity)
        return ResponseEntity(flowStatusResponse, HttpStatus.OK)
    }

    @GetMapping("/listDigitalAssetLinkedTokens")
    @ApiOperation(
        value = "API to list Digital Assets linked tokens in vault",
        notes = "API to list Digital Assets linked tokens in vault"
    )
    open fun listDigitalAssetLinkedTokens(@RequestParam legalEntity:String): ResponseEntity<FlowStatusResponse> {
        val flowStatusResponse = digitalAssetQueryService.listDigitalAssetLinkedTokens(legalEntity)
        return ResponseEntity(flowStatusResponse, HttpStatus.OK)
    }
}
