"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bell, Calendar, ChevronDown } from "lucide-react"
import "../styles/notification.css"

export default function NotificationsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [filter, setFilter] = useState("All")
  const [selectedMonth, setSelectedMonth] = useState("January")
  const [showMonthDropdown, setShowMonthDropdown] = useState(false)

  useEffect(() => {
    // Load ONLY real transactions from localStorage
    const savedTransactions = localStorage.getItem("enerlink_transactions")
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions)
      // Sort by timestamp (newest first)
      const sortedTransactions = parsedTransactions.sort((a, b) => b.timestamp - a.timestamp)
      setTransactions(sortedTransactions)
      console.log("Loaded real transactions:", sortedTransactions.length)
    } else {
      console.log("No transactions found in localStorage")
      setTransactions([])
    }
  }, [])

  // Refresh transactions when page becomes visible (for real-time updates)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const savedTransactions = localStorage.getItem("enerlink_transactions")
        if (savedTransactions) {
          const parsedTransactions = JSON.parse(savedTransactions)
          const sortedTransactions = parsedTransactions.sort((a, b) => b.timestamp - a.timestamp)
          setTransactions(sortedTransactions)
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  const handleBack = () => {
    router.back()
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case "airtime":
        return (
          <div className="transaction-icon airtime-icon">
            <div className="icon-stack">
              <div className="card-base"></div>
              <div className="card-overlay"></div>
            </div>
          </div>
        )
      case "data":
        return (
          <div className="transaction-icon data-icon">
            <div className="database-icon">
              <div className="db-cylinder"></div>
              <div className="db-cylinder"></div>
              <div className="db-cylinder"></div>
            </div>
          </div>
        )
      case "reward":
        return (
          <div className="transaction-icon reward-icon">
            <div className="trophy-icon">
              <div className="trophy-cup"></div>
              <div className="trophy-base"></div>
            </div>
          </div>
        )
      default:
        return (
          <div className="transaction-icon airtime-icon">
            <div className="icon-stack">
              <div className="card-base"></div>
              <div className="card-overlay"></div>
            </div>
          </div>
        )
    }
  }

  const getProviderLogo = (provider) => {
    const logoStyle = {
      width: "24px",
      height: "16px",
      borderRadius: "2px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "10px",
      fontWeight: "bold",
      color: "white",
    }

    switch (provider) {
      case "MTN Nigeria":
      case "MTN":
        return <div style={{ ...logoStyle, backgroundColor: "#FFCC00", color: "#000" }}>MTN</div>
      case "Glo Nigeria":
      case "Glo":
        return <div style={{ ...logoStyle, backgroundColor: "#00A651" }}>Glo</div>
      case "Airtel Nigeria":
      case "Airtel":
        return <div style={{ ...logoStyle, backgroundColor: "#FF0000" }}>Airtel</div>
      case "9mobile":
        return <div style={{ ...logoStyle, backgroundColor: "#00A651" }}>9mobile</div>
      default:
        return <div style={{ ...logoStyle, backgroundColor: "#666" }}>NET</div>
    }
  }

  const formatTransactionText = (transaction) => {
    if (transaction.packageType === "data") {
      return `Data to (${transaction.packageAmount}) ${transaction.phoneNumber}`
    } else if (transaction.packageType === "airtime") {
      return `Airtime to ${transaction.phoneNumber}`
    } else {
      return `${transaction.packageType} to ${transaction.phoneNumber}`
    }
  }

  const formatAmount = (transaction) => {
    const amount = transaction.solAmount || 0
    return `$${amount.toFixed(3)}`
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "All") return true
    return tx.status === filter.toLowerCase()
  })

  const handleViewTransaction = (signature) => {
    if (signature && signature !== "demo_transaction") {
      const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
      window.open(explorerUrl, "_blank")
    }
  }

  const clearAllNotifications = () => {
    if (confirm("Are you sure you want to clear all notifications?")) {
      localStorage.removeItem("enerlink_transactions")
      setTransactions([])
    }
  }

  return (
    <div className="notification-container">
      {/* Header - Matches Design */}
      <div className="notification-header">
        <button className="back-btn" onClick={handleBack}>
          <ArrowLeft className="back-arrow" />
        </button>
        <h1 className="header-title">Notification</h1>
      </div>

      {/* Filter Section - Matches Design */}
      <div className="filter-section">
        <div className="filter-controls">
          <button className={`filter-btn ${filter === "All" ? "active" : ""}`} onClick={() => setFilter("All")}>
            All
          </button>
          <button className="date-btn">
            <Calendar className="calendar-icon" />
            Date
          </button>
        </div>

        <div className="month-selector">
          <button className="month-dropdown-btn" onClick={() => setShowMonthDropdown(!showMonthDropdown)}>
            {selectedMonth}
            <ChevronDown className="dropdown-arrow" />
          </button>

          {showMonthDropdown && (
            <div className="month-dropdown">
              {months.map((month) => (
                <button
                  key={month}
                  className="month-option"
                  onClick={() => {
                    setSelectedMonth(month)
                    setShowMonthDropdown(false)
                  }}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transactions List */}
      <div className="transactions-container">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <Bell className="empty-icon" />
            <h3>No Transactions Yet</h3>
            <p>Your payment notifications will appear here after you make transactions</p>
            <button className="demo-button" onClick={() => router.push("/home")}>
              Go to Home
            </button>
          </div>
        ) : (
          <>
            <div className="transactions-header">
              <h3>Recent Transactions ({filteredTransactions.length})</h3>
            </div>
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="transaction-row"
                onClick={() => handleViewTransaction(transaction.signature)}
              >
                <div className="transaction-left">
                  {getTransactionIcon(transaction.packageType)}
                  <div className="transaction-details">
                    <div className="transaction-text">{formatTransactionText(transaction)}</div>
                    <div className="provider-info">
                      {getProviderLogo(transaction.provider)}
                      <span className="provider-name">{transaction.provider}</span>
                      <span className={`provider-status ${transaction.status}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="transaction-right">
                  <div className={`transaction-amount positive`}>{formatAmount(transaction)}</div>
                  <div className="transaction-date">{formatDate(transaction.timestamp)}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Clear All Button - Only show if there are real transactions */}
      {transactions.length > 0 && (
        <div className="clear-section">
          <button className="clear-button" onClick={clearAllNotifications}>
            Clear All Notifications
          </button>
        </div>
      )}
    </div>
  )
}
