// ========================================
// 6. src/components/admin/AdminLayoutContent.tsx - FIXÉ
// ========================================
'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-800 rounded w-1/4" />
            <div className="h-64 bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}