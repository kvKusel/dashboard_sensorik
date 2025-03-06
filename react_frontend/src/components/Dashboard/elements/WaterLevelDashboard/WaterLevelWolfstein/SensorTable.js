import React from "react";

const SensorTable = ({
  onRowClick,
  lastValueKreisverwaltung,
  lastValueKreimbach1,
  lastValueKreimbach3,
  lastValueKreimbach4,
  lastValueLauterecken1,
  lastValueRutsweiler,
  lastValueWolfstein,
}) => {

  

  
  const data = [
    { name: "Wolfstein", queryType: "lastValueWolfstein", value: lastValueWolfstein?.value ? Number(lastValueWolfstein.value) : 0 },
    { name: "Rutsweiler a.d. Lauter", queryType: "lastValueRutsweiler", value: lastValueRutsweiler?.value ? Number(lastValueRutsweiler.value) : 0 },
    { name: "Kreimbach 1", queryType: "lastValueKreimbach1", value: lastValueKreimbach1?.value ? Number(lastValueKreimbach1.value) : 0 },
    { name: "Kreimbach 3", queryType: "lastValueKreimbach3", value: lastValueKreimbach3?.value ? Number(lastValueKreimbach3.value) : 0 },
    { name: "Kreimbach 4", queryType: "lastValueKreimbach4", value: lastValueKreimbach4?.value ? Number(lastValueKreimbach4.value) : 0 },
    { name: "Lauterecken", queryType: "lastValueLauterecken1", value: lastValueLauterecken1?.value ? Number(lastValueLauterecken1.value) : 0 },
    { name: "Kusel", queryType: "lastValueKreisverwaltung", value: lastValueKreisverwaltung?.value ? Number(lastValueKreisverwaltung.value) : 0 },
  ];

  

  const rowStyle = {
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const rowHoverStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  };

  const getCircleColor = (value) => {
    if (value < 200) return "#00DFA2";
    if (value >= 200 && value <= 250) return "#F6FA70";
    return "#FF0060";
  };

  

  return (
    <table
      style={{
        width: "100%",
        height: "100%",
        color: "#FFFFFF",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th
            className="text-center"
            style={{
              borderBottom: "1px solid #FFFFFF",
              borderRight: "1px solid #FFFFFF",
              padding: "2px",
              paddingLeft: "10px",
              fontSize: "1.1em",
            }}
          >
            Pegel
          </th>
          <th
            className="text-center"
            style={{
              borderBottom: "1px solid #FFFFFF",
              padding: "2px",
              paddingLeft: "10px",
              fontSize: "1.1em",
            }}
          >
            Wasserstand
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={index}
            onClick={() => onRowClick(item.queryType)}
            style={rowStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                rowHoverStyle.backgroundColor)
            }
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
          >
            <td
              style={{
                borderBottom: "1px solid #FFFFFF",
                borderRight: "1px solid #FFFFFF",
                padding: "2px",
                paddingLeft: "10px",
              }}
            >
              {item.name}
            </td>
            <td
              style={{
                borderBottom: "1px solid #FFFFFF",
                padding: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  display: "inline-block",
                  backgroundColor: getCircleColor(item.value),
                }}
                
              ></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SensorTable;
