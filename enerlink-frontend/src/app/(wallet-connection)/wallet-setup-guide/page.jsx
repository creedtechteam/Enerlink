"use client"

import Link from "next/link"

export default function WalletSetupGuide() {
  const mobileWallets = [
    {
      name: "MetaMask Mobile",
      icon: "🦊",
      description: "Most popular mobile crypto wallet",
      ios: "https://apps.apple.com/app/metamask/id1438144202",
      android: "https://play.google.com/store/apps/details?id=io.metamask",
      features: ["Easy to use", "Secure", "DeFi ready"],
    },
    {
      name: "Trust Wallet",
      icon: "🛡️",
      description: "Binance's official mobile wallet",
      ios: "https://apps.apple.com/app/trust-crypto-bitcoin-wallet/id1288339409",
      android: "https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp",
      features: ["Multi-chain", "Built-in DApps", "Staking"],
    },
    {
      name: "Rainbow Wallet",
      icon: "🌈",
      description: "Beautiful and simple mobile wallet",
      ios: "https://apps.apple.com/app/rainbow-ethereum-wallet/id1457119021",
      android: "https://play.google.com/store/apps/details?id=me.rainbow",
      features: ["Great design", "NFT support", "Easy onboarding"],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-6 py-4">
        <Link href="/connect-wallet" className="text-2xl">
          ←
        </Link>
      </div>

      {/* Main Content */}
      <div className="px-6">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-black mb-6">Get a Mobile Wallet</h1>

        {/* Instructions */}
        <div className="space-y-6">
          <div className="bg-gray-100 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-black mb-3">📱 What is a mobile wallet?</h2>
            <p className="text-gray-700 text-sm">
              A mobile wallet app lets you store cryptocurrency and interact with decentralized apps like EnerLink. It's
              like a digital bank account for the blockchain.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-black">Recommended Mobile Wallets:</h2>

            {mobileWallets.map((wallet, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="text-3xl mr-3">{wallet.icon}</div>
                  <div>
                    <h3 className="font-semibold text-black">{wallet.name}</h3>
                    <p className="text-gray-700 text-sm">{wallet.description}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {wallet.features.map((feature, idx) => (
                      <span key={idx} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={wallet.ios}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-black text-white px-4 py-2 rounded-lg text-sm text-center hover:bg-gray-600"
                  >
                    📱 iOS App
                  </a>
                  <a
                    href={wallet.android}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm text-center hover:bg-green-700"
                  >
                    🤖 Android App
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Setup Steps */}
          <div className="bg-blue-100 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-black mb-3">🚀 Quick Setup:</h2>
            <ol className="text-gray-700 text-sm space-y-2">
              <li>1. Download a wallet app from above</li>
              <li>2. Create a new wallet (save your seed phrase!)</li>
              <li>3. Come back to EnerLink</li>
              <li>4. Connect your wallet</li>
            </ol>
          </div>

          {/* Back to Connect */}
          <div className="pt-4">
            <Link href="/connect-wallet">
              <button className="w-full bg-black text-white py-4 rounded-full text-lg font-medium hover:bg-gray-600 active:bg-gray-600 transition-colors">
                Back to Connect Wallet
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
