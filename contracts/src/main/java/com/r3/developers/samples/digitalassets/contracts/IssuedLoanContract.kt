package com.r3.developers.samples.digitalassets.contracts
import com.r3.developers.samples.digitalassets.states.LoanState
import net.corda.v5.base.exceptions.CordaRuntimeException
import net.corda.v5.ledger.utxo.Command
import net.corda.v5.ledger.utxo.Contract
import net.corda.v5.ledger.utxo.transaction.UtxoLedgerTransaction
import kotlin.reflect.full.memberProperties

class IssuedLoanContract: Contract {

    class Issue: Command
    class Request: Command
    class Update: Command
    class Repay: Command

    override fun verify(transaction: UtxoLedgerTransaction) {
        val command = transaction.commands.firstOrNull { it is Issue }
            ?: throw CordaRuntimeException("Requires a single Mortgage command")
        val input = transaction.inputContractStates.first()
        val output = transaction.outputContractStates.first()

        val loanStateProperties = LoanState::class.memberProperties.map { property -> property.name }

        val notNullRequestLoanProperties =
            hashSetOf("loanId", "loanAmount", "participants", "linearId", "issuer", "requestor", "conta", "status")
        val notNullIssueLoanProperties = loanStateProperties.toHashSet()
        val notNullUpdateLoanProperties = loanStateProperties.toHashSet()
        notNullIssueLoanProperties.remove("releasedTokenIds")
        val notNullUpdateLoanProperties2 = loanStateProperties.toHashSet()
        notNullUpdateLoanProperties2.remove("collateralTokenIds")
        val notNullRepayLoanProperties = loanStateProperties.toHashSet()
        notNullRepayLoanProperties.remove("collateralTokenIds")

        when(command) {
            is Issue -> {
                "When command is Issue there should be no input states." using (transaction.inputContractStates.isEmpty())
                "When command is Issue there should be one and only one output state." using (transaction.outputContractStates.size == 1)
            }
            is Request -> {
                "The transaction must have exactly 0 input and 1 output when requesting a loan".using(transaction.inputContractStates.isEmpty() && output != null)
                "Issuer and Requester must be signers".using(transaction.signatories.containsAll(output.participants))
                //"The output must have only loanId,loanAmount and conta".using(getFilledProperties(output) == notNullRequestLoanProperties)
            }
            is Update -> {
                "The transaction must have exactly 1 input and 1 output when updating a loan".using(input != null && output != null)
                "Issuer and Requester must be signers".using(transaction.signatories.containsAll(output.participants))
                //"The output must have all fields filled out besides releasedTokenIds".using(getFilledProperties(output) == notNullIssueLoanProperties || getFilledProperties(output) == notNullUpdateLoanProperties || getFilledProperties(output) == notNullUpdateLoanProperties2)
                //"The output paidInstallments must be higher than input paidInstallments".using(input!!.paidInstallments!! < output.paidInstallments!!)
            }
            is Repay -> {
                "The transaction must have exactly 1 input and 0 output when repaying a loan".using(input != null && output != null)
                "Issuer and Requester must be signers".using(transaction.signatories.containsAll(output.participants))
                //"The output must have all fields filled out besides collateralTokenIds".using(getFilledProperties(output) == notNullRepayLoanProperties)
            }
            else -> {
                throw CordaRuntimeException("Command $command not allowed.")
            }
        }
    }

    // Helper function to allow writing constraints in the Corda 4 '"text" using (boolean)' style
    private infix fun String.using(expr: Boolean) {
        if (!expr) throw CordaRuntimeException("Failed requirement: $this")
    }

    // Helper function to allow writing constraints in '"text" using {lambda}' style where the last expression
    // in the lambda is a boolean.
    private infix fun String.using(expr: () -> Boolean) {
        if (!expr.invoke()) throw CordaRuntimeException("Failed requirement: $this")
    }
}