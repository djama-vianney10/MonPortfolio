// 3. MODIFIER: src/app/api/projects/[id]/route.ts - AVEC RETRY
// ========================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { prismaRetry } from '@/lib/prisma-retry'

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

    // Utiliser prismaRetry pour gérer les déconnexions
    const project = await prismaRetry(
      () => prisma.project.update({
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
      }),
      { maxRetries: 3, retryDelay: 500 }
    )

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

    await prismaRetry(
      () => prisma.project.delete({
        where: { id: params.id },
      }),
      { maxRetries: 3, retryDelay: 500 }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/projects/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
