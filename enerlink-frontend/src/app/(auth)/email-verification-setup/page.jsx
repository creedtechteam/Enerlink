"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function EmailVerificationSetup() {
  const [formData, setFormData] = useState({
    country: "",
    emailAddress: "",
  })

  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSendCode = (e) => {
    e.preventDefault()
    console.log("Email verification setup:", formData)
    // Add send code logic here later
    router.push("/enter-2fa-code")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-6 py-4">
        <Link href="/enter-2fa-code" className="text-2xl">
          ←
        </Link>
      </div>

      {/* Main Content */}
      <div className="px-6">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-black mb-6">Setup two-step verification</h1>

        {/* Instructions Banner */}
        <div className="bg-gray-300 rounded-lg p-4 mb-6">
          <p className="text-gray-600 text-center">Text words</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSendCode} className="space-y-6">
          {/* Country and Email Address Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-black mb-2">Country</label>
              <div className="relative">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-gray-300 rounded-lg px-4 py-3 text-black border-none outline-none appearance-none"
                >
                  <option value="">Select</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="ca">Canada</option>
                  <option value="ng">Nigeria</option>
                  <option value="gh">Ghana</option>
                  <option value="ke">Kenya</option>
                  {/* Add more countries as needed */}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-black mb-2">Email address</label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                className="w-full bg-gray-300 rounded-lg px-4 py-3 text-black border-none outline-none"
                placeholder=""
              />
            </div>
          </div>

          {/* Additional Info Banner */}
          <div className="bg-gray-300 rounded-lg p-4">
            <p className="text-gray-600 text-center">Text words</p>
          </div>

          {/* Submit Button */}
          <div className="pt-8">
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-full text-lg font-medium hover:bg-gray-600 active:bg-gray-600 transition-colors"
            >
              Send Code
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
