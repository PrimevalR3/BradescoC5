package com.r3.da.app.restapi.service

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@Transactional
class OffLedgerService(
) {


    companion object {
        private val logger = LoggerFactory.getLogger(OffLedgerService::class.java)
    }


}

