package com.r3.da.app.restapi.model.enum

enum class Status {
    InProgress,
    Completed,
    Received,
    Error
}

enum class FlowStatus {
    COMPLETED,
    START_REQUESTED,
    FAILED,
    RUNNING
}


enum class MarketplacePlaceOrderStatus {
    DRAFT,
    APPROVE,
    REJECT,
    WITHDRAW
}