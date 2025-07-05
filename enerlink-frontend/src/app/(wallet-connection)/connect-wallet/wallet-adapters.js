// Wallet adapter utilities for Solana wallets

export const detectWallets = () => {
  const wallets = {
    phantom: false,
    solflare: false,
    walletconnect: true, // Always available as it's web-based
  }

  if (typeof window !== "undefined") {
    wallets.phantom = !!(window.solana && window.solana.isPhantom)
    wallets.solflare = !!window.solflare
  }

  return wallets
}

export const getWalletDeepLink = (walletId, action = "connect") => {
  const deepLinks = {
    phantom: `phantom://browse/${window.location.origin}?action=${action}`,
    solflare: `solflare://browse/${window.location.origin}?action=${action}`,
  }

  return deepLinks[walletId] || null
}

export const isMobile = () => {
  if (typeof window === "undefined") return false

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
