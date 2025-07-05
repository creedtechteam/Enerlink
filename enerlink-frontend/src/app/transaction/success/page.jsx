"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, Download, Share2, ExternalLink } from "lucide-react"
import "../../styles/transaction-success.css"

export default function TransactionSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showConfetti, setShowConfetti] = useState(true)

  const phone = searchParams.get("phone")
  const amount = searchParams.get("amount")
  const sol = searchParams.get("sol")
  const provider = searchParams.get("provider")
  const signature = searchParams.get("signature")

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleDone = () => {
    router.push("/home")
  }

  const handleShareReceipt = () => {
    const receiptText = `EnerLink Transaction Receipt
✅ Successfully purchased ${amount} ${provider} bundle
📱 Phone: ${phone}
💰 Amount: ${sol} SOL
🔗 Transaction: ${signature?.slice(0, 8)}...${signature?.slice(-8)}
🌐 Powered by EnerLink`

    if (navigator.share) {
      navigator.share({
        title: "EnerLink Transaction Receipt",
        text: receiptText,
      })
    } else {
      navigator.clipboard.writeText(receiptText)
      alert("Receipt details copied to clipboard!")
    }
  }

  const handleDownloadReceipt = () => {
    alert("Receipt download feature coming soon!")
  }

  const handleViewTransaction = () => {
    if (signature) {
      const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
      window.open(explorerUrl, "_blank")
    }
  }

  return (
    <div className="success-container">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => {
            const shapes = ["circle", "square", "diamond", "star", "rectangle"]
            const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06d6a0", "#f72585"]
            const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
            const randomColor = colors[Math.floor(Math.random() * colors.length)]

            return (
              <div
                key={i}
                className={`confetti-piece confetti-${randomShape}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: randomColor,
                }}
              />
            )
          })}
        </div>
      )}

      {/* Success Content */}
      <div className="success-content">
        <div className="success-icon-container">
          <Check className="success-icon" />
        </div>

        <h1 className="success-title">Payment Successful!</h1>

        <div className="success-message">
          <p className="message-text">
            You <span className="highlight-text">successfully purchased</span> amount of{" "}
            <span className="highlight-text">{amount || "1 GB"}</span> bundle to{" "}
            <span className="phone-number">{phone || "81234567890"}</span>
          </p>
        </div>

        {/* Transaction Details */}
        {signature && (
          <div className="transaction-info">
            <div className="transaction-detail">
              <span className="detail-label">Transaction ID:</span>
              <span className="detail-value">
                {signature.slice(0, 8)}...{signature.slice(-8)}
              </span>
            </div>
            <div className="transaction-detail">
              <span className="detail-label">Amount Paid:</span>
              <span className="detail-value">{sol} SOL</span>
            </div>
            <div className="transaction-detail">
              <span className="detail-label">Provider:</span>
              <span className="detail-value">{provider}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="action-button share-button" onClick={handleShareReceipt}>
          <div className="button-icon-container">
            <Share2 className="button-icon" />
          </div>
          <span className="button-text">Share Receipt</span>
        </button>

        <button className="action-button download-button" onClick={handleDownloadReceipt}>
          <div className="button-icon-container">
            <Download className="button-icon" />
          </div>
          <span className="button-text">Download Receipt</span>
        </button>

        {signature && (
          <button className="action-button view-button" onClick={handleViewTransaction}>
            <div className="button-icon-container">
              <ExternalLink className="button-icon" />
            </div>
            <span className="button-text">View on Explorer</span>
          </button>
        )}
      </div>

      {/* Done Button */}
      <button className="done-button" onClick={handleDone}>
        Done
      </button>
    </div>
  )
}
