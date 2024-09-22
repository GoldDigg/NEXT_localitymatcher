import { NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/prisma'; // Justera sökvägen till din prisma-instans

export async function GET(request, { params }) {
    const { id } = params;  // Dynamisk ruttparameter
    console.log('Params:', params); // Logga params för att se vad som tas emot

    try {
        const area = await prisma.area.findUnique({
            where: { id: Number(id) },  // Se till att du konverterar id till Number
        });

        if (!area) {
            return NextResponse.json({ message: 'Area not found' }, { status: 404 });
        }

        return NextResponse.json(area, { status: 200 });
    } catch (error) {
        console.error('Error fetching area:', error);
        return NextResponse.json({ message: 'Error fetching area' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    console.log('Attempting to delete area with id:', id);

    try {
        const areaExists = await prisma.area.findUnique({
            where: { id: Number(id) },
        });

        if (!areaExists) {
            console.log('Area not found for id:', id);
            return NextResponse.json({ message: 'Area not found' }, { status: 404 });
        }

        const deletedArea = await prisma.area.delete({
            where: { id: Number(id) },
        });
        console.log('Deleted area:', deletedArea);
        return NextResponse.json(deletedArea, { status: 200 });
    } catch (error) {
        console.error('Error deleting area:', error);
        return NextResponse.json({ message: 'Error deleting area' }, { status: 500 });
    }
}
