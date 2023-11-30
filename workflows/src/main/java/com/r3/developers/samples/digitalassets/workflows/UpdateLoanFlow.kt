package com.r3.developers.samples.digitalassets.workflows

import com.r3.developers.samples.digitalassets.contracts.IssuedLoanContract
import com.r3.developers.samples.digitalassets.states.LoanState
import net.corda.v5.application.flows.*
import net.corda.v5.application.messaging.FlowSession
import net.corda.v5.base.annotations.Suspendable
import net.corda.v5.base.exceptions.CordaRuntimeException
import net.corda.v5.base.types.MemberX500Name
import net.corda.v5.base.types.MemberX500Name.parse
import java.security.PublicKey
import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.util.*

data class UpdateLoan(
    val loanID: String,
    val requester: String,
    val instalments: Int?,
    val paidInstalments: Int?,
    val collateralTokenIDs: List<PublicKey>,
    val amountCollateralized: String
)
//                            val comments: List<String> = emptyList()


@InitiatingFlow(protocol = "finalize-create-loan-flow")
class UpdateLoanFlow(): AbstractFlow(), ClientStartableFlow {
    @Suspendable
    override fun call(requestBody: ClientRequestBody): String {
        logger.info("${this::class.java.enclosingClass}.call() called")
        try {
            val myInfo = memberLookup.myInfo()
            val flowArgs = requestBody.getRequestBodyAs(json, UpdateLoan::class.java)
            val customerIdentity = memberLookup.lookup(MemberX500Name.parse(flowArgs.requester))?:
            throw CordaRuntimeException("MemberLookup can't find customer specified in flow arguments.")
            val lastLoanState = ledgerService.findUnconsumedStatesByType(LoanState::class.java).filter { loan ->
                loan.state.contractState.loanId.toString() == flowArgs.loanID
            }
            val loanStateFirst = lastLoanState.first()
            val issuanceDate = LocalDate.now().toString()
            val issuedLoanState = LoanState(
                issuer = myInfo.ledgerKeys.first(),
                conta = lastLoanState.first().state.contractState.conta,
                installments = flowArgs.instalments,
                firstInstallmentDate = lastLoanState.first().state.contractState.firstInstallmentDate,
                loanAmount = lastLoanState.first().state.contractState.loanAmount,
                totalCost = lastLoanState.first().state.contractState.totalCost,
                paidInstallments = flowArgs.paidInstalments ?: 1,
                collateralTokenIds = lastLoanState.first().state.contractState.collateralTokenIds.plus(flowArgs.collateralTokenIDs),
                amountCollateralized = flowArgs.amountCollateralized,
                releasedTokenIds = listOf(),
                status = "ISSUED",
                participants = listOf(myInfo.ledgerKeys.first(),customerIdentity.ledgerKeys.first())

            )

            val notary = notaryLookup.notaryServices.single()
            val signatories = mutableListOf<PublicKey>(myInfo.ledgerKeys.first()).union(loanStateFirst.state.contractState.participants)

            val txBuilder = ledgerService.createTransactionBuilder()
                .setNotary(notary.name)
                .setTimeWindowBetween(Instant.now(), Instant.now().plusMillis(Duration.ofDays(1).toMillis()))
                .addInputState(lastLoanState.map { it.ref })
                .addOutputState(issuedLoanState)
                .addCommand(IssuedLoanContract.Issue())
                .addSignatories(signatories)

            // List to hold all the flow sessions
            val sessions = mutableListOf<FlowSession>()

            // Initiate a flow session with each participant
            for (participant in loanStateFirst.state.contractState.participants) {
                logger.warn("participant: $participant")
                val node = memberLookup.lookup(participant)
                if (node != null) {
                    logger.warn("flow session initiated for ${node.name}")
                    sessions.add(flowMessaging.initiateFlow(node.name))
                }
            }


            val signedTransaction = txBuilder.toSignedTransaction()

            // Sign the transaction and collect signatures from all participants
            val finalizedSignedTransaction = ledgerService.finalize(signedTransaction, sessions)

            return finalizedSignedTransaction.transaction.id.toString().also {
                logger.info("Successful ${signedTransaction.commands.first()} with response: $it")
            }
        }
        catch (e: Exception) {
            logger.warn("create bond failed")
            throw e
        }
    }
}

@InitiatedBy(protocol = "finalize-create-loan-flow")
class FinalizeUpdateLoanResponderFlow: AbstractFlow(), ResponderFlow {

    @Suspendable
    override fun call(session: FlowSession) {
        logger.info("${this::class.java.enclosingClass}.call() called")

        try {
            val finalizedSignedTransaction = ledgerService.receiveFinality(session) { ledgerTransaction ->

                logger.info("Verified the transaction- ${ledgerTransaction.id}")
            }
            logger.info("Finished create loan responder flow - ${finalizedSignedTransaction.transaction.id}")
        }
        catch (e: Exception) {
            logger.warn("Create Loan responder flow failed with exception", e)
            throw e
        }
    }
}

