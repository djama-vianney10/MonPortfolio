// src/types/index.ts
import { LucideIcon } from 'lucide-react'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }

  interface User {
    role: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
  }
}

// Project Types
export interface Project {
  id: string
  title: string
  description: string
  longDesc?: string | null
  imageUrl: string
  demoUrl?: string | null
  githubUrl?: string | null
  technologies: string[]
  featured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

// Skill Types
export interface Skill {
  id: string
  name: string
  category: string
  level: number
  icon?: string | null
  order: number
  createdAt: Date
  updatedAt: Date
}

// Experience Types
export interface Experience {
  id: string
  company: string
  position: string
  description: string
  startDate: Date
  endDate?: Date | null
  current: boolean
  location?: string | null
  technologies: string[]
  order: number
  createdAt: Date
  updatedAt: Date
}

// Form Types
export interface ProjectFormData {
  title: string
  description: string
  longDesc?: string
  imageUrl: string
  demoUrl?: string
  githubUrl?: string
  technologies: string[]
  featured: boolean
}

export interface SkillFormData {
  name: string
  category: string
  level: number
  icon?: string
}

export interface ExperienceFormData {
  company: string
  position: string
  description: string
  startDate: string
  endDate?: string
  current: boolean
  location?: string
  technologies: string[]
}


export interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: 'blue' | 'purple' | 'green' | 'red'
  href?: string
  loading?: boolean
}