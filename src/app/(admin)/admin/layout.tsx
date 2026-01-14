// src/app/(admin)/admin/layout.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import AdminLayoutContent from '@/components/admin/AdminLayoutContent'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  )
}