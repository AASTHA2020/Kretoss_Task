import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GlobalLoader from './components/GlobalLoader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Event Booking Platform',
  description: 'A modern event booking platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <GlobalLoader />
    </html>
  )
}
