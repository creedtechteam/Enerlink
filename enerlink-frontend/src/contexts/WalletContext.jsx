"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { NETWORK_CONFIG } from "../lib/contracts"
import { fetchUserProfile, generateUserProfile } from "../lib/api"

const WalletContext = createContext({})

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState(null)
  const [balance, setBalance] = useState(0)
  const [error, setError] = useState(null)
  const [walletAdapter, setWalletAdapter] = useState(null)

  // Ener ID related state
  const [enerID, setEnerID] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  // Use devnet with fallback to backup RPC
  const connection = new Connection(NETWORK_CONFIG.devnet.rpcUrl, {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60000,
  })

  // Load saved wallet connection on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem("connectedWallet")
    const savedPublicKey = localStorage.getItem("walletPublicKey")
    const savedEnerID = localStorage.getItem("userEnerID")
    const savedProfile = localStorage.getItem("userProfile")

    if (savedWallet && savedPublicKey) {
      setWallet(savedWallet)
      setPublicKey(new PublicKey(savedPublicKey))
      setConnected(true)
      fetchBalance(new PublicKey(savedPublicKey))

      // Try to reconnect to the wallet adapter
      if (savedWallet === "Phantom" && typeof window !== "undefined" && window.solana) {
        setWalletAdapter(window.solana)
      } else if (savedWallet === "Solflare" && typeof window !== "undefined" && window.solflare) {
        setWalletAdapter(window.solflare)
      }

      // Load saved Ener ID and profile
      if (savedEnerID) {
        setEnerID(savedEnerID)
      }
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile))
      }
    }
  }, [])

  // Fetch wallet balance with error handling
  const fetchBalance = useCallback(
    async (pubKey) => {
      try {
        console.log("Fetching balance for:", pubKey.toString())
        const balance = await connection.getBalance(pubKey)
        setBalance(balance / LAMPORTS_PER_SOL)
        console.log("Balance fetched successfully:", balance / LAMPORTS_PER_SOL)
      } catch (err) {
        console.error("Failed to fetch balance:", err)
        // Set a default balance instead of failing
        setBalance(0)
        // Don't show error for balance fetch failures
      }
    },
    [connection],
  )

  // Fetch or generate user profile after wallet connection
  const handleUserProfile = useCallback(async (walletAddress) => {
    setLoadingProfile(true)
    setError(null)

    try {
      console.log("Fetching user profile for:", walletAddress)

      // First, try to fetch existing profile
      const profileResponse = await fetchUserProfile(walletAddress)

      if (profileResponse.success && profileResponse.data) {
        // User already has a profile
        console.log("Found existing profile:", profileResponse.data)
        setUserProfile(profileResponse.data)
        setEnerID(profileResponse.data.enerID)

        // Save to localStorage
        localStorage.setItem("userEnerID", profileResponse.data.enerID)
        localStorage.setItem("userProfile", JSON.stringify(profileResponse.data))
      } else {
        // User doesn't have a profile, generate one
        console.log("No existing profile found, generating new one...")
        const generateResponse = await generateUserProfile(walletAddress)

        if (generateResponse.success && generateResponse.data) {
          console.log("Generated new profile:", generateResponse.data)
          setUserProfile(generateResponse.data)
          setEnerID(generateResponse.data.enerID)

          // Save to localStorage
          localStorage.setItem("userEnerID", generateResponse.data.enerID)
          localStorage.setItem("userProfile", JSON.stringify(generateResponse.data))
        } else {
          throw new Error(generateResponse.error || "Failed to generate profile")
        }
      }
    } catch (err) {
      console.error("Error handling user profile:", err)
      setError("Failed to setup user profile")
    } finally {
      setLoadingProfile(false)
    }
  }, [])

  // Handle wallet events
  const setupWalletEvents = useCallback(
    (walletInstance) => {
      if (walletInstance) {
        walletInstance.on("connect", async (publicKey) => {
          console.log("Wallet connected to devnet:", publicKey.toString())
          setPublicKey(publicKey)
          setConnected(true)
          await fetchBalance(publicKey)

          // Fetch or generate user profile
          await handleUserProfile(publicKey.toString())
        })

        walletInstance.on("disconnect", () => {
          console.log("Wallet disconnected")
          setWallet(null)
          setPublicKey(null)
          setConnected(false)
          setBalance(0)
          setEnerID(null)
          setUserProfile(null)
          setWalletAdapter(null)

          // Clear localStorage
          localStorage.removeItem("connectedWallet")
          localStorage.removeItem("walletPublicKey")
          localStorage.removeItem("userEnerID")
          localStorage.removeItem("userProfile")
        })
      }
    },
    [fetchBalance, handleUserProfile],
  )

  // Connect to Phantom wallet
  const connectPhantom = useCallback(async () => {
    try {
      setConnecting(true)
      setError(null)

      // Check if Phantom is available (for testing in browser)
      if (typeof window !== "undefined" && window.solana && window.solana.isPhantom) {
        const response = await window.solana.connect({ onlyIfTrusted: false })

        setWallet("Phantom")
        setPublicKey(response.publicKey)
        setConnected(true)
        setWalletAdapter(window.solana)

        localStorage.setItem("connectedWallet", "Phantom")
        localStorage.setItem("walletPublicKey", response.publicKey.toString())

        setupWalletEvents(window.solana)
        await fetchBalance(response.publicKey)

        // Fetch or generate user profile
        await handleUserProfile(response.publicKey.toString())

        return true
      } else {
        // Mobile deep linking
        const currentUrl = encodeURIComponent(window.location.href)
        const phantomUrl = `phantom://browse/${currentUrl}?action=connect`

        window.location.href = phantomUrl

        setTimeout(() => {
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
          const storeUrl = isIOS
            ? "https://apps.apple.com/app/phantom-solana-wallet/id1598432977"
            : "https://play.google.com/store/apps/details?id=app.phantom"
          window.open(storeUrl, "_blank")
        }, 2000)

        return false
      }
    } catch (err) {
      console.error("Phantom connection failed:", err)
      setError("Failed to connect to Phantom wallet")
      return false
    } finally {
      setConnecting(false)
    }
  }, [setupWalletEvents, fetchBalance, handleUserProfile])

  // Connect to Solflare wallet
  const connectSolflare = useCallback(async () => {
    try {
      setConnecting(true)
      setError(null)

      if (typeof window !== "undefined" && window.solflare) {
        const response = await window.solflare.connect()

        setWallet("Solflare")
        setPublicKey(response.publicKey)
        setConnected(true)
        setWalletAdapter(window.solflare)

        localStorage.setItem("connectedWallet", "Solflare")
        localStorage.setItem("walletPublicKey", response.publicKey.toString())

        setupWalletEvents(window.solflare)
        await fetchBalance(response.publicKey)

        // Fetch or generate user profile
        await handleUserProfile(response.publicKey.toString())

        return true
      } else {
        const currentUrl = encodeURIComponent(window.location.href)
        const solflareUrl = `solflare://browse/${currentUrl}?action=connect`

        window.location.href = solflareUrl

        setTimeout(() => {
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
          const storeUrl = isIOS
            ? "https://apps.apple.com/app/solflare/id1580902717"
            : "https://play.google.com/store/apps/details?id=com.solflare.mobile"
          window.open(storeUrl, "_blank")
        }, 2000)

        return false
      }
    } catch (err) {
      console.error("Solflare connection failed:", err)
      setError("Failed to connect to Solflare wallet")
      return false
    } finally {
      setConnecting(false)
    }
  }, [setupWalletEvents, fetchBalance, handleUserProfile])

  // Generic connect function
  const connect = useCallback(
    async (walletType) => {
      switch (walletType) {
        case "phantom":
          return await connectPhantom()
        case "solflare":
          return await connectSolflare()
        default:
          throw new Error("Unsupported wallet type")
      }
    },
    [connectPhantom, connectSolflare],
  )

  // Sign and send transaction - UPDATED to handle pre-signed transactions
  const signAndSendTransaction = useCallback(
    async (transaction) => {
      console.log("signAndSendTransaction called", {
        connected,
        publicKey: !!publicKey,
        walletAdapter: !!walletAdapter,
      })

      if (!connected || !publicKey) {
        throw new Error("Wallet not connected")
      }

      // Get the current wallet adapter if not set
      let currentAdapter = walletAdapter
      if (!currentAdapter) {
        if (wallet === "Phantom" && typeof window !== "undefined" && window.solana) {
          currentAdapter = window.solana
          setWalletAdapter(window.solana)
        } else if (wallet === "Solflare" && typeof window !== "undefined" && window.solflare) {
          currentAdapter = window.solflare
          setWalletAdapter(window.solflare)
        }
      }

      if (!currentAdapter) {
        throw new Error("Wallet adapter not available")
      }

      try {
        // The transaction already has blockhash and partial signatures
        // We just need to sign it with the wallet and send it
        console.log("Signing transaction with adapter:", wallet)

        // Sign transaction with wallet (this adds the user's signature)
        const signedTransaction = await currentAdapter.signTransaction(transaction)

        console.log("Transaction signed, sending...")

        // Send transaction
        const signature = await connection.sendRawTransaction(signedTransaction.serialize())

        console.log("Transaction sent, confirming...")

        // Confirm transaction
        await connection.confirmTransaction(signature)

        console.log("Transaction confirmed:", signature)

        return signature
      } catch (err) {
        console.error("Transaction failed:", err)
        throw err
      }
    },
    [connected, publicKey, walletAdapter, wallet, connection],
  )

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      if (walletAdapter && walletAdapter.disconnect) {
        await walletAdapter.disconnect()
      }
    } catch (err) {
      console.error("Disconnect error:", err)
    } finally {
      setWallet(null)
      setPublicKey(null)
      setConnected(false)
      setBalance(0)
      setError(null)
      setWalletAdapter(null)
      setEnerID(null)
      setUserProfile(null)

      localStorage.removeItem("connectedWallet")
      localStorage.removeItem("walletPublicKey")
      localStorage.removeItem("userEnerID")
      localStorage.removeItem("userProfile")
    }
  }, [walletAdapter])

  const value = {
    wallet,
    connected,
    connecting,
    publicKey,
    balance,
    error,
    connection,
    connect,
    disconnect,
    signAndSendTransaction,
    fetchBalance: () => publicKey && fetchBalance(publicKey),

    // Ener ID related values
    enerID,
    userProfile,
    loadingProfile,
    handleUserProfile,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
