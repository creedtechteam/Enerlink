"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "../contexts/WalletContext"

export function useTokens() {
  const { connection, publicKey, connected } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Since we're only using SOL for payments now, we don't need token balances
  // This hook is kept for future use if needed

  const fetchTokenBalances = useCallback(async () => {
    if (!connected || !publicKey) return

    setLoading(true)
    setError(null)

    try {
      // For now, we don't fetch any token balances since we only use SOL
      // This can be extended later if needed
      console.log("Token balance fetching not needed for current MVP")
    } catch (err) {
      console.error("Error fetching token balances:", err)
      setError("Failed to fetch token balances")
    } finally {
      setLoading(false)
    }
  }, [connected, publicKey])

  // Auto-fetch balances when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchTokenBalances()
    }
  }, [connected, publicKey, fetchTokenBalances])

  return {
    loading,
    error,
    refetch: fetchTokenBalances,
  }
}
