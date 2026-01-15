// src/app/api/projects/[id]/route.ts
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
    if (!body.title || !body.description || !body.imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convertir order en nombre
    const orderValue = typeof body.order === 'string' 
      ? parseInt(body.order, 10) 
      : body.order

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        longDesc: body.longDesc || '',
        imageUrl: body.imageUrl,
        demoUrl: body.demoUrl || '',
        githubUrl: body.githubUrl || '',
        technologies: body.technologies || [],
        featured: body.featured || false,
        order: orderValue || 0,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('PUT /api/projects/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
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

    await prisma.project.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/projects/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}