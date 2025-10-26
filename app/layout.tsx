import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "QuoteSaaS - AI-Powered Quote Forms in 3 Lines of Code",
  description:
    "Generate instant quotes with AI photo analysis. Embeddable widget for your website. No complex integrations. Start collecting leads in minutes.",
  keywords: "AI quote form, embedded widget, lead generation, AI photo analysis, instant quotes, SaaS quote tool, form builder, conversion optimization",
  authors: [{ name: "QuoteSaaS" }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  openGraph: {
    title: "QuoteSaaS - AI-Powered Quote Forms",
    description: "Generate instant quotes with AI photo analysis. Embed in 3 lines of code.",
    url: "https://quotesaas.com",
    siteName: "QuoteSaaS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuoteSaaS - AI-Powered Quote Forms",
    description: "Generate instant quotes with AI photo analysis. Embed in 3 lines of code.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
