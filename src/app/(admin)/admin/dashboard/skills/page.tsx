// 5. MODIFIER: src/app/(admin)/admin/dashboard/skills/page.tsx
// ========================================
'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Skill } from '@/types'
import Button from '@/components/ui/Button'
import SkillFormModal from '@/components/admin/SkillFormModal'

export default function AdminSkillsPage() {
  const [mounted, setMounted] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)

  useEffect(() => {
    setMounted(true)
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills')
      const data = await res.json()
      setSkills(data)
    } catch (error) {
      console.error('Failed to fetch skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return

    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSkills(skills.filter((s) => s.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete skill:', error)
    }
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingSkill(null)
    fetchSkills()
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gray-800 rounded animate-pulse" />
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-gray-800 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Skills</h1>
          <p className="text-gray-400">Manage your technical skills</p>
        </div>
        <Button onClick={() => { setEditingSkill(null); setIsModalOpen(true) }}>
          <Plus size={18} className="mr-2" />
          Add Skill
        </Button>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <p className="text-gray-400 mb-4">No skills yet</p>
          <Button onClick={() => setIsModalOpen(true)}>Add your first skill</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4">{category}</h2>
              <div className="grid gap-4">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">{skill.name}</h3>
                      <span className="text-sm text-blue-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEdit(skill)} className="flex-1">
                        <Edit size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(skill.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <SkillFormModal skill={editingSkill} onClose={handleModalClose} />
      )}
    </div>
  )
}