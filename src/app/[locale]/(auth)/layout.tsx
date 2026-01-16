import type React from "react"
import type { Metadata } from "next"
import "../../globals.css"

export const metadata: Metadata = {
  title: "LinguaLink - Professional Translation Services",
  description: "Breaking language barriers with expert translation services in 100+ languages",
  generator: "v0.app",
}

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
