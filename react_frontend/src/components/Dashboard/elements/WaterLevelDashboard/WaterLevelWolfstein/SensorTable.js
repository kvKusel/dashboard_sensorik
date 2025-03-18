const SensorTable = ({
  onRowClick,
  lastValueKreisverwaltung,
  lastValueKreimbach1,
  lastValueKreimbach3,
  lastValueKreimbach4,
  lastValueLauterecken1,
  lastValueRutsweiler,
  lastValueWolfstein,
  setHoveredMarkerId,
  setSelectedMarkerId,
}) => {
  const data = [
    {
      id: "wolfstein",
      name: "Wolfstein",
      queryType: "lastValueWolfstein",
      value: lastValueWolfstein?.value ? Number(lastValueWolfstein.value) : 0,
    },
    {
      id: "rutsweiler",
      name: "Rutsweiler a.d. Lauter",
      queryType: "lastValueRutsweiler",
      value: lastValueRutsweiler?.value ? Number(lastValueRutsweiler.value) : 0,
    },
    {
      id: "kreimbach1",
      name: "Kreimbach 1",
      queryType: "lastValueKreimbach1",
      value: lastValueKreimbach1?.value ? Number(lastValueKreimbach1.value) : 0,
    },
    {
      id: "kreimbach3",
      name: "Kreimbach 3",
      queryType: "lastValueKreimbach3",
      value: lastValueKreimbach3?.value ? Number(lastValueKreimbach3.value) : 0,
    },
    {
      id: "kreimbach4",
      name: "Kreimbach 4",
      queryType: "lastValueKreimbach4",
      value: lastValueKreimbach4?.value ? Number(lastValueKreimbach4.value) : 0,
    },
    {
      id: "lauterecken",
      name: "Lauterecken 1",
      queryType: "lastValueLauterecken1",
      value: lastValueLauterecken1?.value
        ? Number(lastValueLauterecken1.value)
        : 0,
    },
    {
      id: "kusel",
      name: "Kusel",
      queryType: "lastValueKreisverwaltung",
      value: lastValueKreisverwaltung?.value
        ? Number(lastValueKreisverwaltung.value)
        : 0,
    },
  ];

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
        {data.map((item) => (
          <tr
            key={item.id}
            onClick={() => {
              onRowClick(item.queryType);
              setSelectedMarkerId(item.id); // Set selected marker
            }}
            onMouseEnter={() => setHoveredMarkerId(item.id)} // Set hovered marker
            onMouseLeave={() => setHoveredMarkerId(null)} // Reset on leave
            style={{ cursor: "pointer", transition: "background-color 0.3s" }}
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
                  backgroundColor:
                    item.value < 200
                      ? "#00DFA2"
                      : item.value <= 250
                      ? "#F6FA70"
                      : "#FF0060",
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
