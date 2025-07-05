"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import "../../styles/enter-code.css"

export default function EnterVerificationCode() {
  const [verificationCode, setVerificationCode] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [errors, setErrors] = useState({
    verificationCode: "",
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Try to get email from URL params first
    const emailFromParams = searchParams.get("email")

    // If not in URL params, try localStorage
    const emailFromStorage = localStorage.getItem("userEmail")

    // Use the email from params or storage, fallback to placeholder
    const email = emailFromParams || emailFromStorage || "your-email@example.com"
    setUserEmail(email)
  }, [searchParams])

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

  const handleProceed = (e) => {
    e.preventDefault()

    // Validate verification code
    const codeError = validateVerificationCode(verificationCode)

    if (codeError) {
      setErrors({ verificationCode: codeError })
      return
    }

    console.log("Verification code:", verificationCode)
    // After email verification is complete, redirect to sign in
    router.push("/signin")
  }

  const handleResend = () => {
    console.log("Resend verification code")
    // Add resend logic here later
  }

  return (
    <div className="enter-code-container">
      {/* Header */}
      <div className="header">
        <Link href="/verify-email" className="back-button">
          <svg className="back-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z" />
          </svg>
        </Link>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Title */}
        <h1 className="page-title">Enter Verification Code</h1>

        {/* Instructions Banner */}
        <div className="instructions-section">
          <p className="instructions-text">
            A text message with a 6-digit code was sent to <span className="email-highlight">{userEmail}</span>. This
            will help us keep your account secure by verifying that it's really you
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleProceed} className="verification-form">
          {/* Input Field */}
          <div className="input-group">
            <label className="input-label">Input verification code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter 6-digit code"
              className={`verification-input ${errors.verificationCode ? "error" : ""}`}
              maxLength="6"
              inputMode="numeric"
            />
            {errors.verificationCode && <p className="error-message">{errors.verificationCode}</p>}
          </div>

          {/* Action Buttons */}
          <div className="buttons-section">
            <button type="submit" className="proceed-button">
              Proceed
            </button>
            <button type="button" onClick={handleResend} className="resend-button">
              Resend
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
