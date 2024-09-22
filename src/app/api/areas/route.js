import { NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma'; // Justera sökvägen här

// POST /api/areas
export async function POST(request) {
    const { name, type } = await request.json(); // type kan vara 'area'

    if (!name || !type) {
        return NextResponse.json({ message: 'Name and type are required' }, { status: 400 });
    }

    try {
        const newArea = await prisma.area.create({ // Skapa ett nytt område
            data: {
                name,
                type,
            },
        });
        console.log('New area created:', newArea);
        return NextResponse.json(newArea, { status: 201 });
    } catch (error) {
        console.error('Error saving area:', error);
        return NextResponse.json({ message: 'Error saving area', details: error.message }, { status: 500 });
    }
}

// GET /api/areas
export async function GET() {
    try {
        const areas = await prisma.area.findMany(); // Hämta alla områden
        return NextResponse.json(areas);
    } catch (error) {
        console.error('Error fetching areas:', error);
        return NextResponse.json({ message: 'Error fetching areas' }, { status: 500 });
    }
}
