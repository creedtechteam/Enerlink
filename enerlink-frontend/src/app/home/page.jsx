"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Copy, Bell, Grid3X3, Wallet, CreditCard, User, ChevronDown } from "lucide-react"
import { useWallet } from "../../contexts/WalletContext"
import "../styles/home.css"

export default function HomePage() {
  const { wallet, connected, publicKey, disconnect, enerID, userProfile, balance } = useWallet()
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState(3)
  const [selectedCategory, setSelectedCategory] = useState("Data Bundle")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const router = useRouter()

  const userData = {
    name: userProfile?.enerID?.split(/[0-9]/)?.[0] || "Jude",
    enerID: enerID || "judechucks08",
    avatar: null,
  }

  const dataBundlePackages = [
    {
      id: 1,
      provider: "MTN",
      type: "4G LTE",
      amount: "1 GB",
      price: "0.01 SOL",
      validity: "30 days",
      icon: "📱",
      color: "#FFCC00",
      logo: "MTN",
    },
    {
      id: 2,
      provider: "MTN",
      type: "4G LTE",
      amount: "1.5 GB",
      price: "0.015 SOL",
      validity: "30 days",
      icon: "📱",
      color: "#FFCC00",
      logo: "MTN",
    },
    {
      id: 3,
      provider: "Airtel",
      type: "4G+",
      amount: "7 GB",
      price: "0.07 SOL",
      validity: "30 days",
      icon: "🔴",
      color: "#E31E24",
      logo: "airtel",
    },
    {
      id: 4,
      provider: "Airtel",
      type: "4G+",
      amount: "7 GB",
      price: "0.07 SOL",
      validity: "30 days",
      icon: "🔴",
      color: "#E31E24",
      logo: "airtel",
    },
  ]

  const airtimePackages = [
    {
      id: 5,
      provider: "MTN",
      type: "Airtime",
      amount: "₦100",
      price: "0.004 SOL",
      validity: "No expiry",
      icon: "📞",
      color: "#FFCC00",
      logo: "MTN",
    },
    {
      id: 6,
      provider: "MTN",
      type: "Airtime",
      amount: "₦200",
      price: "0.008 SOL",
      validity: "No expiry",
      icon: "📞",
      color: "#FFCC00",
      logo: "MTN",
    },
    {
      id: 7,
      provider: "Airtel",
      type: "Airtime",
      amount: "₦500",
      price: "0.02 SOL",
      validity: "No expiry",
      icon: "📞",
      color: "#E31E24",
      logo: "airtel",
    },
    {
      id: 8,
      provider: "Airtel",
      type: "Airtime",
      amount: "₦1000",
      price: "0.04 SOL",
      validity: "No expiry",
      icon: "📞",
      color: "#E31E24",
      logo: "airtel",
    },
  ]

  const currentPackages = selectedCategory === "Data Bundle" ? dataBundlePackages : airtimePackages

  const transactions = [
    {
      id: 1,
      type: "data_purchase",
      user: "Jude Chucks",
      description: "Sent MTN 7 GB on 10 Jan, 2025",
      amount: "$2",
      icon: "📱",
      avatar: "J",
      bgColor: "#0a738d",
    },
    {
      id: 2,
      type: "data_purchase",
      user: "Jude Chucks",
      description: "Purchased Airtel 2.5 GB on 11 Jan, 2025",
      amount: "$5",
      icon: "📱",
      avatar: "J",
      bgColor: "#0a738d",
    },
    {
      id: 3,
      type: "airtime_received",
      user: "Jude Chucks",
      description: "Received MTN 1.5 GB on 15 Jan, 2025",
      amount: "$10",
      icon: "📞",
      avatar: "J",
      bgColor: "#f0f0f0",
      textColor: "#2d2d2d",
    },
    {
      id: 4,
      type: "airtime_received",
      user: "Jude Chucks",
      description: "Received MTN 7.5 GB on 18 Jan, 2025",
      amount: "$14",
      icon: "📞",
      avatar: "J",
      bgColor: "#f0f0f0",
      textColor: "#2d2d2d",
    },
  ]

  const copyEnerID = () => {
    if (enerID) navigator.clipboard.writeText(enerID)
  }

  const handlePackageSelect = (pkg) => {
    if (pkg?.id) window.location.href = `/transaction?type=${selectedCategory}&package=${pkg.id}`
  }

  const handleSearch = () => {
    window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`
  }

  const handleNotification = () => {
    router.push("/notification")
  }

  if (!connected) {
    return (
      <div className="connect-wallet-prompt">
        <div className="connect-content">
          <h1>Please Connect Your Wallet</h1>
          <button className="connect-button" onClick={() => (window.location.href = "/")}>
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <div className="header">
        <div className="user-info">
          <div className="avatar">
            <User className="avatar-icon" />
          </div>
          <div className="user-details">
            <span className="greeting">Hello {userData.name}</span>
            <p className="balance">{(balance || 0).toFixed(4)} SOL</p>
          </div>
        </div>
        <div className="notification-container">
          <button className="notification-button" onClick={handleNotification}>
            <Bell className="bell-icon" />
          </button>
          {notifications > 0 && <span className="notification-badge">{notifications}</span>}
        </div>
      </div>

      <div className="search-section">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pay by name or phone number"
          />
          <button className="grid-button" onClick={handleSearch}>
            <Grid3X3 className="grid-icon" />
          </button>
        </div>
      </div>

      <div className="ener-id-section">
        <div className="ener-id-container">
          <span className="ener-id-text">Ener ID: {userData.enerID}</span>
          <button className="copy-button" onClick={copyEnerID}>
            <Copy className="copy-icon" />
            <span className="copy-text">Copy</span>
          </button>
        </div>
      </div>

      <div className="packages-section">
        <div className="packages-header">
          <div className="category-dropdown">
            <button className="category-button" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
              {selectedCategory}
              <ChevronDown className="chevron-icon" />
            </button>


            {showCategoryDropdown && (
              <div className="dropdown-menu">
                <button
                  className={`dropdown-item ${selectedCategory === "Data Bundle" ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedCategory("Data Bundle")
                    setShowCategoryDropdown(false)
                  }}
                >
                  Data Bundle
                </button>
                <button
                  className={`dropdown-item ${selectedCategory === "Airtime" ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedCategory("Airtime")
                    setShowCategoryDropdown(false)
                  }}
                >
                  Airtime
                </button>
              </div>
            )}
          </div>
          <button className="see-more-button">See More</button>
        </div>

        <div className="packages-grid">
          {currentPackages.map((pkg) => (
            <button key={pkg.id} className="package-card" onClick={() => handlePackageSelect(pkg)}>
              <div className="package-content">
                <div className="package-logo" style={{ backgroundColor: pkg.color }}>
                  <span className="logo-text">{pkg.logo}</span>
                </div>
                <p className="package-provider">{pkg.provider}</p>
                <p className="package-amount">{pkg.amount}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="transaction-section">
        <h2 className="transaction-title">Transaction History</h2>
        <div className="transaction-list">
          {transactions.map((tx) => (
            <div key={tx.id} className="transaction-item">
              <div
                className="transaction-avatar"
                style={{
                  backgroundColor: tx.bgColor,
                  color: tx.textColor || "white",
                }}
              >
                <span className="avatar-text">{tx.avatar}</span>
              </div>
              <div className="transaction-details">
                <p className="transaction-user">{tx.user}</p>
                <p className="transaction-description">{tx.description}</p>
              </div>
              <span className="transaction-amount">{tx.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bottom-nav">
        <div className="nav-container">
          <button className="nav-item active">
            <Grid3X3 className="nav-icon" />
            <span className="nav-label">Home</span>
          </button>
          <button className="nav-item">
            <Wallet className="nav-icon" />
            <span className="nav-label">Wallet</span>
          </button>
          <button className="nav-item">
            <CreditCard className="nav-icon" />
            <span className="nav-label">Pay</span>
          </button>
          <button className="nav-item">
            <User className="nav-icon" />
            <span className="nav-label">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}
