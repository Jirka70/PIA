import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "../globals.css"

export const metadata: Metadata = {
  title: "LinguaLink - Professional Translation Services",
  description: "Breaking language barriers with expert translation services in 100+ languages",
  generator: "v0.app",
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main>
      {children}
    </main>
  )
}
