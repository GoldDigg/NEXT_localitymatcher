import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const companies = await prisma.company.findMany()
      res.status(200).json(companies)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch companies' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function getCompanies(req: NextApiRequest, res: NextApiResponse) {
  try {
    const companies = await prisma.company.findMany()
    res.status(200).json(companies)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching companies' })
  }
}

async function addCompany(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body
    const newCompany = await prisma.company.create({
      data: {
        name: data.name,
        orgNumber: data.orgNumber,
        streetAddress: data.streetAddress,
        area: data.area,
        size: data.size ? parseFloat(data.size) : null,
        rent: data.rent ? parseFloat(data.rent) : null,
        features: data.features || [],
        contractEndDate: data.contractEndDate ? new Date(data.contractEndDate) : null,
        desiredAreas: data.desiredAreas || [],
        desiredSizeMin: data.desiredSizeMin ? parseFloat(data.desiredSizeMin) : null,
        desiredSizeMax: data.desiredSizeMax ? parseFloat(data.desiredSizeMax) : null,
        desiredMaxRent: data.desiredMaxRent ? parseFloat(data.desiredMaxRent) : null,
        desiredFeatures: data.desiredFeatures || []
      }
    })
    res.status(201).json(newCompany)
  } catch (error) {
    res.status(500).json({ error: 'Error adding company' })
  }
}
