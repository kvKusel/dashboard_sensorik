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
            <td style={{ padding: "10px", paddingLeft: "10px" }}>{item.name}</td>
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
