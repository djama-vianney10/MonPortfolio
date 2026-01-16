// 2. CRÉER: scripts/list-local-images.ts (VÉRIFICATION)
// ========================================
import { PrismaClient } from '@prisma/client'
import { access } from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

async function listLocalImages() {
  console.log('🔍 Checking local images...\n')

  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        imageUrl: true,
      },
    })

    console.log(`📦 Total projects: ${projects.length}\n`)

    const localImages = []
    const externalImages = []
    const missingImages = []

    for (const project of projects) {
      if (project.imageUrl.startsWith('/uploads/')) {
        const localPath = path.join(process.cwd(), 'public', project.imageUrl)
        
        try {
          await access(localPath)
          localImages.push({
            title: project.title,
            path: project.imageUrl,
          })
        } catch {
          missingImages.push({
            title: project.title,
            path: project.imageUrl,
          })
        }
      } else {
        externalImages.push({
          title: project.title,
          url: project.imageUrl,
        })
      }
    }

    console.log('📊 Results:')
    console.log(`   🖼️  Local images: ${localImages.length}`)
    console.log(`   🌐 External images: ${externalImages.length}`)
    console.log(`   ⚠️  Missing images: ${missingImages.length}`)

    if (localImages.length > 0) {
      console.log('\n📁 Local images to migrate:')
      localImages.forEach((img) => {
        console.log(`   - ${img.title}: ${img.path}`)
      })
    }

    if (missingImages.length > 0) {
      console.log('\n⚠️  Missing images (files not found):')
      missingImages.forEach((img) => {
        console.log(`   - ${img.title}: ${img.path}`)
      })
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listLocalImages()