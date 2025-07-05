"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowUpDown, ChevronDown } from "lucide-react"
import { useWallet } from "../../contexts/WalletContext"
import { processPayment } from "../../lib/payment"
import "../styles/transaction.css"

export default function TransactionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { balance, connected, publicKey, signAndSendTransaction } = useWallet()

  const packageData = {
    1: { provider: "MTN Nigeria", amount: "1 GB", price: "0.01", validity: "30 days", type: "data" },
    2: { provider: "MTN Nigeria", amount: "2 GB", price: "0.02", validity: "30 days", type: "data" },
    3: { provider: "Airtel Nigeria", amount: "5 GB", price: "0.05", validity: "30 days", type: "data" },
    4: { provider: "Airtel Nigeria", amount: "7 GB", price: "0.07", validity: "30 days", type: "data" },
    5: { provider: "MTN Nigeria", amount: "₦100", price: "0.004", validity: "No expiry", type: "airtime" },
    6: { provider: "MTN Nigeria", amount: "₦200", price: "0.008", validity: "No expiry", type: "airtime" },
    7: { provider: "Airtel Nigeria", amount: "₦500", price: "0.02", validity: "No expiry", type: "airtime" },
    8: { provider: "Airtel Nigeria", amount: "₦1000", price: "0.04", validity: "No expiry", type: "airtime" },
  }

  const [phoneNumber, setPhoneNumber] = useState("")
  const [showCoinDropdown, setShowCoinDropdown] = useState(false)
  const packageId = searchParams.get("package")
  const initialAmount = packageId ? packageData[packageId].price : "2"
  const [amount, setAmount] = useState(initialAmount)
  const [selectedCoin, setSelectedCoin] = useState("SOL")
  const [loading, setLoading] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState("")

  const transactionType = searchParams.get("type") || "Data Bundle"
  const currentPackage = packageData[packageId] || packageData[1]
  const isDataPackage = currentPackage.type === "data"

  const SOL_PER_GB = 0.01
  const walletBalance = balance || 52.98
  const solAmount = Number.parseFloat(amount)
  const dataAmount = currentPackage.amount
  const maxBalance = balance || 0

  let displayAmount
  if (isDataPackage) {
    const dataGBAmount = solAmount / SOL_PER_GB
    displayAmount = `${dataGBAmount.toFixed(1)} GB`
  } else {
    displayAmount = currentPackage.amount
  }

  const handleConfirm = async () => {
    if (!connected) {
      alert("Please connect your wallet first")
      return
    }

    if (!phoneNumber.trim()) {
      alert("Please enter a phone number")
      return
    }

    if (solAmount > maxBalance) {
      alert("Insufficient balance")
      return
    }

    setLoading(true)
    setTransactionStatus("Preparing transaction...")

    try {
      // Process payment using smart contract
      setTransactionStatus("Processing payment...")
      const result = await processPayment({
        amount: solAmount,
        publicKey: publicKey.toString(),
        phoneNumber: phoneNumber.trim(),
        packageType: currentPackage.type,
        provider: currentPackage.provider,
        packageAmount: currentPackage.amount,
        signAndSendTransaction,
      })

      if (result.success) {
        setTransactionStatus("Payment successful! Redirecting...")

        // Add a small delay to show the success message, then redirect
        setTimeout(() => {
          const redirectUrl = `/transaction/success?phone=${encodeURIComponent(phoneNumber)}&amount=${encodeURIComponent(dataAmount)}&sol=${encodeURIComponent(solAmount)}&provider=${encodeURIComponent(currentPackage.provider)}&signature=${encodeURIComponent(result.signature)}`

          console.log("Redirecting to:", redirectUrl)
          router.push(redirectUrl)
        }, 1500)
      } else {
        throw new Error(result.error || "Payment failed")
      }
    } catch (error) {
      console.error("Transaction failed:", error)
      setTransactionStatus("")
      alert(`Transaction failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handleMaxAmount = () => {
    setAmount(walletBalance.toFixed(4))
  }

  if (!connected) {
    return (
      <div className="transaction-container">
        <div className="connect-wallet-prompt">
          <h1>Wallet Not Connected</h1>
          <button className="connect-button" onClick={() => router.push("/")}>
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="transaction-container">
      {/* Header */}
      <div className="transaction-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft className="back-icon" />
        </button>
        <h1 className="page-title">{transactionType}</h1>
      </div>

      {/* Main Content */}
      <div className="transaction-content">
        {/* Phone Number Input */}
        <div className="phone-input-section">
          <div className="phone-input-container">
            <div className="country-code">+234</div>
            <input
              type="tel"
              placeholder="Enter your Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="phone-input"
              disabled={loading}
            />
          </div>
        </div>

        {/* From Section */}
        <div className="transaction-section">
          <p className="section-label">From</p>
          <p className="section-value">Wallet</p>
        </div>

        {/* Swap Icon */}
        <div className="swap-container">
          <div className="swap-icon-wrapper">
            <ArrowUpDown className="swap-icon" />
          </div>
        </div>

        {/* To Section */}
        <div className="transaction-section">
          <p className="section-label">To</p>
          <p className="section-value">{isDataPackage ? "Data" : "Airtime"}</p>
        </div>

        {/* Coin Selection */}
        <div className="coin-section">
          <p className="section-label">Coin</p>
          <div className="coin-selector" onClick={() => !loading && setShowCoinDropdown(!showCoinDropdown)}>
            <div className="coin-info">
              <div className="coin-icon">
                <span className="coin-symbol">S</span>
              </div>
              <span className="coin-name">{selectedCoin}</span>
            </div>
            <ChevronDown className="dropdown-arrow" />
          </div>

          {showCoinDropdown && !loading && (
            <div className="coin-dropdown">
              <button
                className="coin-option"
                onClick={() => {
                  setSelectedCoin("SOL")
                  setShowCoinDropdown(false)
                }}
              >
                <div className="coin-icon">
                  <span className="coin-symbol">S</span>
                </div>
                <span>SOL</span>
              </button>
            </div>
          )}
        </div>

        {/* Amount Section */}
        <div className="amount-section">
          <p className="section-label">Amount</p>
          <div className="amount-container">
            <div className="amount-input-wrapper">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.0001"
                min="0"
                max={maxBalance}
                className="amount-input"
                disabled={loading}
              />
              <div className="amount-controls">
                <button className="max-button" onClick={handleMaxAmount} disabled={loading}>
                  Max
                </button>
                <span className="currency-label">{selectedCoin}</span>
              </div>
            </div>
            <div className="amount-info">
              <span className="converted-amount">{displayAmount}</span>
              <span className="balance-info">
                {walletBalance.toFixed(3)} {selectedCoin}
              </span>
            </div>
          </div>
        </div>

        {/* Transaction Status */}
        {transactionStatus && (
          <div className="transaction-status">
            <p className="status-text">{transactionStatus}</p>
          </div>
        )}

        {/* Confirm Button */}
        <button
          className="confirm-button"
          onClick={handleConfirm}
          disabled={loading || !phoneNumber.trim() || solAmount <= 0 || solAmount > maxBalance}
        >
          {loading ? transactionStatus || "Processing..." : "Confirm"}
        </button>
      </div>

      {/* Transaction Details */}
      <div className="transaction-details">
        <div className="details-container">
          <div className="detail-item">
            <span className="detail-label">Provider:</span>
            <span className="detail-value">{currentPackage.provider}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Validity:</span>
            <span className="detail-value">{currentPackage.validity}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Your Balance:</span>
            <span className="detail-value">
              {walletBalance.toFixed(3)} {selectedCoin}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
