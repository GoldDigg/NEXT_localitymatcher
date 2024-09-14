import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

function generateRandomCompany() {
    return {
        name: faker.company.name(),
        orgNumber: faker.string.numeric(10),
        streetAddress: faker.location.streetAddress(),
        area: faker.location.city(),
        size: faker.number.int({ min: 50, max: 1000 }),
        rent: faker.number.int({ min: 500, max: 2000 }),
        features: [faker.word.adjective(), faker.word.adjective()],
        contractEndDate: faker.date.future(),
        desiredAreas: [faker.location.city(), faker.location.city()],
        desiredSizeMin: faker.number.int({ min: 50, max: 500 }),
        desiredSizeMax: faker.number.int({ min: 501, max: 1000 }),
        desiredMaxRent: faker.number.int({ min: 500, max: 2000 }),
        desiredFeatures: [faker.word.adjective(), faker.word.adjective()],
    };
}

function generateRandomProperty() {
    return {
        address: faker.location.streetAddress(),
        size: faker.number.int({ min: 50, max: 1000 }),
        area: faker.location.city(),
        features: [faker.word.adjective(), faker.word.adjective()],
        rent: faker.number.int({ min: 500, max: 2000 }),
        availableFrom: faker.date.future(),
        propertyOwner: faker.company.name(),
    };
}

export async function POST() {
    try {
        // Rensa befintlig data
        await prisma.company.deleteMany();
        await prisma.property.deleteMany();

        // Generera och spara 50 företag
        const companies = Array.from({ length: 50 }, generateRandomCompany);
        await prisma.company.createMany({ data: companies });

        // Generera och spara 50 fastigheter
        const properties = Array.from({ length: 50 }, generateRandomProperty);
        await prisma.property.createMany({ data: properties });

        return NextResponse.json({ message: 'Data generated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
