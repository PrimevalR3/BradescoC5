package com.r3.da.app.restapi.config

import com.r3.corda.api.CordaApi
import com.r3.corda.api.CordaApiRestV1
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class CordaApiConfig (
    @Value("\${corda.rpc.baseUrl}") private val cordaApiBaseUrl: String,
    @Value("\${corda.rpc.username}") private val cordaApiUsername: String,
    @Value("\${corda.rpc.password}") private val cordaApiPassword: String
) {
    @Bean
    fun cordaApi() : CordaApi = CordaApiRestV1(cordaApiBaseUrl, cordaApiUsername, cordaApiPassword)
}