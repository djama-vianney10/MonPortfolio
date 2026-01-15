// src/components/admin/AdminLayoutContent.tsx
'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {

  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)



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