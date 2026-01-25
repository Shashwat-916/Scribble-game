import { PrismaClient } from "./generated/prisma/client.js"
export * from "./generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"
import { DATABASE_URL } from "@repo/env/common"


const adapter = new PrismaPg({
    connectionString: DATABASE_URL,
})

console.log("DATABASE_URL:  ", DATABASE_URL)

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient({
    adapter,
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma