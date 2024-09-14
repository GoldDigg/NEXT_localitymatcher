export function calculateMatchScore(company, property) {
  let score = 0;

  // Område match
  if (company.desiredAreas.includes(property.area)) {
    score += 20;
  }

  // Storlek match
  if (property.size >= company.desiredSizeMin && property.size <= company.desiredSizeMax) {
    score += 20;
  }

  // Hyra match
  if (property.rent <= company.desiredMaxRent) {
    score += 20;
  }

  // Features match
  const matchingFeatures = property.features.filter(feature => company.desiredFeatures.includes(feature));
  score += (matchingFeatures.length / company.desiredFeatures.length) * 30;

  // Tillgänglighet match
  if (new Date(property.availableFrom) <= new Date(company.contractEndDate)) {
    score += 10;
  }

  return Math.min(score, 100); // Ensure score doesn't exceed 100
}
