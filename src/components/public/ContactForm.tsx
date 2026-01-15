// 2. MODIFIER: src/components/public/ContactForm.tsx - MEILLEURE GESTION D'ERREURS
// ========================================
'use client'

import { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ContactForm() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSuccess(false), 5000)
      } else {
        // Afficher l'erreur du serveur
        setError(data.error || 'Failed to send message')
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    // Effacer les erreurs quand l'utilisateur commence à taper
    if (error) setError('')
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
          disabled={loading}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
          disabled={loading}
        />
      </div>

      <Input
        label="Subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        placeholder="Project Inquiry"
        required
        disabled={loading}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          placeholder="Tell me about your project..."
          required
          disabled={loading}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Message de succès */}
      {success && (
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
          <p className="text-green-600 dark:text-green-400 font-medium">
            ✓ Message sent successfully! I'll get back to you soon.
          </p>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 font-medium">
            ✗ {error}
          </p>
        </div>
      )}

      <Button 
        type="submit" 
        isLoading={loading} 
        className="w-full" 
        size="lg"
        disabled={loading}
      >
        {loading ? 'Sending...' : (
          <>
            <Send size={18} className="mr-2" />
            Send Message
          </>
        )}
      </Button>
    </form>
  )
}