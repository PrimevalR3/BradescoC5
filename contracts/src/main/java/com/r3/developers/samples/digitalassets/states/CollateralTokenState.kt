package com.r3.developers.samples.digitalassets.states

import com.r3.developers.samples.digitalassets.contracts.IssuedLoanContract
import net.corda.v5.ledger.utxo.BelongsToContract
import net.corda.v5.ledger.utxo.ContractState
import java.security.PublicKey
import java.time.LocalDate
import java.util.UUID

@BelongsToContract(IssuedLoanContract::class)
class CollateralTokenState(
    val collateralId: UUID = UUID.randomUUID(),
    val issuer: PublicKey,
    val requester: PublicKey,
    val conta: String,
    val collateralTypeCode: String,
    val collateralSubtypeCode: String,
    val collateralType: String,
    val collateralSubtype: String,
    val associatedLoanIDs: List<PublicKey>,
    val totalValue: Int?,
    val lockedAmount: Int?,
    val dueDate: LocalDate? = null,
    private val participants: List<PublicKey>):ContractState {
    override fun getParticipants(): List<PublicKey> {
        return listOf(issuer, requester)
    }
    val owner: PublicKey get() = requester
    val linearId: UUID get() = collateralId
}