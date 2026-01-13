// src/app/(admin)/admin/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FolderKanban, Award, Briefcase, TrendingUp } from 'lucide-react'
import StatsCard from '@/components/admin/StatsCard'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { StatsCardProps } from '@/types'

interface Stats {
  projects: number
  skills: number
  experiences: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    skills: 0,
    experiences: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [projectsRes, skillsRes, experiencesRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/skills'),
        fetch('/api/experience'),
      ])

      const [projects, skills, experiences] = await Promise.all([
        projectsRes.json(),
        skillsRes.json(),
        experiencesRes.json(),
      ])

      setStats({
        projects: projects.length,
        skills: skills.length,
        experiences: experiences.length,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsData: Omit<StatsCardProps, 'loading'>[] = [
    {
      title: 'Total Projects',
      value: stats.projects,
      icon: FolderKanban,
      color: 'blue',
      href: '/admin/dashboard/projects',
    },
    {
      title: 'Total Skills',
      value: stats.skills,
      icon: Award,
      color: 'purple',
      href: '/admin/dashboard/skills',
    },
    {
      title: 'Work Experience',
      value: stats.experiences,
      icon: Briefcase,
      color: 'green',
      href: '/admin/dashboard/experience',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here s your portfolio overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <StatsCard {...stat} loading={loading} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Quick Actions</h2>
            <p className="text-gray-400">Manage your portfolio content</p>
          </div>
          <TrendingUp className="text-blue-500" size={32} />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/admin/dashboard/projects">
            <Button variant="outline" className="w-full justify-start">
              <FolderKanban size={18} className="mr-2" />
              Manage Projects
            </Button>
          </Link>
          <Link href="/admin/dashboard/skills">
            <Button variant="outline" className="w-full justify-start">
              <Award size={18} className="mr-2" />
              Manage Skills
            </Button>
          </Link>
          <Link href="/admin/dashboard/experience">
            <Button variant="outline" className="w-full justify-start">
              <Briefcase size={18} className="mr-2" />
              Manage Experience
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-4">Portfolio Status</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium">Public Portfolio</p>
              <p className="text-sm text-gray-400">Live and accessible</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium">Content Management</p>
              <p className="text-sm text-gray-400">All systems operational</p>
            </div>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full">
              Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}