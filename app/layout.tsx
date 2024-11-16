import "./globals.css"
import { Inter } from "next/font/google"
import { Markazi_Text } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })
const markazi = Markazi_Text({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

import { Web3AuthProvider } from "../context/Web3AuthContext"

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
      <html lang='en'>
        <body className={markazi.className}>
          <div className='w-screen h-screen mt-[80px]'>{children}</div>
        </body>
      </html>
    </Web3AuthProvider>
  )
}
