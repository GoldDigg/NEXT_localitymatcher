import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { orgNumber } = req.query

  try {
    const company = await prisma.company.findUnique({
      where: { orgNumber: orgNumber }
    })

    res.status(200).json({ exists: !!company })
  } catch (error) {
    console.error('Error checking org number:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
