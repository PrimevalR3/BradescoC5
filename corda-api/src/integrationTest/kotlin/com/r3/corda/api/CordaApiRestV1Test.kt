package com.r3.corda.api

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.*

private const val ALICE = "CN=Alice, OU=Test Dept, O=R3, L=London, C=GB"
private const val BOB = "CN=Bob, OU=Test Dept, O=R3, L=London, C=GB"
private const val CSD = "CN=CSD, OU=IT Dept, O=Euroclear, L=London, C=GB"
private const val CUSTODIAN1 = "CN=Custodian1, OU=IT Dept, O=Custodian1, L=London, C=GB"

class CordaApiRestV1Test {

    @Test
    fun testIsAvailable() {
        val api = CordaApiRestV1("https://localhost:8888", "admin", "admin")
        api.isAvailable()
    }

    @Test
    fun testIsAvailableThrowsExceptionForBadServer() {
        try {
            val api = CordaApiRestV1("https://badserver:8888", "admin", "admin")
            api.isAvailable()
            fail()
        } catch (e: Exception) {}
    }

    @Test
    fun testIsAvailableThrowsExceptionForNoConnectivity() {
        try {
            val api = CordaApiRestV1("https://localhost:0101", "admin", "admin")
            api.isAvailable()
            fail()
        } catch (e: Exception) {}
    }

    @Test
    fun testGetVirtualNodes() {
        val api = CordaApiRestV1("https://localhost:8888", "admin", "admin")
        val nodes = api.getVirtualNodes()
        nodes.forEach { node ->
            println(node)
        }
        assertEquals(5, nodes.size)
    }

    @Test
    fun testGetVirtualNodeByX500Name() {
        val api = CordaApiRestV1("https://localhost:8888", "admin", "admin")
        val node = api.getVirtualNodeByX500Name(CSD)
        assertNotNull(node)
        assertEquals(CSD, node!!.holdingIdentity.x500Name)
    }

    @Test
    fun testGetVirtualNodeByX500NameReturnNullForNonExistentNode() {
        val api = CordaApiRestV1("https://localhost:8888", "admin", "admin")
        val node = api.getVirtualNodeByX500Name("CN=Foo")
        assertNull(node)
    }

    @Test
    fun startFlow() {
        val api = CordaApiRestV1("https://localhost:8888", "admin", "admin")

        val node = api.getVirtualNodeByX500Name(CSD)
        val requestId = UUID.randomUUID().toString()

        var response : FlowStatusResponse = api.startFlow(
            node!!.holdingIdentity.shortHash,
            FlowStartRequest(
                requestId,
                "com.r3.developers.csdetemplate.flowexample.workflows.MyFirstFlow",
                mapOf(Pair("otherMember", CUSTODIAN1))
            )
        )
        assertEquals(FlowStatus.START_REQUESTED, response.flowStatus)
    }

    @Test
    fun startFlowSync() {
        val api = CordaApiRestV1("https://localhost:8888", "admin", "admin")

        val node = api.getVirtualNodeByX500Name(CSD)
        val requestId = UUID.randomUUID().toString()

        var response : FlowStatusResponse = api.startFlowSync(
            node!!.holdingIdentity.shortHash,
            FlowStartRequest(
                requestId,
                "com.r3.developers.csdetemplate.flowexample.workflows.MyFirstFlow",
                mapOf(Pair("otherMember", CUSTODIAN1))
            )
        )
        assertEquals(FlowStatus.COMPLETED, response.flowStatus)
    }
}

data class FlowData (
    val otherMember: String
)
