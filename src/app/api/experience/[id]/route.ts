// src/app/api/experience/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const experience = await prisma.experience.update({
      where: { id: params.id },
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

    return NextResponse.json(experience)
  } catch (error) {
    console.error('PUT /api/experience/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.experience.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/experience/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    )
  }
}