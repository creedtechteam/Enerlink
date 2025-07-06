"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import "../../styles/sign-up.css"
import axios from "@/lib/axios"

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    firstName: "",
    otherNames: "",
    email: "",
    password: "",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({
    firstName: "",
    otherNames: "",
    email: "",
    password: "",
    agreeToTerms: "",
  })

  const router = useRouter()

  // Validation functions
  const validateFirstName = (value) => {
    if (!value.trim()) return "First name is required"
    if (value.trim().length < 2) return "First name must be at least 2 characters"
    return ""
  }

  const validateOtherNames = (value) => {
    if (!value.trim()) return "Other names are required"
    if (value.trim().length < 2) return "Other names must be at least 2 characters"
    return ""
  }

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return "Please enter a valid email address"
    return ""
  }

  const validatePassword = (value) => {
    if (!value) return "Password is required"
    if (value.length < 8) return "Password must be at least 8 characters"
    if (!/(?=.*[a-z])/.test(value)) return "Password must contain at least one lowercase letter"
    if (!/(?=.*[A-Z])/.test(value)) return "Password must contain at least one uppercase letter"
    if (!/(?=.*\d)/.test(value)) return "Password must contain at least one number"
    return ""
  }

  const validateTerms = (checked) => {
    if (!checked) return "Please agree to the terms and conditions to proceed"
    return ""
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    // Clear error for this field when user starts typing/interacting
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === "checkbox" ? checked : value
    let error = ""

    // Validate field on blur
    switch (name) {
      case "firstName":
        error = validateFirstName(fieldValue)
        break
      case "otherNames":
        error = validateOtherNames(fieldValue)
        break
      case "email":
        error = validateEmail(fieldValue)
        break
      case "password":
        error = validatePassword(fieldValue)
        break
      default:
        break
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  const handleSubmit = async (e) => {
    console.log("I'm getting called")
  e.preventDefault()

  // Validation
  const newErrors = {
    firstName: validateFirstName(formData.firstName),
    otherNames: validateOtherNames(formData.otherNames),
    email: validateEmail(formData.email),
    password: validatePassword(formData.password),
    agreeToTerms: validateTerms(formData.agreeToTerms),
  }

  setErrors(newErrors)

  if (Object.values(newErrors).some((error) => error)) return

  const payload = {
    first_name: formData.firstName,
    last_name: formData.otherNames,
    email: formData.email,
    password: formData.password,
  }

  try {
    const res = await axios.post("/auth/signup", payload)

    const { access_token, refresh_token, user_id, device_id } = res.data

    // Save tokens and userId (for later)
    localStorage.setItem("access_token", access_token)
    localStorage.setItem("refresh_token", refresh_token)
    localStorage.setItem("user_id", user_id)
    localStorage.setItem("device_id", device_id)
    localStorage.setItem("userEmail", formData.email) // fallback

    router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
  } catch (err) {
    const message = err.response?.data?.message || "Something went wrong"
    alert(message) // or use toast
    console.error(err)
  }
}

  return (
    <div className="create-account-container">
      {/* Header */}
      <div className="header">
        <Link href="/" className="back-button">
          <svg className="back-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z" />
          </svg>
        </Link>
        <Link href="/signin" className="signin-link">
          Sign in
        </Link>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Title */}
        <h1 className="page-title">Create an account</h1>

        {/* Text Banner */}
        <div className="subtitle-banner">
          <p className="subtitle-text">Be sure to enter your correct details below</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="account-form">
          {/* Form Title */}
          <h2 className="form-title">Enter your details</h2>

          {/* Name Fields */}
          <div className="name-fields-row">
            <div className="input-group half-width">
              <label className="input-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`text-input ${errors.firstName ? "error" : ""}`}
              />
              {errors.firstName && <p className="error-message">{errors.firstName}</p>}
            </div>
            <div className="input-group half-width">
              <label className="input-label">Other Names</label>
              <input
                type="text"
                name="otherNames"
                value={formData.otherNames}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`text-input ${errors.otherNames ? "error" : ""}`}
              />
              {errors.otherNames && <p className="error-message">{errors.otherNames}</p>}
            </div>
          </div>

          {/* Email Field */}
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`text-input ${errors.email ? "error" : ""}`}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="••••••••••••"
                className={`text-input password-input ${errors.password ? "error" : ""}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m4 4l16 16m-3.5-3.244C15.147 17.485 13.618 18 12 18c-3.53 0-6.634-2.452-8.413-4.221c-.47-.467-.705-.7-.854-1.159c-.107-.327-.107-.913 0-1.24c.15-.459.385-.693.855-1.16c.897-.892 2.13-1.956 3.584-2.793M19.5 14.634c.333-.293.638-.582.912-.854l.003-.003c.468-.466.703-.7.852-1.156c.107-.327.107-.914 0-1.241c-.15-.458-.384-.692-.854-1.159C18.633 8.452 15.531 6 12 6q-.507 0-1 .064m2.323 7.436a2 2 0 0 1-2.762-2.889"
                    />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="error-message">{errors.password}</p>}
            {!errors.password && formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div className="strength-fill"></div>
                </div>
                <span className="strength-text">Excellent</span>
              </div>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="checkbox-group">
            <div className="checkbox-container">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="checkbox-input"
                id="terms-checkbox"
              />
              <label htmlFor="terms-checkbox" className="checkbox-label">
                <div className={`custom-checkbox ${errors.agreeToTerms ? "error" : ""}`}>
                  {formData.agreeToTerms && (
                    <svg
                      className="checkmark"
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                    >
                      <path fill="white" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </div>
              </label>
            </div>
            <div className="terms-text-container">
              <p className="terms-text">I certify that i am 18 years of old or older, i agree to the user agreement</p>
              {errors.agreeToTerms && <p className="error-message">{errors.agreeToTerms}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-container">
            <button type="submit" className="proceed-button">
              Proceed
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
