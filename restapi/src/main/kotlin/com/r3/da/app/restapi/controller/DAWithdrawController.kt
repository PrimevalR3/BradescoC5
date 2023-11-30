package com.r3.da.app.restapi.controller

import com.r3.corda.api.FlowStatusResponse
import com.r3.da.app.restapi.dto.WithdrawPlacementRequest
import com.r3.da.app.restapi.service.token.withdraw.DAWithdrawService
import io.swagger.annotations.ApiOperation
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1")
class DAWithdrawController(
    private val daWithdrawService: DAWithdrawService
) {

    companion object {
        private val logger = LoggerFactory.getLogger(DAWithdrawController::class.java)
    }

    @PostMapping("/withdrawPlacement")
    @ApiOperation(
        value = "API to withdraw placement",
        notes = "API to withdraw placement"
    )
    open fun withdrawPlacement(@RequestBody withdrawPlacementRequest: WithdrawPlacementRequest)
    : ResponseEntity<FlowStatusResponse> {
        val flowStatusResponse = daWithdrawService.withdrawPlacement(withdrawPlacementRequest.assetRef);
        return ResponseEntity(flowStatusResponse, HttpStatus.OK)
    }
}