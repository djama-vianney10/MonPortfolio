// src/components/admin/ProjectFormModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Project } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface ProjectFormModalProps {
  project: Project | null
  onClose: () => void
}

export default function ProjectFormModal({ project, onClose }: ProjectFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDesc: '',
    imageUrl: '',
    demoUrl: '',
    githubUrl: '',
    technologies: '',
    featured: false,
    order: 0,
  })

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        longDesc: project.longDesc || '',
        imageUrl: project.imageUrl || '',
        demoUrl: project.demoUrl || '',
        githubUrl: project.githubUrl || '',
        technologies: project.technologies.join(', '),
        featured: project.featured,
        order: project.order,
      })
    }
  }, [project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        technologies: formData.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      }

      const url = project ? `/api/projects/${project.id}` : '/api/projects'
      const method = project ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        onClose()
      }
    } catch (error) {
      console.error('Failed to save project:', error)
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
            {project ? 'Edit Project' : 'Create Project'}
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
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Long Description (Optional)
            </label>
            <textarea
              name="longDesc"
              value={formData.longDesc}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Input
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => {
                if (!e.target.files?.[0]) return
                setFormData((prev) => ({
                    ...prev,
                    imageFile: e.target.files![0]
                }))
            }}
            className="w-full text-sm text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700"
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Demo URL (Optional)"
              name="demoUrl"
              value={formData.demoUrl}
              onChange={handleChange}
            />
            <Input
              label="GitHub URL (Optional)"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Technologies (comma separated)"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            placeholder="React, TypeScript, Next.js"
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="featured" className="text-sm text-gray-300">
                Featured Project
              </label>
            </div>

            <Input
              label="Order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" isLoading={loading} className="flex-1">
              {project ? 'Update' : 'Create'} Project
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