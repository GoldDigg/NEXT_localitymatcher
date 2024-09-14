import { faker } from '@faker-js/faker';

const areas = ['Centrum', 'Väster', 'Öster', 'Söder', 'Norr', 'Industriområdet', 'Hamnen'];
const features = ['Parkering', 'Fiber', 'Konferensrum', 'Lunchrum', 'Gym', 'Lager', 'Lastbrygga', 'Hiss', 'Handikappanpassat'];

export function generateFakeCompany() {
  const desiredAreas = faker.helpers.arrayElements(areas, { min: 1, max: 3 });
  const desiredFeatures = faker.helpers.arrayElements(features, { min: 2, max: 5 });
  const desiredSizeMin = faker.number.int({ min: 50, max: 500 });
  const desiredSizeMax = desiredSizeMin + faker.number.int({ min: 50, max: 500 });

  return {
    name: faker.company.name(),
    orgNumber: faker.number.int({ min: 100000, max: 999999 }) + '-' + faker.number.int({ min: 1000, max: 9999 }),
    streetAddress: faker.location.streetAddress(),
    area: faker.helpers.arrayElement(areas),
    size: faker.number.int({ min: 50, max: 1000 }),
    rent: faker.number.int({ min: 500, max: 2000 }),
    features: faker.helpers.arrayElements(features, { min: 1, max: 4 }),
    contractEndDate: faker.date.future().toISOString(),
    desiredAreas,
    desiredSizeMin,
    desiredSizeMax,
    desiredMaxRent: faker.number.int({ min: 600, max: 2500 }),
    desiredFeatures,
  };
}

export function generateFakeProperty() {
  return {
    address: faker.location.streetAddress(),
    size: faker.number.int({ min: 50, max: 1000 }),
    area: faker.helpers.arrayElement(areas),
    features: faker.helpers.arrayElements(features, { min: 1, max: 6 }),
    rent: faker.number.int({ min: 500, max: 2000 }),
    availableFrom: faker.date.future().toISOString(),
    propertyOwner: faker.company.name(),
  };
}
