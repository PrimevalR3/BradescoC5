package com.r3.developers.samples.digitalassets.workflows

import com.r3.developers.samples.digitalassets.states.CollateralTokenState
import com.r3.developers.samples.digitalassets.states.LoanState
import net.corda.v5.application.flows.ClientRequestBody
import net.corda.v5.application.flows.ClientStartableFlow
import net.corda.v5.application.flows.CordaInject
import net.corda.v5.application.marshalling.JsonMarshallingService
import net.corda.v5.application.membership.MemberLookup
import net.corda.v5.base.annotations.Suspendable
import net.corda.v5.ledger.utxo.UtxoLedgerService
import org.slf4j.LoggerFactory
import java.util.Date

data class ViewCollateralTokens(
    val tokenId: String,
    val issuer: String,
    val requester: String,
)
class ViewCollateralTokensFlow : ClientStartableFlow {
    private companion object {
        val log= LoggerFactory.getLogger(this::class.java.enclosingClass)
    }

    @CordaInject
    lateinit var jsonMarshallingService: JsonMarshallingService

    @CordaInject
    lateinit var ledgerService: UtxoLedgerService

    @CordaInject
    lateinit var memberLookup: MemberLookup

    @Suspendable
    override fun call(requestBody: ClientRequestBody): String {
        log.info("ViewProspectusFlow.call() called")
        val queryingMember = memberLookup.myInfo()
        val states = ledgerService.findUnconsumedStatesByType(CollateralTokenState::class.java).filter { collateralToken ->
            collateralToken.state.contractState.issuer== queryingMember.ledgerKeys.first()
        }

        val results = states.map {
            ViewCollateralTokens(
                it.state.contractState.collateralId.toString(),
                it.state.contractState.requester.toString(),
                it.state.contractState.issuer.toString(),)
        }

        return jsonMarshallingService.format(results)
    }
}