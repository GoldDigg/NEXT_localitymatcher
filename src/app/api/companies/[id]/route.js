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
    // Validera indata
    if (!updatedData.name || !updatedData.orgNumber) {
      return NextResponse.json({ error: 'Name and orgNumber are required' }, { status: 400 });
    }

    const updatedCompany = await prisma.company.update({
      where: { id: parseInt(id) },
      data: {
        name: updatedData.name,
        orgNumber: updatedData.orgNumber,
        streetAddress: updatedData.streetAddress,
        area: updatedData.area,
        size: updatedData.size !== undefined ? parseFloat(updatedData.size) : undefined,
        rent: updatedData.rent !== undefined ? parseFloat(updatedData.rent) : undefined,
        features: updatedData.features || undefined,
        contractEndDate: updatedData.contractEndDate,
        desiredAreas: updatedData.desiredAreas || undefined,
        desiredSizeMin: updatedData.desiredSizeMin !== undefined ? parseFloat(updatedData.desiredSizeMin) : undefined,
        desiredSizeMax: updatedData.desiredSizeMax !== undefined ? parseFloat(updatedData.desiredSizeMax) : undefined,
        desiredMaxRent: updatedData.desiredMaxRent !== undefined ? parseFloat(updatedData.desiredMaxRent) : undefined,
        desiredFeatures: updatedData.desiredFeatures || undefined,
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
