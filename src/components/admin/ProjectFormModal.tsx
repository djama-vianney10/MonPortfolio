// src/components/admin/ProjectFormModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { Project } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface ProjectFormModalProps {
  project: Project | null
  onClose: () => void
}

export default function ProjectFormModal({ project, onClose }: ProjectFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDesc: '',
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
        demoUrl: project.demoUrl || '',
        githubUrl: project.githubUrl || '',
        technologies: project.technologies.join(', '),
        featured: project.featured,
        order: project.order,
      })
      setImagePreview(project.imageUrl || '')
    }
  }, [project])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide')
      return
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB')
      return
    }

    setImageFile(file)

    // Créer un aperçu
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Vérifier qu'une image est présente (nouvelle ou existante)
    if (!imageFile && !imagePreview) {
      alert('Veuillez sélectionner une image pour le projet')
      return
    }
    
    setLoading(true)

    try {
      let imageUrl = project?.imageUrl || ''

      // Si une nouvelle image a été sélectionnée, l'uploader d'abord
      if (imageFile) {
        const formDataImage = new FormData()
        formDataImage.append('file', imageFile)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formDataImage,
        })

        if (!uploadRes.ok) {
          throw new Error('Échec du téléchargement de l\'image')
        }

        const { url } = await uploadRes.json()
        imageUrl = url
      }

      const payload = {
        ...formData,
        imageUrl,
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
      } else {
        throw new Error('Échec de la sauvegarde du projet')
      }
    } catch (error) {
      console.error('Failed to save project:', error)
      alert(error instanceof Error ? error.message : 'Une erreur est survenue')
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
            {project ? 'Modifier le projet' : 'Créer un projet'}
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
            label="Titre"
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
              Description détaillée (Optionnel)
            </label>
            <textarea
              name="longDesc"
              value={formData.longDesc}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Upload d'image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Image du projet *
            </label>
            
            {imagePreview && (
              <div className="mb-3 relative rounded-lg overflow-hidden border border-gray-700">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null)
                    setImagePreview('')
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-750 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {imageFile ? (
                  <>
                    <ImageIcon className="w-10 h-10 mb-3 text-green-500" />
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold text-green-500">{imageFile.name}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Cliquez pour changer l'image
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WEBP (MAX. 5MB)
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="URL de démo (Optionnel)"
              name="demoUrl"
              value={formData.demoUrl}
              onChange={handleChange}
              placeholder="https://demo.example.com"
            />
            <Input
              label="URL GitHub (Optionnel)"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />
          </div>

          <Input
            label="Technologies (séparées par des virgules)"
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
                Projet en vedette
              </label>
            </div>

            <Input
              label="Ordre d'affichage"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" isLoading={loading} className="flex-1">
              {project ? 'Mettre à jour' : 'Créer'} le projet
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}