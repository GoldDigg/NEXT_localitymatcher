import { NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma'; // Justera sökvägen här

// POST /api/tags
export async function POST(request) {
    const { type, tag } = await request.json(); // type kan vara 'egenskap' eller 'area'
    
    if (!type || !tag) {
        return NextResponse.json({ message: 'Type and tag are required' }, { status: 400 });
    }

    try {
        const newTag = await prisma.tag.create({ // Skapa en ny tagg
            data: {
                type,
                name: tag,
            },
        });
        return NextResponse.json(newTag, { status: 201 });
    } catch (error) {
        console.error('Error saving tag:', error);
        return NextResponse.json({ message: 'Error saving tag', details: error.message }, { status: 500 });
    }
}

// GET /api/tags
export async function GET() {
    try {
        const tags = await prisma.tag.findMany(); // Se till att alla taggar returnerar med sina ID:n
        return NextResponse.json(tags);
    } catch (error) {
        console.error('Error fetching tags:', error);
        return NextResponse.json({ message: 'Error fetching tags' }, { status: 500 });
    }
}
