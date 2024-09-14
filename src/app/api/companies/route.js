import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    console.log('Attempting to fetch companies');
    try {
        const companies = await prisma.company.findMany();
        console.log('Companies fetched:', companies);
        return NextResponse.json(companies);
    } catch (error) {
        console.error('Error fetching companies:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const newCompany = await prisma.company.create({
            data: {
                name: data.name,
                orgNumber: data.orgNumber,
                streetAddress: data.streetAddress,
                area: data.area,
                size: data.size,
                rent: data.rent,
                features: data.features,
                contractEndDate: data.contractEndDate,
                desiredAreas: data.desiredAreas,
                desiredSizeMin: data.desiredSizeMin,
                desiredSizeMax: data.desiredSizeMax,
                desiredMaxRent: data.desiredMaxRent,
                desiredFeatures: data.desiredFeatures,
            },
        });
        return NextResponse.json(newCompany, { status: 201 });
    } catch (error) {
        console.error('Error creating company:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
