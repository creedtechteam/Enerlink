import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  Keypair,
  Connection,
} from "@solana/web3.js"
import { CONTRACTS, NETWORK_CONFIG } from "./contracts"

// Calculate the correct discriminator for payNative method
// Anchor uses SHA256("global:pay_native")[0..8] as discriminator
function calculateDiscriminator(methodName) {
  const crypto = require("crypto")
  const hash = crypto.createHash("sha256").update(`global:${methodName}`).digest()
  return Array.from(hash.slice(0, 8))
}

// Get the correct discriminator for payNative
const PAY_NATIVE_DISCRIMINATOR = calculateDiscriminator("pay_native")

// Create payment instruction according to the PDF specification
const createPaymentInstruction = (userPublicKey, treasuryPda, paymentLogPubkey, amount) => {
  // Convert SOL to lamports
  const lamports = Math.floor(amount * LAMPORTS_PER_SOL)

  // Create instruction data buffer: 8 bytes discriminator + 8 bytes for u64 amount
  const instructionData = Buffer.alloc(16)

  // Write discriminator (8 bytes)
  Buffer.from(PAY_NATIVE_DISCRIMINATOR).copy(instructionData, 0)

  // Write amount as little-endian u64 (8 bytes)
  instructionData.writeBigUInt64LE(BigInt(lamports), 8)

  return new TransactionInstruction({
    programId: new PublicKey(CONTRACTS.PAYMENT_PROCESSOR),
    keys: [
      // Based on the PDF Context<PayNative> structure:
      { pubkey: treasuryPda, isSigner: false, isWritable: true }, // treasury_account
      { pubkey: paymentLogPubkey, isSigner: true, isWritable: true }, // payment_log
      { pubkey: userPublicKey, isSigner: true, isWritable: true }, // user (payer)
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // system_program
    ],
    data: instructionData,
  })
}

// Process payment through smart contract
export const processPayment = async ({
  amount,
  publicKey,
  phoneNumber,
  packageType,
  provider,
  packageAmount,
  signAndSendTransaction,
}) => {
  try {
    console.log("Processing payment:", { amount, publicKey, phoneNumber, packageType, provider, packageAmount })

    // Create connection
    const connection = new Connection(NETWORK_CONFIG.devnet.rpcUrl, "confirmed")

    // Create user public key
    const userPubkey = new PublicKey(publicKey)

    // Find treasury PDA according to PDF: seeds = [b"treasury"]
    const [treasuryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      new PublicKey(CONTRACTS.PAYMENT_PROCESSOR),
    )

    // Generate keypair for payment log account
    const paymentLogKeypair = Keypair.generate()

    console.log("Treasury PDA:", treasuryPda.toString())
    console.log("Payment Log:", paymentLogKeypair.publicKey.toString())
    console.log("User:", userPubkey.toString())
    console.log("Discriminator:", PAY_NATIVE_DISCRIMINATOR)

    // Get recent blockhash and rent exemption
    console.log("Getting recent blockhash and calculating rent...")
    const { blockhash } = await connection.getLatestBlockhash()

    // Calculate rent for payment log account
    const PAYMENT_LOG_SIZE = 8 + 32 + 8 + 8 // discriminator + user + amount + timestamp
    const rentExemption = await connection.getMinimumBalanceForRentExemption(PAYMENT_LOG_SIZE)

    // Create transaction
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: userPubkey,
    })

    // Add account creation instruction for payment log
    const createAccountIx = SystemProgram.createAccount({
      fromPubkey: userPubkey,
      newAccountPubkey: paymentLogKeypair.publicKey,
      lamports: rentExemption,
      space: PAYMENT_LOG_SIZE,
      programId: new PublicKey(CONTRACTS.PAYMENT_PROCESSOR),
    })
    transaction.add(createAccountIx)

    // Add payment instruction
    const paymentInstruction = createPaymentInstruction(userPubkey, treasuryPda, paymentLogKeypair.publicKey, amount)
    transaction.add(paymentInstruction)

    // Partial sign with payment log keypair
    console.log("Partial signing with payment log keypair...")
    transaction.partialSign(paymentLogKeypair)

    console.log("Signing and sending transaction...")

    // Sign and send transaction using wallet context
    const signature = await signAndSendTransaction(transaction)

    console.log("Transaction successful:", signature)

    // Notify backend about successful payment
    try {
      await notifyBackend({
        signature,
        amount,
        phoneNumber,
        packageType,
        provider,
        packageAmount,
        userPublicKey: publicKey,
        treasuryPda: treasuryPda.toString(),
        paymentLog: paymentLogKeypair.publicKey.toString(),
      })
    } catch (backendError) {
      console.warn("Backend notification failed:", backendError)
      // Don't fail the transaction if backend notification fails
    }

    return {
      success: true,
      signature,
      message: "Payment processed successfully",
      treasuryPda: treasuryPda.toString(),
      paymentLog: paymentLogKeypair.publicKey.toString(),
    }
  } catch (error) {
    console.error("Payment processing failed:", error)
    return {
      success: false,
      error: error.message || "Payment processing failed",
    }
  }
}

// Notify backend about successful payment for telecom API processing
const notifyBackend = async (paymentData) => {
  try {
    const response = await fetch("/api/process-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      throw new Error(`Backend notification failed: ${response.status}`)
    }

    const result = await response.json()
    console.log("Backend notified successfully:", result)
    return result
  } catch (error) {
    console.error("Backend notification error:", error)
    throw error
  }
}
