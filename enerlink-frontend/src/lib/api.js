// API functions for backend integration
// These use mock data for now - replace with real API calls when backend is ready

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Mock delay to simulate real API calls
const mockDelay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

// Fetch user profile by wallet address
export const fetchUserProfile = async (walletAddress) => {
  try {
    await mockDelay(800)

    // Mock API call - replace with real fetch when backend is ready
    // const response = await fetch(`${API_BASE_URL}/user/profile/${walletAddress}`)
    // return await response.json()

    // Mock response for now
    const mockProfiles = {
      // Add some mock profiles for testing
      "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU": {
        enerID: "judechucks08",
        walletAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        createdAt: "2025-01-20",
        isVerified: true,
      },
    }

    const profile = mockProfiles[walletAddress]

    if (profile) {
      return { success: true, data: profile }
    } else {
      return { success: false, error: "Profile not found" }
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return { success: false, error: "Failed to fetch profile" }
  }
}

// Generate new user profile (triggers Ener ID generation)
export const generateUserProfile = async (walletAddress) => {
  try {
    await mockDelay(1200)

    // Mock API call - replace with real fetch when backend is ready
    // const response = await fetch(`${API_BASE_URL}/user/create-profile`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ walletAddress })
    // })
    // return await response.json()

    // Mock Ener ID generation logic (backend will handle this)
    const generateMockEnerID = (address) => {
      const prefix = address.slice(0, 8).toLowerCase()
      const suffix = Math.random().toString(36).substring(2, 4)
      return `${prefix}${suffix}`
    }

    const newProfile = {
      enerID: generateMockEnerID(walletAddress),
      walletAddress: walletAddress,
      createdAt: new Date().toISOString(),
      isVerified: false,
    }

    return { success: true, data: newProfile }
  } catch (error) {
    console.error("Error generating user profile:", error)
    return { success: false, error: "Failed to generate profile" }
  }
}

// Check Ener ID availability (for future custom ID feature)
export const checkEnerIDAvailability = async (enerID) => {
  try {
    await mockDelay(500)

    // Mock API call
    // const response = await fetch(`${API_BASE_URL}/user/check-availability/${enerID}`)
    // return await response.json()

    // Mock availability check
    const unavailableIDs = ["admin", "root", "system", "judechucks08"]
    const isAvailable = !unavailableIDs.includes(enerID.toLowerCase())

    return { success: true, available: isAvailable }
  } catch (error) {
    console.error("Error checking Ener ID availability:", error)
    return { success: false, error: "Failed to check availability" }
  }
}

// Update user profile
export const updateUserProfile = async (walletAddress, updates) => {
  try {
    await mockDelay(800)

    // Mock API call
    // const response = await fetch(`${API_BASE_URL}/user/profile/${walletAddress}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updates)
    // })
    // return await response.json()

    return { success: true, data: { ...updates, updatedAt: new Date().toISOString() } }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}
