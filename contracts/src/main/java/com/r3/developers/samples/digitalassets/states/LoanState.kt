package com.r3.developers.samples.digitalassets.states

import com.r3.developers.samples.digitalassets.contracts.IssuedLoanContract
import net.corda.v5.ledger.utxo.BelongsToContract
import net.corda.v5.ledger.utxo.ContractState
import java.security.PublicKey
import java.util.*

@BelongsToContract(IssuedLoanContract::class)
class LoanState(
    val issuer: PublicKey,
    val loanAmount: Int?,
    val totalCost: Int?,
    val amountCollateralized: String,
    val loanId: UUID = UUID.randomUUID(),
    val conta: String,
    val installments: Int?,
    val firstInstallmentDate: Date?,
    val paidInstallments: Int?,
    val collateralTokenIds: List<PublicKey> = listOf(),
    val releasedTokenIds: List<PublicKey> = listOf(),
    val status: String?,
    val requester: PublicKey,
    private val participants: List<PublicKey>):ContractState {
    override fun getParticipants(): List<PublicKey> {
        return listOf(issuer, requester)
    }
    fun getCollateralTokenIds(): List<PublicKey> {
        return collateralTokenIds
    }
    fun getReleasedTokenIds(): List<PublicKey> {
        return releasedTokenIds
    }
}