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
    backgroundColor: 'lightgray',
  };

  const getStatusStyle = (value) => {
    if (value < 10) return { backgroundColor: '#E7844E' };
    if (value >= 10 && value < 20) return { backgroundColor: '#ECC85B' };
    if (value >= 20) return { backgroundColor: '#83C968' };
    return {}; // default style
  };

  const findMoistureValue = (queryType) => {
    const moisture = moistureValues.find(item => item.queryType === queryType);
    return moisture ? moisture.value : null;
  };

  return (
    <table className=""
      style={{
        width: '100%',
        height: '100%',
        color: '#18204F',
        borderCollapse: 'collapse',
        borderRadius: "0.75rem", // Equivalent to Bootstrap's rounded-3

        overflow: 'hidden'
      }}
    >
      <thead>
      <tr style={{ backgroundImage: "linear-gradient(0deg, #1A2146 0%, #1F2C61 100%)", color: "white" }}>
      <th
          style={{
            padding: "10px",
            fontSize: "1.1em",
            textAlign: "left",
          }}
        >
            Name
          </th>
          <th className="text-center"
            style={{
              padding: '2px',
            }}
          >
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={index}
            onClick={() => onRowClick(item.queryType)}
            style={{
              ...rowStyle,
              backgroundColor: index % 2 === 0 ? '#F8F9FA' : '#fff', // Alternating row colors
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = rowHoverStyle.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#F8F9FA' : '#fff')
            }
          >
            <td
              style={{
                borderBottom: '1px solid #FFFFFF',
                padding: '5px',
              }}
            >
              {item.name}
            </td>
            <td
              style={{
                borderBottom: '1px solid #FFFFFF',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  ...getStatusStyle(findMoistureValue(item.queryType)),
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                }}
              ></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HochbeetTable;
