import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google"
import Navbar from "@/components/navbar"
import "./globals.css"
import 'keen-slider/keen-slider.min.css';
import { Footer } from "@/components/Footer"


const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})


export const metadata: Metadata = {
  title: "Global Way - Your Education Gateway",
  description: "Connect with top universities worldwide and find the perfect program for your educational journey",
  keywords: "education, universities, countries, study abroad, global education",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body className={`${notoSans.className} antialiased`}>
       
       <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
