import "./globals.css"

import { Inter, Righteous } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })
const righteous = Righteous({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
})

import { Web3AuthProvider } from "@/context/Web3Context"
import { MarketsProvider } from "@/context/MarketsContext"

export const metadata = {
  title: "ComboMarket",
  description: "Combined predictions on top of PolyMarket.",
}

// eslint-disable-next-line no-undef
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Web3AuthProvider>
      <MarketsProvider>
        <html lang='en'>
          <body className={`${inter.className} w-screen h-screen font-sans`}>
            {children}
          </body>
        </html>
      </MarketsProvider>
    </Web3AuthProvider>
  )
}
