"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import "../../styles/verify-email.css"
import { Suspense } from "react"

function VerifyEmail() {
  const [userEmail, setUserEmail] = useState("")
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

  const handleResendCode = () => {
    console.log("Resend verification code")
    // Add resend logic here later
  }

  const handleContinue = () => {
    console.log("Continue with verification")
    // Add verification logic here later
  }

  return (
    <div className="verify-email-container">
      {/* Header */}
      <div className="header">
        <Link href="/signup" className="back-button">
          <svg className="back-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z" />
          </svg>
        </Link>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Illustration Area */}
        <div className="illustration-section">
          <div className="illustration-container">
            <Image
              src="/email-veri.png"
              alt="Email verification illustration"
              width={224}
              height={224}
              className="verification-image"
            />
          </div>
        </div>

        {/* Instructions Banner */}
        <div className="instructions-section">
          <div className="instructions-container">
            <p className="instructions-text">
              We sent a verification email to <span className="email-highlight">{userEmail}</span> check your mailbox
              for confirmation.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="buttons-section">
          <button onClick={handleResendCode} className="resend-button">
            Code didn't arrive?
          </button>
          <Link href="/enter-code" className="continue-link">
            <button onClick={handleContinue} className="continue-button">
              Continue
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  )
}
