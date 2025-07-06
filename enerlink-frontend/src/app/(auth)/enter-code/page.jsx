"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import "../../styles/enter-code.css"
import axios from "@/lib/axios"

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

  
  const handleProceed = async (e) => {
    e.preventDefault()

    const codeError = validateVerificationCode(verificationCode)
    if (codeError) {
      setErrors({ verificationCode: codeError })
      return
    }

    const userId = localStorage.getItem("user_id")
    if (!userId) return alert("Missing user ID. Please sign up again.")

    try {
      const payload = {
        user_id: userId,
        token: parseInt(verificationCode, 10),
      }

      const res = await axios.post("/auth/verify-email", payload)

      alert("Email verified successfully! You can now sign in.")
      router.push("/signin")
    } catch (err) {
      console.error(err)
      alert("Verification failed. Please try again.")
    }
  }


 const handleResend = async () => {
  const userId = localStorage.getItem("user_id")
  if (!userId) return alert("User ID missing")

  try {
    const res = await axios.post("/auth/resend-verification", { user_id: userId })
    alert("Verification code resent successfully!")
    console.log("Resend response:", res.data)
  } catch (err) {
    console.error(err)
    alert("Failed to resend verification code")
  }
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
