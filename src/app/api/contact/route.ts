// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    // 1. Sauvegarder le message dans la base de données
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message,
        status: 'NEW',
      },
    })

    // 2. Envoyer l'email via Resend
    try {
      await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>', // Utilisez votre domaine vérifié
        to: process.env.ADMIN_EMAIL || 'djamavianney58@gmail.com',
        subject: `📬 Nouveau message: ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  padding: 30px;
                  border-radius: 10px 10px 0 0;
                  text-align: center;
                }
                .content {
                  background: #f8f9fa;
                  padding: 30px;
                  border-radius: 0 0 10px 10px;
                }
                .info-row {
                  background: white;
                  padding: 15px;
                  margin: 10px 0;
                  border-radius: 5px;
                  border-left: 4px solid #667eea;
                }
                .label {
                  font-weight: bold;
                  color: #667eea;
                  margin-bottom: 5px;
                }
                .message-box {
                  background: white;
                  padding: 20px;
                  margin-top: 20px;
                  border-radius: 5px;
                  border: 1px solid #dee2e6;
                }
                .footer {
                  text-align: center;
                  margin-top: 20px;
                  color: #6c757d;
                  font-size: 12px;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 style="margin: 0;">📬 Nouveau message de contact</h1>
              </div>
              <div class="content">
                <div class="info-row">
                  <div class="label">👤 Nom</div>
                  <div>${name}</div>
                </div>
                <div class="info-row">
                  <div class="label">📧 Email</div>
                  <div><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="info-row">
                  <div class="label">📌 Sujet</div>
                  <div>${subject}</div>
                </div>
                <div class="message-box">
                  <div class="label">💬 Message</div>
                  <div style="white-space: pre-wrap;">${message}</div>
                </div>
                <div class="footer">
                  <p>Message reçu le ${new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                  <p>ID du message: ${contact.id}</p>
                </div>
              </div>
            </body>
          </html>
        `,
        // Version texte pour les clients email qui ne supportent pas HTML
        text: `
Nouveau message de contact

Nom: ${name}
Email: ${email}
Sujet: ${subject}

Message:
${message}

---
Reçu le ${new Date().toLocaleString('fr-FR')}
ID: ${contact.id}
        `,
      })
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError)
      // On continue même si l'email échoue, car le message est sauvegardé
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message envoyé avec succès',
        id: contact.id 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur du formulaire de contact:', error)
    return NextResponse.json(
      { error: 'Échec de l\'envoi du message' },
      { status: 500 }
    )
  }
}

// GET pour récupérer les messages (admin seulement)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const contacts = await prisma.contact.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error)
    return NextResponse.json(
      { error: 'Échec de la récupération des messages' },
      { status: 500 }
    )
  }
}