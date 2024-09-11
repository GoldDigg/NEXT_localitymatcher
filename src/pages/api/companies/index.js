import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
	if (req.method === 'GET') {
		await getCompanies(req, res)
	} else if (req.method === 'POST') {
		await addCompany(req, res)
	} else {
		res.setHeader('Allow', ['GET', 'POST'])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}

async function getCompanies(req, res) {
	try {
		const companies = await prisma.company.findMany()
		res.status(200).json(companies)
	} catch (error) {
		console.error('Error fetching companies:', error)
		res.status(500).json({ error: 'Failed to fetch companies' })
	}
}

async function addCompany(req, res) {
	try {
		const companyData = req.body
		console.log('Received company data:', JSON.stringify(companyData, null, 2))
		
		const processedData = {
			...companyData,
			size: companyData.size ? parseFloat(companyData.size) : null,
			rent: companyData.rent ? parseFloat(companyData.rent) : null,
			desiredSizeMin: companyData.desiredSizeMin ? parseFloat(companyData.desiredSizeMin) : null,
			desiredSizeMax: companyData.desiredSizeMax ? parseFloat(companyData.desiredSizeMax) : null,
			desiredMaxRent: companyData.desiredMaxRent ? parseFloat(companyData.desiredMaxRent) : null,
			contractEndDate: companyData.contractEndDate ? new Date(companyData.contractEndDate) : null,
			features: Array.isArray(companyData.features) ? companyData.features.filter(Boolean) : [],
			desiredAreas: Array.isArray(companyData.desiredAreas) ? companyData.desiredAreas.filter(Boolean) : [],
			desiredFeatures: Array.isArray(companyData.desiredFeatures) ? companyData.desiredFeatures.filter(Boolean) : []
		}

		console.log('Processed company data:', processedData)

		const newCompany = await prisma.company.create({
			data: processedData
		})

		console.log('Created new company:', newCompany)
		res.status(201).json(newCompany)
	} catch (error) {
		console.error('Error creating company:', error)
		res.status(500).json({ error: 'Failed to create company', details: error.message })
	}
}
