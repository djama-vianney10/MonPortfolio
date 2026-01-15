// 3. SIMPLIFIER: src/app/(admin)/admin/dashboard/experience/page.tsx
// ========================================
'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react'
import { Experience } from '@/types'
import { formatDateShort } from '@/lib/utils'
import Button from '@/components/ui/Button'
import ExperienceFormModal from '@/components/admin/ExperienceFormModal'

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExp, setEditingExp] = useState<Experience | null>(null)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experience')
      const data = await res.json()
      setExperiences(data)
    } catch (error) {
      console.error('Failed to fetch experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return

    try {
      const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setExperiences(experiences.filter((e) => e.id !== id))
      } else {
        alert('Failed to delete experience')
      }
    } catch (error) {
      console.error('Failed to delete experience:', error)
      alert('An error occurred while deleting')
    }
  }

  const handleEdit = (exp: Experience) => {
    setEditingExp(exp)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingExp(null)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingExp(null)
    // Rafraîchir la liste après fermeture
    fetchExperiences()
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Experience</h1>
            <p className="text-gray-400">Manage your work experience</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus size={18} className="mr-2" />
            Add Experience
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
            <p className="text-gray-400 mb-4">No experience yet</p>
            <Button onClick={handleCreate}>Add your first experience</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{exp.position}</h3>
                    <p className="text-blue-400 font-semibold">{exp.company}</p>
                  </div>
                  {exp.current && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDateShort(exp.startDate)} -{' '}
                    {exp.current ? 'Present' : formatDateShort(exp.endDate!)}
                  </div>
                  {exp.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {exp.location}
                    </div>
                  )}
                </div>

                <p className="text-gray-400 mb-4 break-words overflow-hidden whitespace-normal">
                  {exp.description}
                </p>

                {exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(exp)}>
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(exp.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rendre le modal conditionnellement */}
      {isModalOpen && (
        <ExperienceFormModal 
          experience={editingExp} 
          onClose={handleModalClose} 
        />
      )}
    </>
  )
}