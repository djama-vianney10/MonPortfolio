// 1. VÉRIFIER/CRÉER: src/app/api/contact/route.ts
// ========================================
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prismaRetry } from '@/lib/prisma-retry'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation des champs requis
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Créer le contact dans la base de données avec retry
    const contact = await prismaRetry(
      () => prisma.contact.create({
        data: {
          name: body.name.trim(),
          email: body.email.trim().toLowerCase(),
          subject: body.subject.trim(),
          message: body.message.trim(),
          status: 'NEW',
        },
      }),
      { maxRetries: 3, retryDelay: 500 }
    )

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully',
        id: contact.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/contact error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const contacts = await prismaRetry(
      () => prisma.contact.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: 'desc' },
      })
    )

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('GET /api/contact error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}