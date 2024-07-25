import React from 'react';

const HochbeetTable = ({ onRowClick, moistureValues }) => {
  const data = [
    { name: 'Wachstnix', queryType: 'hochbeet_moisture1' },
    { name: 'Shoppingqueen', queryType: 'moisture_dragino_2' },
    { name: 'Kompostplatz 1', queryType: 'moisture_dragino_3' },
    { name: 'Übersee', queryType: 'moisture_dragino_4' },
    { name: 'Beethoven', queryType: 'moisture_dragino_5' },
    { name: 'Kohlarabi', queryType: 'moisture_dragino_6' },
  ];

  const rowStyle = {
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const rowHoverStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  };

  const getStatusStyle = (value) => {
    if (value < 10) return { backgroundColor: 'red' };
    if (value >= 10 && value < 20) return { backgroundColor: 'yellow' };
    if (value >= 20) return { backgroundColor: 'green' };
    return {}; // default style
  };

  const findMoistureValue = (queryType) => {
    const moisture = moistureValues.find(item => item.queryType === queryType);
    return moisture ? moisture.value : null;
  };

  return (
    <table style={{ width: '100%', height: "100%", color: '#FFFFFF', borderCollapse: 'collapse' }}>
      <thead >
        <tr >
          <th style={{ borderBottom: '1px solid #FFFFFF', borderRight: '1px solid #FFFFFF', padding: '8px' }}>Name</th>
          <th style={{ borderBottom: '1px solid #FFFFFF', padding: '8px' }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={index}
            onClick={() => onRowClick(item.queryType)}
            style={rowStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rowHoverStyle.backgroundColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
          >
            <td style={{ borderBottom: '1px solid #FFFFFF', borderRight: '1px solid #FFFFFF', padding: '8px' }}>{item.name}</td>
            <td style={{ borderBottom: '1px solid #FFFFFF', padding: '8px', textAlign: 'center' }}>
              <div style={{ ...getStatusStyle(findMoistureValue(item.queryType)), width: '20px', height: '20px', borderRadius: '50%', display: 'inline-block' }}></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HochbeetTable;
