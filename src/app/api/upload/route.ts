// 1. CRÉER: src/app/api/upload/route.ts
// ========================================
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Créer le dossier uploads/projects s'il n'existe pas
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'projects')
    await mkdir(uploadsDir, { recursive: true })

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const originalName = file.name.replace(/\s+/g, '-')
    const filename = `${timestamp}-${originalName}`
    const filepath = path.join(uploadsDir, filename)

    // Convertir le fichier en Buffer et sauvegarder
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Retourner l'URL publique
    const url = `/uploads/projects/${filename}`
    
    return NextResponse.json({ url }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}