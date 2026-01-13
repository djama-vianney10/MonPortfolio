// src/app/(public)/contact/page.tsx
'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Send } from 'lucide-react'
import ContactForm from '@/components/public/ContactForm'
import Card from '@/components/ui/Card'

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'contact@example.com',
      href: 'mailto:contact@example.com',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'San Francisco, CA',
    },
  ]

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
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
            Have a project in mind? Let s work together to bring your ideas to life.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="md:col-span-2 space-y-6"
          >
            <Card>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Contact Information
              </h2>
              <div className="space-y-4">
                {contactInfo.map((item) => {
                  const Icon = item.icon
                  const content = (
                    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="text-blue-600 dark:text-blue-400" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {item.label}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {item.value}
                        </p>
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

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Quick Response
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                I typically respond within 24 hours. For urgent matters, please mention it in your message.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="md:col-span-3"
          >
            <Card>
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