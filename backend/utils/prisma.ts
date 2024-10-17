import { PrismaClient } from '@prisma/client'

// Create a singleton instance of the PrismaClient
let prisma: PrismaClient | null = null

const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

export default getPrismaClient
