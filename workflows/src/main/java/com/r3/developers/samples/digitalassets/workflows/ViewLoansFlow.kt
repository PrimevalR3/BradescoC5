package com.r3.developers.samples.digitalassets.workflows

import com.r3.developers.samples.digitalassets.states.LoanState
import net.corda.v5.application.flows.ClientRequestBody
import net.corda.v5.application.flows.ClientStartableFlow
import net.corda.v5.application.flows.CordaInject
import net.corda.v5.application.flows.InitiatingFlow
import net.corda.v5.application.marshalling.JsonMarshallingService
import net.corda.v5.application.membership.MemberLookup
import net.corda.v5.base.annotations.Suspendable
import net.corda.v5.ledger.utxo.UtxoLedgerService
import org.slf4j.LoggerFactory
import java.util.Date

data class ViewLoans(
    val loanId: String,
    val issuer: String,
    val requester: String
)
@InitiatingFlow(protocol = "view-loans-key-flow")
class ViewLoansFlow : ClientStartableFlow , AbstractFlow() {
    private companion object {
        val log= LoggerFactory.getLogger(this::class.java.enclosingClass)
    }

    @CordaInject
    lateinit var jsonMarshallingService: JsonMarshallingService


    @Suspendable
    override fun call(requestBody: ClientRequestBody): String {
        log.info("ViewProspectusFlow.call() called")
        val flowArgs = requestBody.getRequestBodyAs(json, ViewLoans::class.java)
        val queryingMember = memberLookup.myInfo()
        val states = ledgerService.findUnconsumedStatesByType(LoanState::class.java).filter { loan ->
            loan.state.contractState.loanId.toString()== flowArgs.loanId
        }

        val results = states.map {
            ViewLoans(
                it.state.contractState.loanId.toString(),
                it.state.contractState.requester.toString(),
                it.state.contractState.issuer.toString(),)
        }

        return jsonMarshallingService.format(results)
    }
}