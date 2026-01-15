// src/app/api/skills/route.ts
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
    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convertir les valeurs numériques
    const levelValue = typeof body.level === 'string' 
      ? parseInt(body.level, 10) 
      : body.level

    const orderValue = typeof body.order === 'string' 
      ? parseInt(body.order, 10) 
      : body.order

    const skill = await prisma.skill.create({
      data: {
        name: body.name,
        category: body.category,
        level: levelValue || 0,
        icon: body.icon || '',
        order: orderValue || 0,
      },
    })

    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    console.error('POST /api/skills error:', error)
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    )
  }
}