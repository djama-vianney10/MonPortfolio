// 3. CORRIGER: src/app/(public)/experience/page.tsx - FIX HYDRATATION
// ========================================
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, Calendar } from 'lucide-react'
import { Experience } from '@/types'
import { formatDateShort } from '@/lib/utils'
import Card from '@/components/ui/Card'

export default function ExperiencePage() {
  const [mounted, setMounted] = useState(false)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
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

  // Skeleton pendant le chargement côté client
  if (!mounted) {
    return (
      <div className="min-h-screen py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Work <span className="text-gradient">Experience</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            My professional journey
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="mx-auto mb-4 text-gray-400" size={64} />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No experience data available yet.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600 hidden md:block" />

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-6 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 hidden md:block" />

                  <div className="md:ml-20">
                    <Card hover>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {exp.position}
                          </h3>
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mt-1">
                            <Briefcase size={16} />
                            {exp.company}
                          </div>
                        </div>
                        {exp.current && (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
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

                      <p className="text-gray-600 dark:text-gray-400 mb-4 break-words overflow-hidden whitespace-normal">
                        {exp.description}
                      </p>

                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}