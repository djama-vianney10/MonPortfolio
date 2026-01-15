// src/app/api/experience/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [{ current: 'desc' }, { startDate: 'desc' }],
    })
    return NextResponse.json(experiences)
  } catch (error) {
    console.error('GET /api/experience error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    )
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