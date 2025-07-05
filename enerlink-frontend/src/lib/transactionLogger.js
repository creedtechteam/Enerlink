// Transaction Logger Utility
// This logs all transactions to localStorage for the notifications page

export const logTransaction = (transactionData) => {
  try {
    // Get existing transactions
    const existingTransactions = JSON.parse(localStorage.getItem("enerlink_transactions") || "[]")

    // Create new transaction log entry matching the design
    const transactionLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      signature: transactionData.signature || "demo_transaction",
      userWallet: transactionData.userWallet || transactionData.publicKey,
      phoneNumber: transactionData.phoneNumber,
      packageType: transactionData.packageType,
      provider: transactionData.provider,
      packageAmount: transactionData.packageAmount,
      solAmount: transactionData.solAmount || transactionData.amount,
      status: transactionData.status || "completed",
      verificationToken: transactionData.verificationToken,
      network: "devnet",
      explorerUrl: transactionData.signature
        ? `https://explorer.solana.com/tx/${transactionData.signature}?cluster=devnet`
        : null,

      // Design-specific fields
      type: transactionData.packageType === "data" ? "data" : "airtime",
      amount: `$${(transactionData.solAmount || transactionData.amount || 0).toFixed(3)}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      icon: transactionData.packageType === "data" ? "data" : "airtime",
      isNegative: false,
    }

    // Add to beginning of array (newest first)
    existingTransactions.unshift(transactionLog)

    // Keep only last 50 transactions to prevent localStorage bloat
    const limitedTransactions = existingTransactions.slice(0, 50)

    // Save back to localStorage
    localStorage.setItem("enerlink_transactions", JSON.stringify(limitedTransactions))

    console.log("Transaction logged to notifications:", transactionLog.id)
    return transactionLog
  } catch (error) {
    console.error("Failed to log transaction:", error)
    return null
  }
}

export const getTransactionHistory = () => {
  try {
    return JSON.parse(localStorage.getItem("enerlink_transactions") || "[]")
  } catch (error) {
    console.error("Failed to get transaction history:", error)
    return []
  }
}

export const clearTransactionHistory = () => {
  try {
    localStorage.removeItem("enerlink_transactions")
    console.log("Transaction history cleared")
    return true
  } catch (error) {
    console.error("Failed to clear transaction history:", error)
    return false
  }
}
