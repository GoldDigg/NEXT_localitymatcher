import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  const { id } = params

  try {
    console.log(`Attempting to fetch company with id: ${id}`);
    const company = await prisma.company.findUnique({
      where: { id: parseInt(id) }
    });

    if (!company) {
      console.log(`Company with id ${id} not found`);
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    console.log('Fetched company:', company);

    // Behåll din existerande logik för att hantera features, desiredAreas, etc.
    if (company.features && !Array.isArray(company.features)) {
      company.features = company.features.split(',').map(item => item.trim());
    }
    if (company.desiredAreas && !Array.isArray(company.desiredAreas)) {
      company.desiredAreas = company.desiredAreas.split(',').map(item => item.trim());
    }
    if (company.desiredFeatures && !Array.isArray(company.desiredFeatures)) {
      company.desiredFeatures = company.desiredFeatures.split(',').map(item => item.trim());
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params
  const updatedData = await request.json()
  console.log('Received data for update:', updatedData)

  try {
    const updatedCompany = await prisma.company.update({
      where: { id: parseInt(id) },
      data: {
        name: updatedData.name,
        orgNumber: updatedData.orgNumber,
        streetAddress: updatedData.streetAddress,
        area: updatedData.area,
        size: updatedData.size,
        rent: updatedData.rent,
        features: updatedData.features,
        contractEndDate: updatedData.contractEndDate,
        desiredAreas: updatedData.desiredAreas,
        desiredSizeMin: updatedData.desiredSizeMin,
        desiredSizeMax: updatedData.desiredSizeMax,
        desiredMaxRent: updatedData.desiredMaxRent,
        desiredFeatures: updatedData.desiredFeatures,
      },
    })

    console.log('Updated company:', updatedCompany)
    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error('Error updating company:', error)
    return NextResponse.json({ error: 'Error updating company', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params

  try {
    console.log(`Attempting to delete company with id: ${id}`);
    const deletedCompany = await prisma.company.delete({
      where: { id: parseInt(id) }
    });

    console.log('Deleted company:', deletedCompany);
    return NextResponse.json({ message: 'Company deleted successfully', company: deletedCompany });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json({ error: 'Error deleting company', details: error.message }, { status: 500 });
  }
}
