package com.r3.corda.api

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.databind.ser.std.StdSerializer
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import kong.unirest.*
import net.corda.v5.base.types.MemberX500Name
import org.slf4j.LoggerFactory


/**
 * An interface to a Corda 5 cluster.
 */
interface CordaApi {
    /**
     * Returns the baseUrl of the Corda cluster that the CordaApi is connected to
     */
    fun url() : String

    /**
     * Checks to see if the CordaApi is connected.
     * @throws Exception if the CordaApi cannot connect to the Corda cluster
     */
    fun isAvailable()

    /**
     * Returns a list of Corda VirtualNodes that exist on the Corda cluster
     */
    fun getVirtualNodes(): List<VirtualNode>

    /**
     * Looks up a Corda VirtualNode by X500Name
     */
    fun getVirtualNodeByX500Name(x500Name: String): VirtualNode?


    fun getVirtualNodeByX500NameAndCpiName(x500Name: String, cpiName: String): VirtualNode?

    /**
     * Starts a Corda flow invocation asynchronously
     *
     * @param holdingIdentityShortHash the hash of the identity that will initiate the flow
     * @param flowStartRequest a FlowStartRequest object describing the flow
     * @return A FlowStatusResponse describing the current state of the flow
     */
    fun startFlow(holdingIdentityShortHash: String, flowStartRequest: FlowStartRequest) : FlowStatusResponse

    /**
     * Starts a Corda flow invocation synchronously - blocks until the flow completes or fails.
     *
     * @param holdingIdentityShortHash the hash of the identity that will initiate the flow
     * @param flowStartRequest a FlowStartRequest object describing the flow
     * @return A FlowStatusResponse describing the state of the flow
     */fun startFlowSync(holdingIdentityShortHash: String, flowStartRequest: FlowStartRequest) : FlowStatusResponse

    /**
     * Gets the current state of a flow invocation
     *
     * @param holdingIdentityShortHash the hash of the identity that will initiate the flow
     * @param clientRequestId the id of the flow to query
     * @return A FlowStatusResponse describing the current state of the flow
     */fun getFlowStatus(holdingIdentityShortHash: String, clientRequestId: String) : FlowStatusResponse


    /**
     * Check FlowStatus recursively
     *
     * @param holdingIdentityShortHash the hash of the identity that will initiate the flow
     * @param clientRequestId the id of the flow to query
     * @return A FlowStatusResponse describing the current state of the flow
     */fun checkFlowStatusRecursively(holdingIdentityShortHash: String, clientRequestId: String) : FlowStatusResponse
}

/**
 * Encapsulates a REST interface to a Corda 5 cluster.
 */
class CordaApiRestV1(val baseUrl: String, val username: String, val password: String) : CordaApi {

    companion object {
        private val API_ROOT = "api/v1"
        private val logger = LoggerFactory.getLogger(CordaApi::class.java)
        private val mapper: ObjectMapper = jacksonObjectMapper()
    }

    /**
     * Custom Logging interceptor that tries to print out request and response bodies appropriately
     */
    class LoggingInterceptor : Interceptor {
        override fun onRequest(request: HttpRequest<*>?, config: Config?) {
            logger.debug("Request >>>")
            logger.debug("  ${request!!.httpMethod} ${request.url}")
            request.body.ifPresent { b ->
                logger.debug("  ${b.uniPart().value}")
            }
            logger.debug(">>>")
        }

        override fun onResponse(response: HttpResponse<*>?, request: HttpRequestSummary?, config: Config?) {
            logger.debug("Response <<<")
            logger.debug("  ${response!!.status}")
            logger.debug("  ${response.body}")
            logger.debug("<<<")
        }
    }

    /**
     * Custom serializer for MemberX500Name that just writes as a String
     */
    class X500NameSerializer(t: Class<MemberX500Name>?) : StdSerializer<MemberX500Name>(t) {
        override fun serialize(value: MemberX500Name?, gen: JsonGenerator?, provider: SerializerProvider?) {
            gen?.writeString(value.toString())
        }
    }

    init {
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        val module = SimpleModule()
        module.addSerializer(MemberX500Name::class.java, X500NameSerializer(MemberX500Name::class.java))
        mapper.registerModule(module)

        Unirest.config()
            .interceptor(LoggingInterceptor())
            .verifySsl(false)
            .setObjectMapper(object:kong.unirest.ObjectMapper {
                override fun <T : Any?> readValue(value: String?, valueType: Class<T>?): T {
                    return mapper.readValue(value, valueType)
                }

                override fun writeValue(value: Any?): String {
                    return mapper.writeValueAsString(value)
                }
            })

        logger.info("Connecting to ${baseUrl} as ${username}")
    }

    override fun url(): String = baseUrl

    override fun isAvailable() {
        val response = Unirest.get("${baseUrl}/$API_ROOT/hello/getprotocolversion")
            .basicAuth(username, password)
            .asBytes()
        if (!response.isSuccess)
            throw Exception("Cannot connect to Corda")
    }

    /**
     * Get all VirtualNodes
     */
    override fun getVirtualNodes(): List<VirtualNode> {
        return Unirest.get("${baseUrl}/$API_ROOT/virtualnode")
            .basicAuth(username, password)
                .asObject(VirtualNodesResponse::class.java)
                .body!!.virtualNodes.asList()
    }

    /**
     * Get virtualnodes by X500Name
     */
    override fun getVirtualNodeByX500Name(x500Name: String): VirtualNode? {
        return getVirtualNodes().filter { node ->
            node.holdingIdentity.x500Name.toString().equals(x500Name)
        }.firstOrNull()
    }



    override fun getVirtualNodeByX500NameAndCpiName(x500Name: String,cpiName: String): VirtualNode? {
        return getVirtualNodes().filter { node ->
            node.holdingIdentity.x500Name.toString().equals(x500Name) &&  node.cpiIdentifier.cpiName.equals(cpiName)
        }.firstOrNull()
    }

    /**
     * Asynchronous Corda flow invocation
     */
    override fun startFlow(holdingIdentityShortHash: String,
                           flowStartRequest: FlowStartRequest) : FlowStatusResponse {
        return Unirest.post("${baseUrl}/$API_ROOT/flow/" + holdingIdentityShortHash)
            .basicAuth(username, password)
                .body(flowStartRequest)
                .asObject(FlowStatusResponse::class.java)
                .body
    }
    /**
     * Synchronous Corda flow invocation
     */
    override fun startFlowSync(holdingIdentityShortHash: String,
                           flowStartRequest: FlowStartRequest) : FlowStatusResponse {
        startFlow(holdingIdentityShortHash, flowStartRequest)
        var flowResponse : FlowStatusResponse
        val runningStatus = listOf(FlowStatus.START_REQUESTED, FlowStatus.RUNNING)
        do {
            Thread.sleep(1000)
            flowResponse = getFlowStatus(holdingIdentityShortHash, flowStartRequest.clientRequestId)
        } while (runningStatus.contains(flowResponse.flowStatus))
        return flowResponse
    }

    /**
     * fetch the corda flow status
     */
    override fun getFlowStatus(holdingIdentityShortHash: String,
                                clientRequestId: String) : FlowStatusResponse {
        return Unirest.get("${baseUrl}/$API_ROOT/flow/" + holdingIdentityShortHash + "/" + clientRequestId)
            .basicAuth(username, password)
                .asObject(FlowStatusResponse::class.java)
                .body
    }

    override fun checkFlowStatusRecursively(holdingIdentityShortHash: String,
                                            clientRequestId: String) : FlowStatusResponse {
        var flowResponse : FlowStatusResponse
        val completedStatus = listOf(FlowStatus.START_REQUESTED, FlowStatus.RUNNING)
        do {
            Thread.sleep(40000)
            flowResponse = getFlowStatus(holdingIdentityShortHash, clientRequestId)
            logger.info("Recursive flowstatus check for eventId $clientRequestId ==>${flowResponse.flowStatus}")
        } while (completedStatus.contains(flowResponse.flowStatus))
        return flowResponse
    }
}
