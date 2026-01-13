// src/components/admin/ExperienceFormModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Experience } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface ExperienceFormModalProps {
  experience: Experience | null
  onClose: () => void
}

export default function ExperienceFormModal({ experience, onClose }: ExperienceFormModalProps) {
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
      }
    } catch (error) {
      console.error('Failed to save experience:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {experience ? 'Edit Experience' : 'Create Experience'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
            <Input
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              disabled={formData.current}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="current"
              name="current"
              checked={formData.current}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600"
            />
            <label htmlFor="current" className="text-sm text-gray-300">
              Currently working here
            </label>
          </div>

          <Input
            label="Location (Optional)"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="San Francisco, CA"
          />

          <Input
            label="Technologies (comma separated)"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            placeholder="React, Node.js, AWS"
          />

          <Input
            label="Order"
            name="order"
            type="number"
            value={formData.order}
            onChange={handleChange}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" isLoading={loading} className="flex-1">
              {experience ? 'Update' : 'Create'} Experience
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}