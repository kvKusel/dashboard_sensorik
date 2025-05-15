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
}) => {
  const data = [
    {
      id: "wolfstein",
      name: "Wolfstein",
      queryType: "lastValueWolfstein",
      position: [49.581045, 7.619593],
      value: lastValueWolfstein?.value ? Number(lastValueWolfstein.value) : 0,
    },
    {
      id: "rutsweiler",
      name: "Rutsweiler a.d. Lauter",
      queryType: "lastValueRutsweiler",
      position: [49.566297, 7.623804],
      value: lastValueRutsweiler?.value ? Number(lastValueRutsweiler.value) : 0,
    },
    {
      id: "kreimbach1",
      name: "Kreimbach 1",
      queryType: "lastValueKreimbach1",
      position: [49.54844915352638, 7.631175812962766],
      value: lastValueKreimbach1?.value ? Number(lastValueKreimbach1.value) : 0,
    },
    {
      id: "kreimbach3",
      name: "Kreimbach 2",
      queryType: "lastValueKreimbach3",
      position: [49.556388641429436, 7.636587365546659],
      value: lastValueKreimbach3?.value ? Number(lastValueKreimbach3.value) : 0,
    },
    {
      id: "kreimbach4",
      name: "Kreimbach 3",
      queryType: "lastValueKreimbach4",
      position: [49.554087, 7.621883],
      value: lastValueKreimbach4?.value ? Number(lastValueKreimbach4.value) : 0,
    },
    {
      id: "lauterecken",
      name: "Lauterecken",
      queryType: "lastValueLauterecken1",
      position: [49.650507589739846, 7.590545488872102],
      value: lastValueLauterecken1?.value
        ? Number(lastValueLauterecken1.value)
        : 0,
    },
    {
      id: "kusel",
      name: "Kusel",
      queryType: "lastValueKreisverwaltung",
      position: [49.539820952844316, 7.396752597634942], 
      value: lastValueKreisverwaltung?.value
        ? Number(lastValueKreisverwaltung.value)
        : 0,
    },
    {
      id: "lohnweiler1",
      name: "Lohnweiler",
      name: "Lohnweiler",
      queryType: "lastValueLohnweiler1",
      position: [49.63553061963123, 7.59709411130715],
      value: lastValueLohnweiler1?.value
        ? Number(lastValueLohnweiler1.value)
        : 0,
    },
    {
      id: "hinzweiler1",
      name: "Hinzweiler",
      queryType: "lastValueHinzweiler1",
      position: [49.589414954381816, 7.548317327514346],
      value: lastValueHinzweiler1?.value
        ? Number(lastValueHinzweiler1.value)
        : 0,
    },
        {
      id: "untersulzbach",
      name: "Untersulzbach",
      queryType: "lastValueUntersulzbach",
      position: [49.528584, 7.663114], 
      value: lastValueUntersulzbach?.value
        ? Number(lastValueUntersulzbach.value)
        : 0,
    },
    {
      id: "lohnweilerRLP",
      name: "Lohnweiler (Lauter)",
      queryType: "lastValueLohnweilerRLP",
      position: [49.636245, 7.600337],
      value: lastValueLohnweilerRLP?.value
        ? Number(lastValueLohnweilerRLP.value)
        : 0,
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
          <th
            style={{
              padding: "10px",
              fontSize: "1.1em",
              textAlign: "left",
            }}
          >
            Pegel
          </th>
          <th
            style={{
              padding: "10px",
              fontSize: "1.1em",
              textAlign: "center",
            }}
          >
            Wasserstand
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={item.id}
            onClick={() => {
              onRowClick(item.queryType);
              onSelectPosition(item.position);

              setSelectedMarkerId(item.id);
            }}
            onMouseEnter={() => {
              setHoveredMarkerId(item.id);
              // Update background color when hovered
              document.getElementById(item.id).style.backgroundColor =
                rowHoverStyle.backgroundColor;
            }}
            onMouseLeave={() => {
              setHoveredMarkerId(null);
              // Revert background color when hover ends
              document.getElementById(item.id).style.backgroundColor =
                index % 2 === 0 ? "#F8F9FA" : "#fff";
            }}
            id={item.id}
            style={{
              ...rowStyle,
              backgroundColor: index % 2 === 0 ? "#F8F9FA" : "#fff", // Alternating row colors
            }}
          >
            <td style={{ padding: "10px", paddingLeft: "10px" }}>
              {item.name}
            </td>
            <td
              style={{
                padding: "10px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  display: "inline-block",
                  backgroundColor:
                    item.value < 200
                      ? "#83C968"
                      : item.value <= 250
                      ? "#ECC85B"
                      : "#E7844E",
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
