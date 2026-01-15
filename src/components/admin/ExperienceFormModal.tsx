// 2. REFAIRE: src/components/admin/ExperienceFormModal.tsx - VERSION STABLE
// ========================================
'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Experience } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Portal from '@/components/ui/Portal'

interface ExperienceFormModalProps {
  experience: Experience | null
  onClose: () => void
}

export default function ExperienceFormModal({ experience, onClose }: ExperienceFormModalProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    current: false,
    location: '',
    technologies: '',
    order: 0,
  })

  useEffect(() => {
    // Attendre que le composant soit monté
    setMounted(true)
    
    // Bloquer le scroll
    document.body.style.overflow = 'hidden'
    
    // Charger les données de l'expérience si édition
    if (experience) {
      setFormData({
        company: experience.company,
        position: experience.position,
        description: experience.description,
        startDate: new Date(experience.startDate).toISOString().split('T')[0],
        endDate: experience.endDate
          ? new Date(experience.endDate).toISOString().split('T')[0]
          : '',
        current: experience.current,
        location: experience.location || '',
        technologies: experience.technologies.join(', '),
        order: experience.order,
      })
    }

    return () => {
      // Débloquer le scroll
      document.body.style.overflow = 'unset'
    }
  }, [experience])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        technologies: formData.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      }

      const url = experience ? `/api/experience/${experience.id}` : '/api/experience'
      const method = experience ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        onClose()
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save experience')
      }
    } catch (error) {
      console.error('Failed to save experience:', error)
      alert(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number'
        ? Number(value)
        : value,
    }))
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Ne rien afficher avant le montage complet
  if (!mounted) {
    return null
  }

  return (
    <Portal>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div 
          className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header fixe */}
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold">
              {experience ? 'Edit Experience' : 'Add Experience'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Company *"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Inc."
                required
                disabled={loading}
              />
              <Input
                label="Position *"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Senior Developer"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your role and achievements..."
                required
                disabled={loading}
                className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Start Date *"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <Input
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.current || loading}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="current"
                name="current"
                checked={formData.current}
                onChange={handleChange}
                disabled={loading}
                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <label htmlFor="current" className="text-sm text-gray-300">
                I currently work here
              </label>
            </div>

            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="San Francisco, CA"
              disabled={loading}
            />

            <Input
              label="Technologies (comma separated)"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, PostgreSQL"
              disabled={loading}
            />

            <Input
              label="Display Order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
              min={0}
              disabled={loading}
            />

            <div className="flex gap-3 pt-4 border-t border-gray-800">
              <Button 
                type="submit" 
                isLoading={loading} 
                className="flex-1" 
                disabled={loading}
              >
                {experience ? 'Update Experience' : 'Create Experience'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  )
}