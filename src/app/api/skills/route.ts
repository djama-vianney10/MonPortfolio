// src/app/api/skills/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(skills)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
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
    const skill = await prisma.skill.create({
      data: body,
    })

    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    )
  }
}