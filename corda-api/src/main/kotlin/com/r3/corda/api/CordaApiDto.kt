package com.r3.corda.api

/**
 * A set of DTOs that are passed over a CordaAPI
 */

data class VirtualNodesResponse (
    val virtualNodes: Array<VirtualNode>
)

data class VirtualNode (
    val holdingIdentity: HoldingIdentity,
    val cpiIdentifier: CpiIdentifier
)

data class HoldingIdentity(
    val fullHash: String,
    val groupId: String,
    val shortHash: String,
    val x500Name: String
)

data class CpiIdentifier (
    val cpiName: String,
    val cpiVersion: String,
    val signerSummaryHash: String
)

data class FlowStartRequest (
    val clientRequestId: String,
    val flowClassName: String,
    val requestBody: Any
)

enum class FlowStatus {
    START_REQUESTED,
    RUNNING,
    COMPLETED,
    FAILED
}

data class FlowStatusResponse (
    val holdingIdentityShortHash: String,
    val clientRequestId: String,
    val flowId: String?,
    val flowStatus: FlowStatus,
    val flowError: FlowError?,
    val flowResult: String?,
    val timestamp: String
)

data class FlowError (
    val message: String,
    val type: String
)
