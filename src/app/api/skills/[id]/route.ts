// src/app/api/skills/[id]/route.ts
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

    const skill = await prisma.skill.update({
      where: { id: params.id },
      data: {
        name: body.name,
        category: body.category,
        level: levelValue || 0,
        icon: body.icon || '',
        order: orderValue || 0,
      },
    })

    return NextResponse.json(skill)
  } catch (error) {
    console.error('PUT /api/skills/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update skill' },
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

    await prisma.skill.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/skills/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    )
  }
}