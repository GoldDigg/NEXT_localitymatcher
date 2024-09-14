import React from 'react';

const SearchResults = ({ results, searchType, onItemClick }) => {
  if (results.length === 0) {
    return <p>Inga resultat hittades.</p>;
  }

  return (
    <div className="search-results">
      <h3>{searchType === 'company' ? 'Företag' : 'Lokaler'}</h3>
      <div className="list-table-container">
        <table>
          <thead>
            <tr>
              {searchType === 'company' ? (
                <>
                  <th>Namn</th>
                  <th>Org.nummer</th>
                </>
              ) : (
                <>
                  <th>Adress</th>
                  <th>Område</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr key={item.id} onClick={() => onItemClick(item)}>
                {searchType === 'company' ? (
                  <>
                    <td>{item.name}</td>
                    <td>{item.orgNumber}</td>
                  </>
                ) : (
                  <>
                    <td>{item.address}</td>
                    <td>{item.area}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchResults;
