import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orgNumber = searchParams.get('orgNumber');

  console.log('Checking org number:', orgNumber);

  try {
    const company = await prisma.company.findUnique({
      where: { orgNumber: orgNumber }
    });

    console.log('Company found:', company);

    return NextResponse.json({ exists: !!company });
  } catch (error) {
    console.error('Error checking org number:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
