import React, { useCallback } from 'react';

const MatchDetailsModal = ({ match, onClose }) => {
  if (!match) return null;

  const { company, property, score } = match;

  const calculateScoreDetails = (company, property) => {
    let details = {
      area: 0,
      size: 0,
      rent: 0,
      features: 0,
      availability: 0
    };

    // Area match
    if (company.desiredAreas.includes(property.area)) {
      details.area = 20;
    }

    // Size match
    if (property.size >= company.desiredSizeMin && property.size <= company.desiredSizeMax) {
      details.size = 20;
    }

    // Rent match
    if (property.rent <= company.desiredMaxRent) {
      details.rent = 20;
    }

    // Features match
    const matchingFeatures = property.features.filter(feature => company.desiredFeatures.includes(feature));
    details.features = (matchingFeatures.length / company.desiredFeatures.length) * 30;

    // Availability match
    if (new Date(property.availableFrom) <= new Date(company.contractEndDate)) {
      details.availability = 10;
    }

    return details;
  };

  const scoreDetails = calculateScoreDetails(company, property);

  const ComparisonRow = ({ label, companyValue, propertyValue, score, maxScore }) => (
    <div className="comparison-row">
      <div className="comparison-label">{label}</div>
      <div className="comparison-company">{companyValue}</div>
      <div className="comparison-property">{propertyValue}</div>
      <div className="comparison-score">
        <span className="score-value">{Number.isInteger(score) ? score : score.toFixed(2)}</span>
        <span className="max-score"> / {maxScore} poäng</span>
      </div>
    </div>
  );

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2>Matchningsdetaljer</h2>
        <div className="match-details">
          <div className="company-details">
            <h3>Företag: {company.name}</h3>
            <p><strong>Org.nummer:</strong> {company.orgNumber}</p>
          </div>
          <div className="property-details">
            <h3>Lokal: {property.address}</h3>
            <p><strong>Fastighetsägare:</strong> {property.propertyOwner}</p>
          </div>
        </div>
        <div className="comparison-container">
          <div className="comparison-header">
            <div>Kriterium</div>
            <div>Företagets önskemål</div>
            <div>Lokalens egenskaper</div>
            <div className="comparison-score">
              <span className="score-value">Poäng</span>
            </div>
          </div>
          <ComparisonRow 
            label="Område" 
            companyValue={company.desiredAreas.join(', ')}
            propertyValue={property.area}
            score={scoreDetails.area}
            maxScore={20}
          />
          <ComparisonRow 
            label="Storlek" 
            companyValue={`${company.desiredSizeMin} - ${company.desiredSizeMax} kvm`}
            propertyValue={`${property.size} kvm`}
            score={scoreDetails.size}
            maxScore={20}
          />
          <ComparisonRow 
            label="Hyra" 
            companyValue={`Max ${company.desiredMaxRent} kr/kvm/år`}
            propertyValue={`${property.rent} kr/kvm/år`}
            score={scoreDetails.rent}
            maxScore={20}
          />
          <ComparisonRow 
            label="Egenskaper" 
            companyValue={company.desiredFeatures.join(', ')}
            propertyValue={property.features.join(', ')}
            score={Math.round(scoreDetails.features)}  // Avrunda till närmaste heltal
            maxScore={30}
          />
          <ComparisonRow 
            label="Tillgänglighet" 
            companyValue={`Önskat före ${new Date(company.contractEndDate).toLocaleDateString()}`}
            propertyValue={`Tillgänglig från ${new Date(property.availableFrom).toLocaleDateString()}`}
            score={scoreDetails.availability}
            maxScore={10}
          />
        </div>
        <div className="total-score">
          <strong>Total poäng: </strong> 
          <span className="score-value">{Math.round(score)}</span>
          <span className="max-score"> / 100</span>
        </div>
        <button onClick={onClose}>Stäng</button>
      </div>
    </div>
  );
};

export default MatchDetailsModal;
