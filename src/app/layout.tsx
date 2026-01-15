// ========================================
// 1. src/app/layout.tsx - ROOT LAYOUT FIXÉ
// ========================================
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import './globals.css'
import ThemeScript from '@/components/ThemeScript'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portfolio - Full Stack Developer',
  description: 'Modern portfolio showcasing projects, skills, and experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}