package com.r3.da.app.restapi.controller

import com.r3.corda.api.CordaApi
import com.r3.corda.api.VirtualNode
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("/api/v1") // The paths for HTTP requests are relative to this base path.
class Controller(@Autowired val cordaApi : CordaApi) {

    companion object {
        private val logger = LoggerFactory.getLogger(RestController::class.java)
    }

    @GetMapping(value = ["/getvirtualnode"], produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getVirtualNodes(): ResponseEntity<List<VirtualNode>> {
        return ResponseEntity.of(Optional.of(cordaApi.getVirtualNodes()))
    }

    @GetMapping(value = ["/getvirtualnodebyx500name"], produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getVirtualNodesbyX500Name(x500Name: String): ResponseEntity<VirtualNode> {
        return ResponseEntity.of(Optional.of(cordaApi.getVirtualNodeByX500Name(x500Name)!!))
    }

    @GetMapping(value = ["/getvirtualnodebyx500nameandCpiName"], produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getVirtualNodesbyX500NameAndCpiName(x500Name: String,cpiName: String): ResponseEntity<VirtualNode> {
        return ResponseEntity.of(Optional.of(cordaApi.getVirtualNodeByX500NameAndCpiName(x500Name,cpiName)!!))
    }
}
