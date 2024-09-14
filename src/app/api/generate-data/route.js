import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const areas = ['Centrum', 'Väster', 'Öster', 'Söder', 'Norr', 'Industriområdet', 'Hamnen'];
const features = ['Parkering', 'Fiber', 'Konferensrum', 'Lunchrum', 'Gym', 'Lager', 'Lastbrygga', 'Hiss', 'Handikappanpassat'];

function generateRandomCompany() {
    const desiredAreas = faker.helpers.arrayElements(areas, { min: 1, max: 3 });
    const desiredFeatures = faker.helpers.arrayElements(features, { min: 2, max: 5 });
    const desiredSizeMin = faker.number.int({ min: 50, max: 500 });
    const desiredSizeMax = faker.number.int({ min: desiredSizeMin + 1, max: 1000 });

    return {
        name: faker.company.name(),
        orgNumber: faker.string.numeric(10),
        streetAddress: faker.location.streetAddress(),
        area: faker.helpers.arrayElement(areas),
        size: faker.number.int({ min: 50, max: 1000 }),
        rent: faker.number.int({ min: 500, max: 2000 }),
        features: faker.helpers.arrayElements(features, { min: 1, max: 4 }),
        contractEndDate: faker.date.future(),
        desiredAreas,
        desiredSizeMin,
        desiredSizeMax,
        desiredMaxRent: faker.number.int({ min: 500, max: 2000 }),
        desiredFeatures,
    };
}

function generateRandomProperty() {
    return {
        address: faker.location.streetAddress(),
        size: faker.number.int({ min: 50, max: 1000 }),
        area: faker.helpers.arrayElement(areas),
        features: faker.helpers.arrayElements(features, { min: 1, max: 6 }),
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
    } finally {
        await prisma.$disconnect();
    }
}
