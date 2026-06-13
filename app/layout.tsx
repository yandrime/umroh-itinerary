import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Umroh AY - Itinerary Umroh AY",
  description: "Aplikasi itinerary umroh lengkap",
  generator: "v0.app",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-ss-umroh.jpg",
    apple: "/logo-ss-umroh.jpg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Umroh AY",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Umroh AY",
    title: "Umroh AY - Itinerary Umroh AY",
    description: "Aplikasi itinerary umroh lengkap",
  },
  twitter: {
    card: "summary",
    title: "Umroh AY - Itinerary Umroh AY",
    description: "Aplikasi itinerary umroh lengkap",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="application-name" content="Umroh AY" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Umroh AY" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#8b5cf6" />
        <link rel="apple-touch-icon" href="/logo-ss-umroh.jpg" />
        <link rel="icon" type="image/jpeg" sizes="32x32" href="/logo-ss-umroh.jpg" />
        <link rel="icon" type="image/jpeg" sizes="16x16" href="/logo-ss-umroh.jpg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/logo-ss-umroh.jpg" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
