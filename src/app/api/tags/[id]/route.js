import { NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/prisma'; // Justera sökvägen till din prisma-instans

export async function GET(request, { params }) {
    const { id } = params;  // Dynamisk ruttparam
    console.log('Params:', params); // Logga params för att se vad som tas emot

    try {
        const tag = await prisma.tag.findUnique({
            where: { id: Number(id) },  // Se till att du konverterar id till Number
        });

        if (!tag) {
            return NextResponse.json({ message: 'Tag not found' }, { status: 404 });
        }

        return NextResponse.json(tag, { status: 200 });
    } catch (error) {
        console.error('Error fetching tag:', error);
        return NextResponse.json({ message: 'Error fetching tag' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    console.log('Attempting to delete tag with id:', id);

    try {
        const tagExists = await prisma.tag.findUnique({
            where: { id: Number(id) },
        });

        if (!tagExists) {
            console.log('Tag not found for id:', id);
            return NextResponse.json({ message: 'Tag not found' }, { status: 404 });
        }

        const deletedTag = await prisma.tag.delete({
            where: { id: Number(id) },
        });
        console.log('Deleted tag:', deletedTag);
        return NextResponse.json(deletedTag, { status: 200 });
    } catch (error) {
        console.error('Error deleting tag:', error);
        return NextResponse.json({ message: 'Error deleting tag' }, { status: 500 });
    }
}