"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import "../../styles/forgot-password.css"

export default function ForgotPassword() {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    console.log("Reset password form submitted:", formData)

    if (formData.newPassword !== formData.confirmPassword) {
      console.log("Passwords don't match")
      return
    }

    setShowSuccessModal(true)

    setTimeout(() => {
      router.push("/signin")
    }, 2000)
  }

  return (
    <div className="forgot-password-container">
      {/* Main Content */}
      <div className={`main-content ${showSuccessModal ? "dimmed" : ""}`}>
        {/* Header */}
        <div className="header">
          <Link href="/signin" className="back-arrow">
            ←
          </Link>
          <Link href="/signup" className="create-account-link">
            Create an account
          </Link>
        </div>

        {/* Main Content */}
        <div className="content">
          {/* Title */}
          <h1 className="title">Forget password</h1>
          <p className="subtitle">Make corrections on your password</p>

          {/* Form */}
          <form onSubmit={handleResetPassword} className="form">
            {/* New Password Field */}
            <div className="input-group">
              <label className="input-label">New Password</label>
              <div className="input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••••••"
                  className="password-input"
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="toggle-password">
                  {showNewPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div className="input-group">
              <label className="input-label">Confirm New Password</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••••••"
                  className="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="toggle-password"
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Validation Message */}
            <div className="validation-message">
              <p>Ensure your password is up to 8 characters</p>
            </div>

            {/* Submit Button */}
            <div className="submit-section">
              <button type="submit" className="reset-button">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            {/* Checkmark Icon */}
            <div className="checkmark-container">
              <svg className="checkmark-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {/* Saved Text */}
            <h2 className="success-text">Saved</h2>
          </div>
        </div>
      )}
    </div>
  )
}
