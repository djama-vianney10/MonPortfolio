// 2. CRÉER: src/lib/prisma-retry.ts - UTILITAIRE DE RETRY
// ========================================
import { Prisma } from '@prisma/client'

interface RetryOptions {
  maxRetries?: number
  retryDelay?: number
}

export async function prismaRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, retryDelay = 1000 } = options
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      // Vérifier si c'est une erreur de connexion
      const isConnectionError = 
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === 'P1001' || // Can't reach database server
         error.code === 'P1002' || // Connection timed out
         error.code === 'P1008' || // Operations timed out
         error.code === 'P1017')   // Server has closed the connection

      if (!isConnectionError || attempt === maxRetries) {
        throw error
      }

      // Attendre avant de réessayer (backoff exponentiel)
      const delay = retryDelay * Math.pow(2, attempt - 1)
      console.log(`Database connection failed. Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}