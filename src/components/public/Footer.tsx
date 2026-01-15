// src/components/public/Footer.tsx
'use client'

import { useState, useEffect } from 'react'
import { Github, Linkedin, Mail, Twitter } from 'lucide-react'

export default function Footer() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const socialLinks = [
    { icon: Github, href: 'https://github.com/djama-vianney10', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/vianney-djama-704686360/', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Mail, href: 'mailto:djamavianney58@gmail.com', label: 'Email' },
  ]

  // Éviter les problèmes d'hydratation avec la date
  const currentYear = mounted ? new Date().getFullYear() : 2024

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-400" suppressHydrationWarning>
              © {currentYear} Djama Anthony Vianney. Développeur Full Stack | Abidjan, Côte D'Ivoire
            </p>
          </div>

          <div className="flex items-center space-x-6">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label={social.label}
                >
                  <Icon size={30} />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}