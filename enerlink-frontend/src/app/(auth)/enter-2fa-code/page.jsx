"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import "../../styles/enter-2fa-code.css"

export default function EnterTwoStepCode() {
  const [verificationCode, setVerificationCode] = useState("")
  const [errors, setErrors] = useState({
    verificationCode: "",
  })

  const router = useRouter()

  // Validation function
  const validateVerificationCode = (value) => {
    if (!value.trim()) return "Verification code is required"
    if (value.trim().length !== 6) return "Verification code must be 6 digits"
    if (!/^\d{6}$/.test(value.trim())) return "Verification code must contain only numbers"
    return ""
  }

  const handleInputChange = (e) => {
    const value = e.target.value

    // Only allow numbers and limit to 6 characters
    if (/^\d*$/.test(value) && value.length <= 6) {
      setVerificationCode(value)

      // Clear error when user starts typing
      if (errors.verificationCode) {
        setErrors((prev) => ({
          ...prev,
          verificationCode: "",
        }))
      }
    }
  }

  const handleBlur = () => {
    const error = validateVerificationCode(verificationCode)
    setErrors((prev) => ({
      ...prev,
      verificationCode: error,
    }))
  }

  const handleSubmitCode = (e) => {
    e.preventDefault()

    // Validate verification code
    const codeError = validateVerificationCode(verificationCode)

    if (codeError) {
      setErrors({ verificationCode: codeError })
      return
    }

    console.log("Two-step verification code:", verificationCode)
    // Add verification logic here later
    // router.push("/dashboard")
  }

  const handleResend = () => {
    console.log("Resend two-step verification code")
    // Add resend logic here later
  }

  const handleUseEmailInstead = () => {
    console.log("Switch to email verification")
    router.push("/email-verification-setup")
  }

  return (
    <div className="enter-two-step-container">
      {/* Header */}
      <div className="header">
        <Link href="/two-step-verification" className="back-button">
          <div className="back-button-circle">
            <svg className="back-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Title */}
        <h1 className="page-title">Enter two-step verification code</h1>

        {/* Form */}
        <form onSubmit={handleSubmitCode} className="verification-form">
          {/* Input Field */}
          <div className="input-group">
            <label className="input-label">Input verification code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter 6-digit code"
              maxLength="6"
              inputMode="numeric"
              className={`verification-input ${errors.verificationCode ? "error" : ""}`}
            />
            {errors.verificationCode && <p className="error-message">{errors.verificationCode}</p>}
          </div>

          {/* Action Buttons */}
          <div className="buttons-section">
            <button type="submit" className="submit-button">
              Submit Code
            </button>
            <button type="button" onClick={handleResend} className="resend-button">
              Resend
            </button>
          </div>


          {/*<div className="email-link-section">
            <button type="button" onClick={handleUseEmailInstead} className="email-link">
              Use email instead
            </button>
          </div>*/}
        </form>
      </div>
    </div>
  )
}
