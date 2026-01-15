// src/components/admin/SkillFormModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Skill } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface SkillFormModalProps {
  skill: Skill | null
  onClose: () => void
}

export default function SkillFormModal({ skill, onClose }: SkillFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 50,
    icon: '',
    order: 0,
  })

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        category: skill.category,
        level: skill.level,
        icon: skill.icon || '',
        order: skill.order,
      })
    }
  }, [skill])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = skill ? `/api/skills/${skill.id}` : '/api/skills'
      const method = skill ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        onClose()
      } else {
        throw new Error('Failed to save skill')
      }
    } catch (error) {
      console.error('Failed to save skill:', error)
      alert(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' || type === 'range' ? Number(value) : value,
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-lg">
        <div className="border-b border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {skill ? 'Edit Skill' : 'Create Skill'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Skill Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="React"
            required
          />

          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Frontend, Backend, Tools..."
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Proficiency Level: {formData.level}%
            </label>
            <input
              type="range"
              name="level"
              min="0"
              max="100"
              value={formData.level}
              onChange={handleChange}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>

          <Input
            label="Icon (Optional)"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="emoji or icon name"
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
              {skill ? 'Update' : 'Create'} Skill
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