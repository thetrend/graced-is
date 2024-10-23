import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | null = null

const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

export default getPrismaClient
