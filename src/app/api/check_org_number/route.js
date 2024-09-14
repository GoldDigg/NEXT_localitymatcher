import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orgNumber = searchParams.get('orgNumber');

  if (!orgNumber) {
    return NextResponse.json({ error: 'Org number is required' }, { status: 400 });
  }

  try {
    const company = await prisma.company.findUnique({
      where: { orgNumber: orgNumber }
    });

    return NextResponse.json({ exists: !!company });
  } catch (error) {
    console.error('Error checking org number:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
