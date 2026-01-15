// src/app/(public)/contact/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Send } from 'lucide-react'
import ContactForm from '@/components/public/ContactForm'
import Card from '@/components/ui/Card'

export default function ContactPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'djamavianney58@gmail.com',
      href: 'mailto:djamavianney58@gmail.com',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Côte D\'ivoire, Abidjan, Bingerville',
    },
  ]

  // Éviter les problèmes d'hydratation avec framer-motion
  if (!mounted) {
    return (
      <div className="min-h-screen py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Get In <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have a project in mind? Let's work together to bring your ideas to life.
            </p>
          </div>
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Get In <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a project in mind? Let's work together to bring your ideas to life.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="md:col-span-2 space-y-6"
          >
            <Card className="w-full">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Contact Information
              </h2>
              <div className="space-y-4">
                {contactInfo.map((item) => {
                  const Icon = item.icon
                  const content = (
                    <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="text-blue-600 dark:text-blue-400" size={20} />
                      </div>
                      <div className="w-full">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{item.label}</p>
                        <p className="font-semibold text-gray-900 dark:text-white break-words">{item.value}</p>
                      </div>
                    </div>
                  )

                  return item.href ? (
                    <a key={item.label} href={item.href}>
                      {content}
                    </a>
                  ) : (
                    <div key={item.label}>{content}</div>
                  )
                })}
              </div>
            </Card>

            <Card className="w-full">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Quick Response
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                I typically respond within 24 hours. For urgent matters, please mention it in your message.
              </p>
            </Card>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="md:col-span-3"
          >
            <Card className="w-full">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <Send size={24} />
                Send a Message
              </h2>
              <ContactForm />
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}