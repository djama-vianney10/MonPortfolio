// 1. VÉRIFIER: src/components/ui/Portal.tsx existe et est correct
// ========================================
'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: React.ReactNode
}

export default function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (typeof window === 'undefined' || !mounted) return null

  return createPortal(children, document.body)
}