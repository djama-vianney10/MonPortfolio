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
    const experience = await prisma.experience.create({
      data: body,
    })

    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    )
  }
}