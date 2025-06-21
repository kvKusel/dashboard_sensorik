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
  lastValueOhmbachsee,
  lastValueNanzdietschweiler,
  lastValueRammelsbach,
  lastValueEschenau,
  lastValueSulzhof,
  lastValueOdenbachSteinbruch,
  lastValueOdenbach,
  lastValueNiedermohr,
  lastValueLoellbach,
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
    const timeDifferenceHours = (now - sensorTime) / (1000 * 60 * 60);
    if (timeDifferenceHours < 2) return "#83C968";
    if (timeDifferenceHours < 24) return "#ECC85B";
    return "#E7844E";
  };

  const createRow = (id, name, queryType, position, valueObj, source, sourceUrl) => ({
    id,
    name,
    queryType,
    position,
    value: valueObj?.value ? Number(valueObj.value) : 0,
    timestamp: valueObj?.time,
    source,
    sourceUrl,
  });

  const data = [
    createRow("untersulzbach", "Untersulzbach", "lastValueUntersulzbach", [49.528584, 7.663114], lastValueUntersulzbach, "LfU RLP", "https://wasserportal.rlp-umwelt.de/"),
    createRow("kreimbach1", "Kreimbach 1", "lastValueKreimbach1", [49.54844915352638, 7.631175812962766], lastValueKreimbach1),
    createRow("kreimbach4", "Kreimbach 3", "lastValueKreimbach4", [49.554087, 7.621883], lastValueKreimbach4),
    createRow("rutsweiler", "Rutsweiler a.d. Lauter", "lastValueRutsweiler", [49.566297, 7.623804], lastValueRutsweiler),
    createRow("wolfstein", "Wolfstein", "lastValueWolfstein", [49.581045, 7.619593], lastValueWolfstein),
    createRow("lohnweilerRLP", "Lohnweiler (Lauter)", "lastValueLohnweilerRLP", [49.636245, 7.600337], lastValueLohnweilerRLP, "LfU RLP", "https://wasserportal.rlp-umwelt.de/"),
    createRow("lauterecken", "Lauterecken", "lastValueLauterecken1", [49.650507589739846, 7.590545488872102], lastValueLauterecken1),
    createRow("kreimbach3", "Kreimbach 2 (Kreimbach)", "lastValueKreimbach3", [49.556388641429436, 7.636587365546659], lastValueKreimbach3),
    createRow("lohnweiler1", "Lohnweiler (Mausbach)", "lastValueLohnweiler1", [49.63553061963123, 7.59709411130715], lastValueLohnweiler1),
    
        createRow("nanzdietschweiler", "Nanzdietschweiler", "lastValueNanzdietschweiler", [49.445651, 7.443034], lastValueNanzdietschweiler, "LfU RLP", "https://wasserportal.rlp-umwelt.de/"),

        createRow("eschenau", "Eschenau", "lastValueEschenau", [49.599899, 7.482403], lastValueEschenau, "LfU RLP", "https://wasserportal.rlp-umwelt.de/"),
    createRow("odenbach", "Odenbach", "lastValueOdenbach", [49.688925, 7.652256], lastValueOdenbach, "LfU RLP", "https://wasserportal.rlp-umwelt.de/"),

         createRow("ohmbachsee", "Ohmbachsee (Ohmbach)", "lastValueOhmbachsee", [49.421436, 7.382018], lastValueOhmbachsee, "LfU RLP", "https://wasserportal.rlp-umwelt.de/"),
    createRow("niedermohr", "Niedermohr (Mohrbach)", "lastValueNiedermohr", [49.459274, 7.464442], lastValueNiedermohr, "LfU RLP", "https://wasserportal.rlp-umwelt.de/"),

    createRow("kusel", "Kusel (Kuselbach)", "lastValueKreisverwaltung", [49.539820952844316, 7.396752597634942], lastValueKreisverwaltung),
        createRow("rammelsbach", "Rammelsbach (Kuselbach)", "lastValueRammelsbach", [49.544549, 7.448862], lastValueRammelsbach, "LfU RLP", "https://wasserportal.rlp-umwelt.de/"),

    createRow("hinzweiler1", "Hinzweiler (Talbach)", "lastValueHinzweiler1", [49.589414954381816, 7.548317327514346], lastValueHinzweiler1),

   
    createRow("sulzhof", "Sulzhof (Sulzbach)", "lastValueSulzhof", [49.644886, 7.620666], lastValueSulzhof, "LfU RLP", "https://wasserportal.rlp-umwelt.de/"),
    createRow("odenbachSteinbruch", "Odenbach / Steinbruch (Odenbach)", "lastValueOdenbachSteinbruch", [49.678306, 7.650426], lastValueOdenbachSteinbruch, "LfU RLP", "https://wasserportal.rlp-umwelt.de/"),
    createRow("loellbach", "Löllbach (Jeckenbach)", "lastValueLoellbach", [49.703048, 7.598709], lastValueLoellbach, "LfU RLP", "https://wasserportal.rlp-umwelt.de/"),
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

            {index === 8 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "10px", fontWeight: "bold", backgroundColor: "#EFEFEF" }}>
                  Glan:
                </td>
              </tr>
            )}

            {index === 11 && (
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