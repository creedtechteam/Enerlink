"use client"

import { useState } from "react"
import { ArrowLeft, X, Check, AlertCircle, Smartphone } from "lucide-react"
import { LoadingSpinner } from "../../../components/ui/loading-spinner"
import { useWallet } from "../../../contexts/WalletContext"
import "../../styles/connect-wallet.css"

export default function WalletConnect() {
  const [selectedWallet, setSelectedWallet] = useState("")
  const [seedPhrase, setSeedPhrase] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const { wallet, connected, connecting, error, balance, publicKey, connect, disconnect, enerID, loadingProfile } =
    useWallet()

  const wallets = [
    {
      name: "Phantom",
      id: "phantom",
      description: "Most popular Solana wallet",
      icon: "👻",
    },
    {
      name: "Solflare",
      id: "solflare",
      description: "Feature-rich Solana wallet",
      icon: "🔥",
    },
    {
      name: "WalletConnect",
      id: "walletconnect",
      description: "Coming soon",
      icon: "🔗",
      disabled: true,
    },
  ]

  const handleWalletSelect = (walletId) => {
    if (wallets.find((w) => w.id === walletId)?.disabled) return
    setSelectedWallet(walletId)
  }

  const handleConnectWallet = async () => {
    if (!selectedWallet) return
    try {
      const success = await connect(selectedWallet)
      if (success) {
        setShowSuccess(true)
      }
    } catch (err) {
      console.error("Connection failed:", err)
    }
  }

  const handleClose = () => {
    setShowSuccess(false)
    window.location.href = "/home"
  }

  const handleBack = () => {
    if (showSuccess) {
      setShowSuccess(false)
    } else if (connected) {
      disconnect()
    } else {
      window.history.back()
    }
  }

  const handleDisconnect = async () => {
    await disconnect()
    setShowSuccess(false)
    setSelectedWallet("")
  }

  if (connected && !showSuccess && enerID) {
    setShowSuccess(true)
  }

  return (
    <div className="wallet-connect-container">
      {/* Header */}
      <div className="header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft className="back-icon" />
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="title-section">
          <h1 className="page-title">Connect with</h1>
          <p className="page-subtitle">Access decentralized solar energy and internet</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <AlertCircle className="error-icon" />
            <p className="error-text">{error}</p>
          </div>
        )}

        {/* Wallet Options */}
        <div className="wallet-options">
          {wallets.map((walletOption) => (
            <button
              key={walletOption.id}
              className={`wallet-option ${selectedWallet === walletOption.id ? "selected" : ""} ${
                connecting || walletOption.disabled ? "disabled" : ""
              }`}
              disabled={connecting || walletOption.disabled}
              onClick={() => handleWalletSelect(walletOption.id)}
            >
              <div className="wallet-icon-placeholder">
                <span className="wallet-icon">{walletOption.icon}</span>
              </div>
              <p className="wallet-name">{walletOption.name}</p>
              {selectedWallet === walletOption.id && <Check className="check-icon" />}
            </button>
          ))}
        </div>

        {/* No Wallet Link */}
        <div className="no-wallet-section">
          <button className="no-wallet-link">I don't have a wallet</button>
        </div>

        {/* Connect Button */}
        <div className="connect-button-section">
          <button
            className="connect-button"
            onClick={handleConnectWallet}
            disabled={!selectedWallet || connecting || loadingProfile}
          >
            {connecting || loadingProfile ? (
              <>
                <LoadingSpinner className="loading-spinner" />
                {connecting ? "Connecting..." : "Setting up profile..."}
              </>
            ) : (
              "Connect Wallet"
            )}
          </button>
        </div>

        {/* Mobile Instructions */}
        {selectedWallet && !wallets.find((w) => w.id === selectedWallet)?.disabled && (
          <div className="mobile-instructions">
            <div className="mobile-header">
              <Smartphone className="mobile-icon" />
              <span className="mobile-title">Mobile Wallet Required</span>
            </div>
            <p className="mobile-description">
              {selectedWallet === "phantom"
                ? "This will open the Phantom mobile app to connect your wallet"
                : selectedWallet === "solflare"
                  ? "This will open the Solflare mobile app to connect your wallet"
                  : "This will open the WalletConnect mobile app to connect your wallet"}
            </p>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccess && connected && enerID && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <button className="close-button" onClick={handleClose}>
              <X className="close-icon" />
            </button>
            <div className="success-content">
              <div className="success-icon-container">
                <Check className="success-icon" />
              </div>
              <h2 className="success-title">{wallet} Connected</h2>
              <p className="success-description">Ready to access EnerLink</p>

              {/* Show wallet info */}
              {publicKey && (
                <div className="wallet-info">
                  <div className="info-item">
                    <p className="info-label">Ener ID</p>
                    <p className="info-value">{enerID}</p>
                  </div>
                  <div className="info-item">
                    <p className="info-label">Wallet Address</p>
                    <p className="info-value">
                      {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                    </p>
                  </div>
                  <p className="balance-info">Balance: {balance.toFixed(4)} SOL</p>
                </div>
              )}

              <div className="success-buttons">
                <button className="continue-button" onClick={handleClose}>
                  Continue to Dashboard
                </button>
                <button className="disconnect-button" onClick={handleDisconnect}>
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
