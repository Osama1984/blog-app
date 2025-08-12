import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    take: 5,
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  console.log('First 5 users created:')
  users.forEach((user, index) => {
    console.log(`${index + 1}. Email: ${user.email}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Password: password123`)
    console.log()
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
