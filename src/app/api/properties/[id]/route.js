import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
    const id = params.id;
    const data = await request.json();

    console.log('Received update request for property:', id, JSON.stringify(data, null, 2));

    try {
        if (!data.address || !data.size || !data.area || !data.rent || !data.availableFrom || !data.propertyOwner) {
            return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 });
        }

        const updatedProperty = await prisma.property.update({
            where: { id: parseInt(id) },
            data: {
                address: data.address,
                size: parseFloat(data.size),
                area: data.area,
                features: data.features || [], // Säkerställ att features alltid är en array
                rent: parseFloat(data.rent),
                availableFrom: new Date(data.availableFrom),
                propertyOwner: data.propertyOwner,
            },
        });
        console.log('Updated property in database:', JSON.stringify(updatedProperty, null, 2));
        return NextResponse.json(updatedProperty);
    } catch (error) {
        console.error('Error updating property:', error);
        return NextResponse.json({ error: 'Error updating property', details: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const id = params.id;

    try {
        await prisma.property.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        return NextResponse.json({ message: 'Error deleting property', error: error.message }, { status: 500 });
    }
}
