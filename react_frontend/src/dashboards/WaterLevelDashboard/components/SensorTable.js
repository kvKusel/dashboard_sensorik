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
  lastValueLohnweiler1,
  lastValueHinzweiler1,
  lastValueUntersulzbach,
  lastValueLohnweilerRLP,
  setHoveredMarkerId,
  setSelectedMarkerId,
  onSelectPosition,
    selectedRow,
      hoveredMarkerId, 

}) => {
  // Helper function to determine sensor status color based on timestamp
  const getSensorStatusColor = (timestamp) => {
    if (!timestamp) return "#E7844E"; // Red if no timestamp
    
    const now = new Date();
    const sensorTime = new Date(timestamp);
    const timeDifferenceMs = now - sensorTime;
    const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);
    
    if (timeDifferenceHours < 2) {
      return "#83C968"; // Green - less than 2 hours
    } else if (timeDifferenceHours < 24) {
      return "#ECC85B"; // Yellow - between 2 hours and 1 day
    } else {
      return "#E7844E"; // Red - more than 1 day
    }
  };

  const data = [
    {
      id: "untersulzbach",
      name: "Untersulzbach",
      source: "LfU RLP",
      sourceUrl: "https://wasserportal.rlp-umwelt.de/",
      queryType: "lastValueUntersulzbach",
      position: [49.528584, 7.663114], 
      value: lastValueUntersulzbach?.value
        ? Number(lastValueUntersulzbach.value)
        : 0,
      timestamp: lastValueUntersulzbach?.time,
    },
    {
      id: "kreimbach1",
      name: "Kreimbach 1",
      queryType: "lastValueKreimbach1",
      position: [49.54844915352638, 7.631175812962766],
      value: lastValueKreimbach1?.value ? Number(lastValueKreimbach1.value) : 0,
      timestamp: lastValueKreimbach1?.time,
    },
    {
      id: "kreimbach4",
      name: "Kreimbach 3",
      queryType: "lastValueKreimbach4",
      position: [49.554087, 7.621883],
      value: lastValueKreimbach4?.value ? Number(lastValueKreimbach4.value) : 0,
      timestamp: lastValueKreimbach4?.time,
    },
    {
      id: "rutsweiler",
      name: "Rutsweiler a.d. Lauter",
      queryType: "lastValueRutsweiler",
      position: [49.566297, 7.623804],
      value: lastValueRutsweiler?.value ? Number(lastValueRutsweiler.value) : 0,
      timestamp: lastValueRutsweiler?.time,
    },
    {
      id: "wolfstein",
      name: "Wolfstein",
      queryType: "lastValueWolfstein",
      position: [49.581045, 7.619593],
      value: lastValueWolfstein?.value ? Number(lastValueWolfstein.value) : 0,
      timestamp: lastValueWolfstein?.time,
    },
    {
      id: "lohnweilerRLP",
      name: "Lohnweiler (Lauter)",
      source: "LfU RLP",
      sourceUrl: "https://wasserportal.rlp-umwelt.de/", 
      queryType: "lastValueLohnweilerRLP",
      position: [49.636245, 7.600337],
      value: lastValueLohnweilerRLP?.value
        ? Number(lastValueLohnweilerRLP.value)
        : 0,
      timestamp: lastValueLohnweilerRLP?.time,
    },
    {
      id: "lauterecken",
      name: "Lauterecken",
      queryType: "lastValueLauterecken1",
      position: [49.650507589739846, 7.590545488872102],
      value: lastValueLauterecken1?.value
        ? Number(lastValueLauterecken1.value)
        : 0,
      timestamp: lastValueLauterecken1?.time,
    },
    {
      id: "kreimbach3",
      name: "Kreimbach 2 (Kreimbach)",
      queryType: "lastValueKreimbach3",
      position: [49.556388641429436, 7.636587365546659],
      value: lastValueKreimbach3?.value ? Number(lastValueKreimbach3.value) : 0,
      timestamp: lastValueKreimbach3?.time,
    },
    {
      id: "lohnweiler1",
      name: "Lohnweiler (Mausbach)",
      queryType: "lastValueLohnweiler1",
      position: [49.63553061963123, 7.59709411130715],
      value: lastValueLohnweiler1?.value
        ? Number(lastValueLohnweiler1.value)
        : 0,
      timestamp: lastValueLohnweiler1?.time,
    },
    {
      id: "kusel",
      name: "Kusel (Kuselbach)",
      queryType: "lastValueKreisverwaltung",
      position: [49.539820952844316, 7.396752597634942], 
      value: lastValueKreisverwaltung?.value
        ? Number(lastValueKreisverwaltung.value)
        : 0,
      timestamp: lastValueKreisverwaltung?.time,
    },
    {
      id: "hinzweiler1",
      name: "Hinzweiler (Talbach)",
      queryType: "lastValueHinzweiler1",
      position: [49.589414954381816, 7.548317327514346],
      value: lastValueHinzweiler1?.value
        ? Number(lastValueHinzweiler1.value)
        : 0,
      timestamp: lastValueHinzweiler1?.time,
    },
  ];

  const rowStyle = {
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const rowHoverStyle = {
    backgroundColor: "lightgray", // Hover background color
  };

  return (
    <table
      className="rounded-3"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "0.75rem", // Equivalent to Bootstrap's rounded-3
        overflow: "hidden", // Ensures child elements respect the border radius
      }}
    >
      <thead>
        <tr
          style={{
            backgroundImage: "linear-gradient(0deg, #1A2146 0%, #1F2C61 100%)",
            color: "white",
          }}
        >
          <th className="responsive-th" style={{ padding: "10px", textAlign: "left" }}>Pegel</th>
                    <th className="responsive-th" style={{ padding: "10px", textAlign: "center" }}>Sensorstatus</th>

          <th className="responsive-th" style={{ padding: "10px", textAlign: "center" }}>Wasserstand</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan="3" style={{ textAlign: "center", padding: "10px", fontWeight: "bold", backgroundColor: "#EFEFEF" }}>
            Lauter:
          </td>
        </tr>

        {data.map((item, index) => (
          <React.Fragment key={item.id}>
            <tr
              onClick={() => {
                onRowClick(item.queryType);
                onSelectPosition(item.position);
                setSelectedMarkerId(item.id);
              }}
onMouseEnter={() => setHoveredMarkerId(item.id)}
onMouseLeave={() => setHoveredMarkerId(null)}

              id={item.id}
style={{
  ...rowStyle,
  backgroundColor:
    item.queryType === selectedRow
      ? "#D0E3FF"
      : hoveredMarkerId === item.id
        ? "#E0E0E0" // gray hover
        : index % 2 === 0
          ? "#F8F9FA"
          : "#fff",
  fontWeight: item.queryType === selectedRow ? "bold" : "normal",
  border: item.queryType === selectedRow ? "2px solid #1F2C61" : "none",
}}

            >
              <td className="responsive-fs-text" style={{ paddingLeft: "5px" }}>
                {item.name}
                {item.source && item.sourceUrl && (
                  <>
                    {" "}
                    <span style={{ fontSize: "0.75rem", color: "#555" }}>
                      [
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#555", textDecoration: "underline" }}
                      >
                        Quelle: {item.source}
                      </a>
                      ]
                    </span>
                  </>
                )}
              </td>

              <td style={{ padding: "10px", textAlign: "center" }}>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    display: "inline-block",
                    backgroundColor: getSensorStatusColor(item.timestamp),
                  }}
                ></div>
              </td>

                            <td style={{ padding: "10px", textAlign: "center" }}>
                {(() => {
                  if (!item.timestamp) return <span style={{ fontSize: "20px", fontWeight: "bold" }}>-</span>;
                  
                  const now = new Date();
                  const sensorTime = new Date(item.timestamp);
                  const timeDifferenceHours = (now - sensorTime) / (1000 * 60 * 60);
                  
                  if (timeDifferenceHours > 2) {
                    return <span style={{ fontSize: "20px", fontWeight: "bold" }}>-</span>;
                  }
                  
                  return (
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        display: "inline-block",
                        backgroundColor:
                          item.value < 200 ? "#83C968" : item.value <= 250 ? "#ECC85B" : "#E7844E",
                      }}
                    ></div>
                  );
                })()}
              </td>
            </tr>

            {/* Insert second label row after the 3rd item */}
            {index === 6 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "10px", fontWeight: "bold", backgroundColor: "#EFEFEF" }}>
                  Lauter - Nebenflüsse:
                </td>
              </tr>
            )}

            {/* {index === 8 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "10px", fontWeight: "bold", backgroundColor: "#EFEFEF" }}>
                  Glan:
                </td>
              </tr>
            )} */}

            {index === 8 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "10px", fontWeight: "bold", backgroundColor: "#EFEFEF" }}>
                  Glan - Nebenflüsse:
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default SensorTable;