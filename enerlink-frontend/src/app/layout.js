import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "../contexts/WalletContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EnerLink - Decentralized Energy & Internet",
  description: "Access solar energy and internet through community nodes",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <div className="bg-white min-h-screen w-full">{children}</div>
        </WalletProvider>
      </body>
    </html>
  )
}
