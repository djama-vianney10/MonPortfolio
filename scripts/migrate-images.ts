// 1. CRÉER: scripts/migrate-images.ts
// ========================================
import { PrismaClient } from '@prisma/client'
import { put } from '@vercel/blob'
import { readFile, readdir } from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

interface Project {
  id: string
  imageUrl: string
}

async function migrateImages() {
  console.log('🚀 Starting image migration to Vercel Blob...\n')

  try {
    // 1. Récupérer tous les projets
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        imageUrl: true,
      },
    })

    console.log(`📦 Found ${projects.length} projects to migrate\n`)

    let successCount = 0
    let errorCount = 0

    // 2. Migrer chaque image
    for (const project of projects) {
      try {
        // Vérifier si l'image est locale (commence par /uploads/)
        if (!project.imageUrl.startsWith('/uploads/')) {
          console.log(`⏭️  Skipping ${project.id} - Already using external URL`)
          continue
        }

        console.log(`📤 Migrating: ${project.imageUrl}`)

        // Chemin local de l'image
        const localPath = path.join(process.cwd(), 'public', project.imageUrl)

        // Lire le fichier
        const fileBuffer = await readFile(localPath)

        // Extraire le nom du fichier
        const fileName = path.basename(project.imageUrl)

        // Déterminer le type MIME
        const extension = path.extname(fileName).toLowerCase()
        const mimeTypes: Record<string, string> = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
        }
        const contentType = mimeTypes[extension] || 'image/jpeg'

        // Upload vers Vercel Blob
        const blob = await put(fileName, fileBuffer, {
          access: 'public',
          contentType,
        })

        // Mettre à jour la base de données
        await prisma.project.update({
          where: { id: project.id },
          data: { imageUrl: blob.url },
        })

        console.log(`✅ Success: ${fileName} -> ${blob.url}\n`)
        successCount++
      } catch (error) {
        console.error(`❌ Error migrating ${project.imageUrl}:`, error)
        errorCount++
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✨ Migration completed!`)
    console.log(`   ✅ Success: ${successCount}`)
    console.log(`   ❌ Errors: ${errorCount}`)
    console.log('='.repeat(50))
  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la migration
migrateImages()