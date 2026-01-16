// 3. CRÉER: scripts/migrate-images-safe.ts (VERSION SÉCURISÉE)
// ========================================
import { PrismaClient } from '@prisma/client'
import { put } from '@vercel/blob'
import { readFile } from 'fs/promises'
import path from 'path'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve))
}

async function migrateImagesSafe() {
  console.log('🔐 Safe Image Migration to Vercel Blob\n')

  try {
    // 1. Récupérer les projets avec images locales
    const projects = await prisma.project.findMany({
      where: {
        imageUrl: {
          startsWith: '/uploads/',
        },
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
      },
    })

    if (projects.length === 0) {
      console.log('✅ No local images found. All images are already migrated!')
      return
    }

    console.log(`📦 Found ${projects.length} projects with local images:\n`)
    projects.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title}: ${p.imageUrl}`)
    })

    // 2. Demander confirmation
    console.log('\n⚠️  This will:')
    console.log('   1. Upload images to Vercel Blob')
    console.log('   2. Update database URLs')
    console.log('   3. Keep original files in /public/uploads (as backup)\n')

    const confirm = await question('Do you want to proceed? (yes/no): ')

    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ Migration cancelled')
      return
    }

    console.log('\n🚀 Starting migration...\n')

    let successCount = 0
    let errorCount = 0
    const errors: Array<{ project: string; error: string }> = []

    // 3. Migrer chaque image
    for (const project of projects) {
      try {
        console.log(`\n📤 Migrating: ${project.title}`)
        console.log(`   Local: ${project.imageUrl}`)

        const localPath = path.join(process.cwd(), 'public', project.imageUrl)
        const fileBuffer = await readFile(localPath)
        const fileName = path.basename(project.imageUrl)

        const extension = path.extname(fileName).toLowerCase()
        const mimeTypes: Record<string, string> = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.jfif': 'image/jpeg',
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

        console.log(`   ✅ New URL: ${blob.url}`)
        successCount++
      } catch (error) {
        console.error(`   ❌ Error: ${error}`)
        errors.push({
          project: project.title,
          error: error instanceof Error ? error.message : String(error),
        })
        errorCount++
      }
    }

    // 4. Résumé
    console.log('\n' + '='.repeat(60))
    console.log('✨ Migration Summary:')
    console.log('='.repeat(60))
    console.log(`Total projects:     ${projects.length}`)
    console.log(`✅ Successful:       ${successCount}`)
    console.log(`❌ Errors:           ${errorCount}`)

    if (errors.length > 0) {
      console.log('\n⚠️  Failed migrations:')
      errors.forEach((e) => {
        console.log(`   - ${e.project}: ${e.error}`)
      })
    }

    console.log('\n💡 Next steps:')
    console.log('   1. Test your site to verify images display correctly')
    console.log('   2. If all good, you can delete /public/uploads folder')
    console.log('   3. Commit and push your changes')
    console.log('='.repeat(60))
  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

migrateImagesSafe()