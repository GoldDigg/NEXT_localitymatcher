import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      console.log(`Attempting to fetch company with id: ${id}`);
      const company = await prisma.company.findUnique({
        where: { id: parseInt(id) }
      });

      if (!company) {
        console.log(`Company with id ${id} not found`);
        return res.status(404).json({ error: 'Company not found' })
      }

      console.log('Fetched company:', company);

      // I GET-metoden
      if (company.features && !Array.isArray(company.features)) {
        company.features = company.features.split(',').map(item => item.trim());
      }
      if (company.desiredAreas && !Array.isArray(company.desiredAreas)) {
        company.desiredAreas = company.desiredAreas.split(',').map(item => item.trim());
      }
      if (company.desiredFeatures && !Array.isArray(company.desiredFeatures)) {
        company.desiredFeatures = company.desiredFeatures.split(',').map(item => item.trim());
      }

      res.status(200).json(company)
    } catch (error) {
      console.error('Error fetching company:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedData = req.body
      console.log('Received data for update:', updatedData)

      const updatedCompany = await prisma.company.update({
        where: { id: parseInt(id) },
        data: {
          name: updatedData.name,
          orgNumber: updatedData.orgNumber,
          streetAddress: updatedData.streetAddress,
          area: updatedData.area,
          size: updatedData.size ? parseInt(updatedData.size) : null,
          rent: updatedData.rent ? parseFloat(updatedData.rent) : null,
          features: Array.isArray(updatedData.features) ? updatedData.features : [],
          contractEndDate: updatedData.contractEndDate ? new Date(updatedData.contractEndDate) : null,
          desiredAreas: Array.isArray(updatedData.desiredAreas) ? updatedData.desiredAreas : [],
          desiredSizeMin: updatedData.desiredSizeMin ? parseInt(updatedData.desiredSizeMin) : null,
          desiredSizeMax: updatedData.desiredSizeMax ? parseInt(updatedData.desiredSizeMax) : null,
          desiredMaxRent: updatedData.desiredMaxRent ? parseFloat(updatedData.desiredMaxRent) : null,
          desiredFeatures: Array.isArray(updatedData.desiredFeatures) ? updatedData.desiredFeatures : [],
        },
      })

      console.log('Updated company:', updatedCompany)
      res.status(200).json(updatedCompany)
    } catch (error) {
      console.error('Error updating company:', error)
      res.status(500).json({ error: 'Error updating company', details: error.message })
    }
  } else if (req.method === 'DELETE') {
    try {
      console.log(`Attempting to delete company with id: ${id}`);
      const deletedCompany = await prisma.company.delete({
        where: { id: parseInt(id) }
      });

      console.log('Deleted company:', deletedCompany);
      res.status(200).json({ message: 'Company deleted successfully', company: deletedCompany })
    } catch (error) {
      console.error('Error deleting company:', error);
      res.status(500).json({ error: 'Error deleting company', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
