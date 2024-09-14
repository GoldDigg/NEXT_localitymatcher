import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const property = await prisma.property.create({
            data: {
                address: body.address,
                size: body.size,
                area: body.area,
                features: body.features,
                rent: body.rent,
                availableFrom: body.availableFrom,
                propertyOwner: body.propertyOwner,
            },
        });
        return NextResponse.json(property);
    } catch (error) {
        console.error('Error creating property:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const properties = await prisma.property.findMany();
        return NextResponse.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
