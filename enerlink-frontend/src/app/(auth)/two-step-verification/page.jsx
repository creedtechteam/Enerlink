"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import "../../styles/two-step-verification.css"

export default function TwoStepVerification() {
  const [formData, setFormData] = useState({
    country: "",
    mobileNumber: "",
  })
  const [errors, setErrors] = useState({
    country: "",
    mobileNumber: "",
  })

  const router = useRouter()

  // Country options with country codes
  const countries = [
    { value: "", label: "Select Country", code: "" },
    { value: "us", label: "United States", code: "+1" },
    { value: "uk", label: "United Kingdom", code: "+44" },
    { value: "ca", label: "Canada", code: "+1" },
    { value: "ng", label: "Nigeria", code: "+234" },
    { value: "gh", label: "Ghana", code: "+233" },
    { value: "ke", label: "Kenya", code: "+254" },
    { value: "za", label: "South Africa", code: "+27" },
    { value: "au", label: "Australia", code: "+61" },
    { value: "in", label: "India", code: "+91" },
    { value: "de", label: "Germany", code: "+49" },
    { value: "fr", label: "France", code: "+33" },
  ]

  // Validation functions
  const validateCountry = (value) => {
    if (!value) return "Please select a country"
    return ""
  }

  const validateMobileNumber = (value) => {
    if (!value.trim()) return "Mobile number is required"
    if (value.trim().length < 10) return "Mobile number must be at least 10 digits"
    if (!/^\+?[\d\s\-$$$$]+$/.test(value.trim())) return "Please enter a valid mobile number"
    return ""
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing/selecting
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    let error = ""

    // Validate field on blur
    switch (name) {
      case "country":
        error = validateCountry(value)
        break
      case "mobileNumber":
        error = validateMobileNumber(value)
        break
      default:
        break
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  const handleSendCode = (e) => {
    e.preventDefault()

    // Validate all fields
    const newErrors = {
      country: validateCountry(formData.country),
      mobileNumber: validateMobileNumber(formData.mobileNumber),
    }

    setErrors(newErrors)

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "")

    if (hasErrors) {
      return // Stop form submission
    }

    console.log("Two-step verification setup:", formData)
    // Navigate to enter 2FA code page
    router.push("/enter-2fa-code")
  }

  const getSelectedCountryCode = () => {
    const selectedCountry = countries.find((country) => country.value === formData.country)
    return selectedCountry ? selectedCountry.code : ""
  }

  return (
    <div className="two-step-container">
      {/* Header */}
      <div className="header">
        <Link href="/signin" className="back-button">
          <svg className="back-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z" />
          </svg>
        </Link>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Title */}
        <h1 className="page-title">Setup two-step verification</h1>

        {/* Instructions Banner */}
        <div className="instructions-section">
          <p className="instructions-text">
            Please enter the phone number associated with your account. We'll text a verification code to your mobile
            number.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSendCode} className="verification-form">
          {/* Country and Mobile Number Fields */}
          <div className="fields-row">
            <div className="input-group country-group">
              <label className="input-label">Country</label>
              <div className="select-container">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`select-input ${errors.country ? "error" : ""}`}
                >
                  {countries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <div className="select-arrow">
                  <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.country && <p className="error-message">{errors.country}</p>}
            </div>

            <div className="input-group mobile-group">
              <label className="input-label">Mobile Number</label>
              <div className="mobile-input-container">
                {getSelectedCountryCode() && <span className="country-code">{getSelectedCountryCode()}</span>}
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter your phone number"
                  className={`text-input mobile-input ${errors.mobileNumber ? "error" : ""} ${
                    getSelectedCountryCode() ? "with-code" : ""
                  }`}
                />
              </div>
              {errors.mobileNumber && <p className="error-message">{errors.mobileNumber}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-container">
            <button type="submit" className="send-code-button">
              Send Code
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
