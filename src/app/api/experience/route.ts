// src/app/api/experience/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { prismaRetry } from '@/lib/prisma-retry'

export async function GET() {
  try {
    const skills = await prismaRetry(
      () => prisma.skill.findMany({
        orderBy: { order: 'asc' },
      })
    )
    return NextResponse.json(skills)
  } catch (error) {
    console.error('GET /api/skills error:', error)
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validation
    if (!body.company || !body.position || !body.description || !body.startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convertir order en nombre
    const orderValue = typeof body.order === 'string' 
      ? parseInt(body.order, 10) 
      : body.order

    const experience = await prisma.experience.create({
      data: {
        company: body.company,
        position: body.position,
        description: body.description,
        startDate: body.startDate,
        endDate: body.endDate || null,
        current: body.current || false,
        location: body.location || '',
        technologies: body.technologies || [],
        order: orderValue || 0,
      },
    })

    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    console.error('POST /api/experience error:', error)
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    )
  }
}