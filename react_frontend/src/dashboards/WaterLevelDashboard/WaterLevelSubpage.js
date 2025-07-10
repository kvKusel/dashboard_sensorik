import React, { useEffect, useState, useRef } from "react";
import PegelWolfsteinMap from "./components/Map/WaterLevelMapWolfstein";

import GaugeWaterLevel from "./components/GaugeChartWaterLevel";
import MultiLineChart from "./components/MultilineChart";
import Dropdown from "react-bootstrap/Dropdown";
import time_icon from "../../assets/time_icon.svg";
import WolfsteinForecastBarChart from "./components/WolfsteinPrecipitationForecastBarChart";
import WolfsteinHistoricalBarChart from "./components/WolfsteinPrecipitationHistoricalBarChart";
import SensorTable from "./components/SensorTable";
import Chatbot from "../../tools/Chatbot";

// Importing FontAwesome for download icon
import DownloadIcon from "./components/DownloadIcon";

import MapInteractionOverlay from "./components/Map/MapInteractionOverlay";

import WelcomeBanner from "./components/WelcomeBanner";

const WaterLevelSubpage = ({
  waterLevelKreisverwaltung,
  waterLevelKreisverwaltungBattery,

  waterLevelWolfstein,
  waterLevelWolfsteinBattery,

  waterLevelRutsweiler,
  waterLevelRutsweilerBattery,

  waterLevelKreimbach,
  waterLevelKreimbachKaulbachBattery, // assuming waterLevelKreimbach is kreimbachKaulbach readings

  waterLevelLauterecken1,
  waterLevelLauterecken1Battery,

  waterLevelKreimbach1,
  waterLevelKreimbach1Battery,

  waterLevelKreimbach3,
  waterLevelKreimbach3Battery,

  waterLevelLohnweiler1,
  waterLevelLohnweiler1Battery,

  waterLevelHinzweiler1,
  waterLevelHinzweiler1Battery,

  waterLevelUntersulzbach,
  waterLevelLohnweilerRLP,
  waterLevelOhmbachsee,
  waterLevelNanzdietschweiler,
  waterLevelRammelsbach,
  waterLevelEschenau,
  waterLevelSulzhof,
  waterLevelOdenbachSteinbruch,
  waterLevelOdenbach,
  waterLevelNiedermohr,
  waterLevelLoellbach,

  waterLevelLohnweilerLauterLandLieben,
  waterLevelLauterLandLiebenBattery,

  currentPeriod,
  onPeriodChange,
  historicalPrecipitationWolfstein,
  lohnweilerPrecipitation,
  onPeriodChangeHistoricalPrecipitation,
  currentPeriodHistoricalPrecipitation,
  activeDataset,
  setActiveDataset,
  selectedRow,
  setSelectedRow
}) => {

  // check the screen size to render the multiline chart properly
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Map for readable time period names
  const timePeriodLabels = {
    "24h": "Letzte 24 Stunden",
    "7d": "Letzte 7 Tage",
    "30d": "Letzte 30 Tage",
    "365d": "Letzte 365 Tage",
  };

  // function to format timestamps into desired format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    // Extract components
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    // Format into desired structure
    return `${day}/${month}/${year}, ${hours}:${minutes} Uhr`;
  };
// Replace the lastValue assignments (around line 90-110) with these safe versions:

const lastValueKreisverwaltung =
  waterLevelKreisverwaltung?.length > 0 
    ? waterLevelKreisverwaltung[waterLevelKreisverwaltung.length - 1]
    : null;

const lastValueRutsweiler =
  waterLevelRutsweiler?.length > 0
    ? waterLevelRutsweiler[waterLevelRutsweiler.length - 1]
    : null;

const lastValueKreimbach4 =
  waterLevelKreimbach?.length > 0
    ? waterLevelKreimbach[waterLevelKreimbach.length - 1]
    : null;

const lastValueWolfstein =
  waterLevelWolfstein?.length > 0
    ? waterLevelWolfstein[waterLevelWolfstein.length - 1]
    : null;

const lastValueLauterecken1 =
  waterLevelLauterecken1?.length > 0
    ? waterLevelLauterecken1[waterLevelLauterecken1.length - 1]
    : null;

const lastValueKreimbach1 =
  waterLevelKreimbach1?.length > 0
    ? waterLevelKreimbach1[waterLevelKreimbach1.length - 1]
    : null;

const lastValueKreimbach3 =
  waterLevelKreimbach3?.length > 0
    ? waterLevelKreimbach3[waterLevelKreimbach3.length - 1]
    : null;

const lastValueLohnweiler1 =
  waterLevelLohnweiler1?.length > 0
    ? waterLevelLohnweiler1[waterLevelLohnweiler1.length - 1]
    : null;

const lastValueHinzweiler1 =
  waterLevelHinzweiler1?.length > 0
    ? waterLevelHinzweiler1[waterLevelHinzweiler1.length - 1]
    : null;

const lastValueUntersulzbach =
  waterLevelUntersulzbach?.length > 0
    ? waterLevelUntersulzbach[waterLevelUntersulzbach.length - 1]
    : null;

const lastValueLohnweilerRLP =
  waterLevelLohnweilerRLP?.length > 0
    ? waterLevelLohnweilerRLP[waterLevelLohnweilerRLP.length - 1]
    : null;


    const lastValueLohnweilerLauterLandLieben =
  waterLevelLohnweilerLauterLandLieben?.length > 0
    ? waterLevelLohnweilerLauterLandLieben[waterLevelLohnweilerLauterLandLieben.length - 1]
    : null;


  const lastValueOhmbachsee = waterLevelOhmbachsee?.at(-1) ?? null;
const lastValueNanzdietschweiler = waterLevelNanzdietschweiler?.at(-1) ?? null;
const lastValueRammelsbach = waterLevelRammelsbach?.at(-1) ?? null;
const lastValueEschenau = waterLevelEschenau?.at(-1) ?? null;
const lastValueSulzhof = waterLevelSulzhof?.at(-1) ?? null;
const lastValueOdenbachSteinbruch = waterLevelOdenbachSteinbruch?.at(-1) ?? null;
const lastValueOdenbach = waterLevelOdenbach?.at(-1) ?? null;
const lastValueNiedermohr = waterLevelNiedermohr?.at(-1) ?? null;
const lastValueLoellbach = waterLevelLoellbach?.at(-1) ?? null;



  ///////////////////////////////////            set up for the dynamic markers on the open street map        ///////////////////////////////////////////////

  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);

  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  ///////////////////////////////////            set up for the table that displays all sensors and controls which data is displayed        ///////////////////////////////////////////////

  // const [activeDataset, setActiveDataset] = useState(null);

  // const [selectedRow, setSelectedRow] = useState("default");

const lastValueMap = {
  lastValueWolfstein,
  lastValueRutsweiler,
  lastValueKreimbach1,
  lastValueKreimbach3,
  lastValueKreimbach4,
  lastValueLauterecken1,
  lastValueKreisverwaltung,
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
  lastValueLohnweilerLauterLandLieben
};

const lastValue = selectedRow !== "default" ? lastValueMap[selectedRow] : null;

  // Handle table row clicks
const handleRowClick = (queryType) => {
  setSelectedRow(queryType);
  setActiveDataset(queryType);
};

const nameMapping = {
  lastValueWolfstein: "Wolfstein",
  lastValueRutsweiler: "Rutsweiler a.d. Lauter",
  lastValueKreimbach1: "Kreimbach 1",
  lastValueKreimbach3: "Kreimbach 2 (Kreimbach)",
  lastValueKreimbach4: "Kreimbach 3",
  lastValueLauterecken1: "Lauterecken",
  lastValueKreisverwaltung: "Kusel (Kuselbach)",
  lastValueLohnweiler1: "Lohnweiler (Mausbach)",
  lastValueHinzweiler1: "Hinzweiler (Talbach)",
  lastValueLohnweilerLauterLandLieben: "Lohnweiler (Lauter) (Sensor LANDL(i)EBEN)",

  lastValueUntersulzbach: (
    <>
      Untersulzbach{" "}
      <span style={{ fontSize: "0.75rem" }}>
        [
        <a
          href="https://wasserportal.rlp-umwelt.de/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#555", textDecoration: "underline" }}
        >
          Quelle: LfU RLP
        </a>
        ]
      </span>
    </>
  ),

  lastValueLohnweilerRLP: (
    <>
      Lohnweiler (Lauter){" "}
      <span style={{ fontSize: "0.75rem" }}>
        [
        <a
          href="https://wasserportal.rlp-umwelt.de/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#555", textDecoration: "underline" }}
        >
          Quelle: LfU RLP
        </a>
        ]
      </span>
    </>
  ),

  lastValueOhmbachsee: (
    <>
      Ohmbachsee (Ohmbach){" "}
      <span style={{ fontSize: "0.75rem" }}>
        [
        <a
          href="https://wasserportal.rlp-umwelt.de/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#555", textDecoration: "underline" }}
        >
          Quelle: LfU RLP
        </a>
        ]
      </span>
    </>
  ),

  lastValueNanzdietschweiler: (
    <>
      Nanzdietschweiler{" "}
      <span style={{ fontSize: "0.75rem" }}>
        [
        <a
          href="https://wasserportal.rlp-umwelt.de/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#555", textDecoration: "underline" }}
        >
          Quelle: LfU RLP
        </a>
        ]
      </span>
    </>
  ),

  lastValueRammelsbach: (
    <>
      Rammelsbach (Kuselbach){" "}
      <span style={{ fontSize: "0.75rem" }}>
        [
        <a
          href="https://wasserportal.rlp-umwelt.de/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#555", textDecoration: "underline" }}
        >
          Quelle: LfU RLP
        </a>
        ]
      </span>
    </>
  ),

  lastValueEschenau: (
    <>
      Eschenau{" "}
      <span style={{ fontSize: "0.75rem" }}>
        [
        <a
          href="https://wasserportal.rlp-umwelt.de/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#555", textDecoration: "underline" }}
        >
          Quelle: LfU RLP
        </a>
        ]
      </span>
    </>
  ),

  lastValueSulzhof: (
    <>
      Sulzhof (Sulzbach){" "}
      <span style={{ fontSize: "0.75rem" }}>
        [
        <a
          href="https://wasserportal.rlp-umwelt.de/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#555", textDecoration: "underline" }}
        >
          Quelle: LfU RLP
        </a>
        ]
      </span>
    </>
  ),

  lastValueOdenbachSteinbruch: (
    <>
      Odenbach / Steinbruch (Odenbach){" "}
      <span style={{ fontSize: "0.75rem" }}>
        [
        <a
          href="https://wasserportal.rlp-umwelt.de/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#555", textDecoration: "underline" }}
        >
          Quelle: LfU RLP
        </a>
        ]
      </span>
    </>
  ),

  lastValueOdenbach: (
    <>
      Odenbach{" "}
      <span style={{ fontSize: "0.75rem" }}>
        [
        <a
          href="https://wasserportal.rlp-umwelt.de/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#555", textDecoration: "underline" }}
        >
          Quelle: LfU RLP
        </a>
        ]
      </span>
    </>
  ),

  lastValueNiedermohr: (
    <>
      Niedermohr (Mohrbach){" "}
      <span style={{ fontSize: "0.75rem" }}>
        [
        <a
          href="https://wasserportal.rlp-umwelt.de/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#555", textDecoration: "underline" }}
        >
          Quelle: LfU RLP
        </a>
        ]
      </span>
    </>
  ),

  lastValueLoellbach: (
    <>
      Löllbach (Jeckenbach){" "}
      <span style={{ fontSize: "0.75rem" }}>
        [
        <a
          href="https://wasserportal.rlp-umwelt.de/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#555", textDecoration: "underline" }}
        >
          Quelle: LfU RLP
        </a>
        ]
      </span>
    </>
  ),
};


  //setup to handle zooming into a marker from both the map and the table when marker or row is clicked
  const mapRef = useRef();
  const [mapCenter, setMapCenter] = useState([49.560144, 7.49246]);

  const handleMarkerClick = (position) => {
    if (mapRef.current) {
      mapRef.current.setView(position, 18);
    }
    setMapCenter(position);
  };

  // Get the name from the mapping based on selectedRow
  const displayName =
    selectedRow !== "default"
      ? nameMapping[selectedRow]
      : "aus der Tabelle oder Karte auswählen, um Details anzuzeigen.";

  //arc settings for the water level gauge chart component
  const arcsDefault = [
    {
      limit: 200,
      color: "#83C968",
      showTick: true,
    },
    {
      limit: 250,
      color: "#ECC85B",
      showTick: true,
    },
    {
      limit: 300,
      color: "#E7844E",
      showTick: true,
    },
  ];

  const arcsMap = {
    lastValueWolfstein: [
      { limit: 250, color: "#83C968", showTick: true },
      { limit: 300, color: "#ECC85B", showTick: true },
      { limit: 350, color: "#E7844E", showTick: true },
    ],
    lastValueRutsweiler: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
    ],
    lastValueKreimbach1: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
    ],
    lastValueKreimbach3: [
      { limit: 50, color: "#83C968", showTick: true },
      { limit: 65, color: "#ECC85B", showTick: true },
      { limit: 130, color: "#E7844E", showTick: true },
    ],
    lastValueKreimbach4: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
    ],
    lastValueLauterecken1: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
    ],
    lastValueKreisverwaltung: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
    ],
    lastValueLohnweiler1: [
      { limit: 70, color: "#83C968", showTick: true },
      { limit: 100, color: "#ECC85B", showTick: true },
      { limit: 130, color: "#E7844E", showTick: true },
    ],
    lastValueHinzweiler1: [
      { limit: 90, color: "#83C968", showTick: true },
      { limit: 140, color: "#ECC85B", showTick: true },
      { limit: 190, color: "#E7844E", showTick: true },
    ],
    
    lastValueUntersulzbach: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
    ],
    lastValueLohnweilerRLP: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
    ],
    lastValueOhmbachsee: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
],

lastValueNanzdietschweiler: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
],

lastValueRammelsbach: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
],

lastValueEschenau: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
],

lastValueSulzhof: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
],

lastValueOdenbachSteinbruch: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
],

lastValueOdenbach: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
],

lastValueNiedermohr: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
],

lastValueLoellbach: [
      { limit: 200, color: "#83C968", showTick: true },
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
],
lastValueLohnweilerLauterLandLieben: [
      { limit: 200, color: "#83C968", showTick: true }, 
      { limit: 250, color: "#ECC85B", showTick: true },
      { limit: 300, color: "#E7844E", showTick: true },
],
  };

  ///////////////////////////////////        END OF set up for the table that displays all sensors         ///////////////////////////////////////////////





  const [precipitationActiveDataset, setPrecipitationActiveDataset] = useState('lohnweiler');


  
  return (
    <React.Fragment>
      {/* row with the title */}

      {/* <div className="row mt-4" style={{ flex: "1 1 auto" }}>
        <div
          className="col-12 p-2 mx-2 d-flex align-items-center justify-content-center"
          style={{
            flex: "1 1 auto",
            backgroundColor: "#5D7280",
            borderRadius: "0px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "#5D7280",
            zIndex: "0",
          }}
        >
          <h2
            className="fw-bold my-2 text-center"
            style={{ color: "lightgray" }}
          >
            Pegelmessstellen{" "}
            <span className="d-block d-sm-inline">Landkreis Kusel</span>
          </h2>
        </div>
      </div> */}


      {/* Welcome banner row */}
{/* <WelcomeBanner /> */}

      {/* row with the map */}

      <div className="row rounded-3 mt-3" style={{ flex: "1 1 auto" }}>
        <div
          className="col-12 col-md-4 d-flex flex-column rounded-3"
          style={{
            flex: "1 1 auto",
            // backgroundColor: "transparent",
            // borderRadius: "0px",
            // borderStyle: "solid",
            // borderWidth: "1px",
            // borderColor: "transparent",
            // zIndex: "0",
          }}
        >
          {/* SensorTable Section */}
          <div
            className="row flex-grow-1 rounded-3 mb-2 sensor-table-wrapper"
            style={{
              backgroundColor: "#fff",
              boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
            }}
          >
            <SensorTable
              className="rounded-3"
              onRowClick={handleRowClick}
              lastValueKreisverwaltung={lastValueKreisverwaltung}
              lastValueKreimbach1={lastValueKreimbach1}
              lastValueKreimbach3={lastValueKreimbach3}
              lastValueKreimbach4={lastValueKreimbach4}
              lastValueLauterecken1={lastValueLauterecken1}
              lastValueRutsweiler={lastValueRutsweiler}
              lastValueWolfstein={lastValueWolfstein}
              lastValueLohnweiler1={lastValueLohnweiler1}
              lastValueHinzweiler1={lastValueHinzweiler1}
              lastValueUntersulzbach={lastValueUntersulzbach}
              lastValueLohnweilerRLP={lastValueLohnweilerRLP}

                lastValueOhmbachsee={lastValueOhmbachsee}
  lastValueNanzdietschweiler={lastValueNanzdietschweiler}
  lastValueRammelsbach={lastValueRammelsbach}
  lastValueEschenau={lastValueEschenau}
  lastValueSulzhof={lastValueSulzhof}
  lastValueOdenbachSteinbruch={lastValueOdenbachSteinbruch}
  lastValueOdenbach={lastValueOdenbach}
  lastValueNiedermohr={lastValueNiedermohr}
  lastValueLoellbach={lastValueLoellbach}
  lastValueLohnweilerLauterLandLieben={lastValueLohnweilerLauterLandLieben}

            waterLevelKreisverwaltungBattery={waterLevelKreisverwaltungBattery}
waterLevelRutsweilerBattery={waterLevelRutsweilerBattery}
waterLevelKreimbachKaulbachBattery={waterLevelKreimbachKaulbachBattery}
waterLevelWolfsteinBattery={waterLevelWolfsteinBattery}
waterLevelLauterecken1Battery={waterLevelLauterecken1Battery}
waterLevelKreimbach1Battery={waterLevelKreimbach1Battery}
waterLevelKreimbach3Battery={waterLevelKreimbach3Battery}
waterLevelLohnweiler1Battery={waterLevelLohnweiler1Battery}
waterLevelHinzweiler1Battery={waterLevelHinzweiler1Battery}
waterLevelLauterLandLiebenBattery={waterLevelLauterLandLiebenBattery}



              setHoveredMarkerId={setHoveredMarkerId}
              setSelectedMarkerId={setSelectedMarkerId}
              onSelectPosition={handleMarkerClick}
                selectedRow={selectedRow}
  hoveredMarkerId={hoveredMarkerId}

            />
          </div>

          {/* Status Section */}
          <div
            className="row flex-grow-1 mt-3 rounded-3"
            style={{
              backgroundColor: "#fff",
              boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
            }}
          >
            <div className="col-12 d-flex flex-column flex-grow-1 ">
              <div>
<p className="pt-2 mb-0" style={{ color: "#18204F", fontSize: "1.1rem" }}>
  Pegel {displayName}
</p>
{selectedRow !== "default" && lastValue && (
  <p
    className=" mb-0"
    style={{ color: "#18204F", fontSize: "1.1rem" }}
  >
    Letzte Messung: {formatTimestamp(lastValue.time)}
  </p>
)}
              </div>

              {/* Ensure the gauge takes up the remaining space */}
              <div className="flex-grow-1 d-flex align-items-center justify-content-center pb-0">
<GaugeWaterLevel
  key={selectedRow}
  value={selectedRow === "default" || !lastValue ? "0" : lastValue.value}
  arcs={
    selectedRow === "default"
      ? arcsDefault
      : arcsMap[selectedRow]
  }
/>{" "}
              </div>
            </div>
          </div>
        </div>

        <div
          className="col-12 col-md-7  p-2   mt-3 mt-sm-0 ms-md-4 rounded-3"
          style={{
            flex: "1 1 auto",
            backgroundColor: "#fff",
            borderRadius: "0px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "#fff",
            boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
            zIndex: "0",
          }}
        >
  <MapInteractionOverlay>
    <PegelWolfsteinMap
      hoveredMarkerId={hoveredMarkerId}
      selectedMarkerId={selectedMarkerId}
      onMarkerClick={handleRowClick}
      setHoveredMarkerId={setHoveredMarkerId}
      setSelectedMarkerId={setSelectedMarkerId}
      mapRef={mapRef}
      mapCenter={mapCenter}
      setMapCenter={setMapCenter}
      handleMarkerClick={handleMarkerClick}
    />
  </MapInteractionOverlay>
        </div>
      </div>

      {/* row with the line chart */}

      <div
        id="multiline-chart" // <-- Add this ID

        className="row mt-4 rounded-top-3 "
        style={{
          flex: "1 1 auto",
          backgroundColor: "#FFF",
          boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
        }}
      >
        <div className="col-xs-12 d-flex p-2 pb-0 ">
          <div
            className=""
            style={{
              flex: "1 1 auto",
              minHeight: isSmallScreen
                ? "50vh"
                : window.innerWidth < 1200
                ? "50vh"
                : "50vh",
              maxHeight: "60vh",
              // borderRadius: "0px",
              // borderStyle: "solid",
              // borderWidth: "1px",
              // borderColor: "#5D7280",
            }}
          >
            <MultiLineChart
              waterLevelKreisverwaltung={waterLevelKreisverwaltung}
              waterLevelRutsweiler={waterLevelRutsweiler}
              waterLevelKreimbach={waterLevelKreimbach}
              waterLevelWolfstein={waterLevelWolfstein}
              waterLevelLauterecken1={waterLevelLauterecken1}
              waterLevelKreimbach1={waterLevelKreimbach1}
              waterLevelKreimbach3={waterLevelKreimbach3}
              waterLevelLohnweiler1={waterLevelLohnweiler1}
              waterLevelHinzweiler1={waterLevelHinzweiler1}
              waterLevelUntersulzbach={waterLevelUntersulzbach}
              waterLevelLohnweilerRLP={waterLevelLohnweilerRLP} 

                waterLevelOhmbachsee={waterLevelOhmbachsee}
  waterLevelNanzdietschweiler={waterLevelNanzdietschweiler}
  waterLevelRammelsbach={waterLevelRammelsbach}
  waterLevelEschenau={waterLevelEschenau}
  waterLevelSulzhof={waterLevelSulzhof}
  waterLevelOdenbachSteinbruch={waterLevelOdenbachSteinbruch}
  waterLevelOdenbach={waterLevelOdenbach}
  waterLevelNiedermohr={waterLevelNiedermohr}
  waterLevelLoellbach={waterLevelLoellbach}
  waterLevelLohnweilerLauterLandLieben={waterLevelLohnweilerLauterLandLieben}


              currentPeriod={currentPeriod}
              activeDataset={activeDataset}
            />
          </div>
        </div>
      </div>

      {/* row with sliders for choosing time span */}


<div
  className="row rounded-bottom-3 mb-4"
  style={{ flex: "1 1 auto", backgroundColor: "#FFF" }}
>
  <div className="col-xs-12 p-2 pt-0">
    
    {/* Attribution on small screens (above row) */}
    {/* {(activeDataset === "lastValueLohnweilerRLP" || activeDataset === "lastValueUntersulzbach") && (
      <div className="d-block d-sm-none mb-2 text-left">
        <a
          href="https://wasserportal.rlp-umwelt.de/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#555", textDecoration: "underline", fontSize: "0.9rem", paddingLeft: "10px" }}
        >
          Quelle: LfU RLP
        </a>
      </div>
    )} */}

    <div className="d-flex justify-content-between align-items-center position-relative">
      
      {/* Left: Dropdown */}
      <div className="d-flex">
        <Dropdown className="ps-2">
          <Dropdown.Toggle
            variant="danger"
            id="dropdown-basic"
            className="ps-1 d-flex align-items-center custom-dropdown2"
            style={{ fontSize: "1.1rem" }}
          >
            <img src={time_icon} alt="Time Icon" className="icon" />
            {timePeriodLabels[currentPeriod] || "Zeitraum auswählen"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => onPeriodChange("24h")}>
              Letzte 24 Stunden
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onPeriodChange("7d")}>
              Letzte 7 Tage
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onPeriodChange("30d")}>
              Letzte 30 Tage
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onPeriodChange("365d")}>
              Letzte 365 Tage
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

{/* Centered Attribution on larger screens */}
{[
  "lastValueLohnweilerRLP",
  "lastValueUntersulzbach",
  "lastValueOhmbachsee",
  "lastValueNanzdietschweiler",
  "lastValueRammelsbach",
  "lastValueEschenau",
  "lastValueSulzhof",
  "lastValueOdenbachSteinbruch",
  "lastValueOdenbach",
  "lastValueNiedermohr",
  "lastValueLoellbach",
  lastValueLohnweilerLauterLandLieben
].includes(activeDataset) && (
  <div
    className="d-none d-sm-block position-absolute top-50 start-50 translate-middle"
    style={{ fontSize: "0.9rem" }}
  >
    <a
      href="https://wasserportal.rlp-umwelt.de/"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#555", textDecoration: "underline" }}
    >
      Quelle: LfU RLP
    </a>
  </div>
)}


      

      {/* Right: Download Icon */}
      <DownloadIcon className="pe-2" activeDataset={activeDataset} />
    </div>

{/* Attribution on mobile BELOW the dropdown */}
{[
  "lastValueLohnweilerRLP",
  "lastValueUntersulzbach",
  "lastValueOhmbachsee",
  "lastValueNanzdietschweiler",
  "lastValueRammelsbach",
  "lastValueEschenau",
  "lastValueSulzhof",
  "lastValueOdenbachSteinbruch",
  "lastValueOdenbach",
  "lastValueNiedermohr",
  "lastValueLoellbach",
  lastValueLohnweilerLauterLandLieben
].includes(activeDataset) && (
  <div className="d-block d-sm-none mt-2 ps-2">
    <a
      href="https://wasserportal.rlp-umwelt.de/"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#555", textDecoration: "underline", fontSize: "0.9rem" }}
    >
      Quelle: LfU RLP
    </a>
  </div>
)}

  </div>
</div>



 
{/* row with the bar chart showing the past precipitation */}
<div
  id="historical-precipitation"
  className="row rounded-top-3"
  style={{
    flex: "1 1 auto",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
  }}
>
  <div className="col-xs-12 d-flex p-2 pb-2">
    <div
      className=""
      style={{
        flex: "1 1 auto",
        minHeight: isSmallScreen
          ? "40vh"
          : window.innerWidth < 1200
          ? "40vh"
          : "40vh",
        maxHeight: "60vh",
      }}
    >
      <WolfsteinHistoricalBarChart
        currentPeriodHistoricalPrecipitation={
          currentPeriodHistoricalPrecipitation
        }
        historicalPrecipitationWolfstein={
          historicalPrecipitationWolfstein
        }
        lohnweilerPrecipitation={lohnweilerPrecipitation}
        activeDataset={precipitationActiveDataset}
      />
    </div>
  </div>

  
  
  {/* Dataset Toggle Dropdown */}


 <div className="d-flex justify-content-left my-2" style={{ paddingLeft: "16px" }}>
  <Dropdown>
<Dropdown.Toggle
  variant="danger"
  id="dropdown-precipitation-location"
  className="d-flex align-items-center justify-items-center justify-content-between custom-dropdown2 py-2"
  style={{ fontSize: "1.1rem" ,
        width: "182px",           // ← Fixed width

  }}
>
  {precipitationActiveDataset === 'lohnweiler'
    ? 'Lohnweiler'
    : 'Wolfstein'}
</Dropdown.Toggle>



<Dropdown.Menu className="custom-dropdown-gray">
      <Dropdown.Item
        onClick={() => setPrecipitationActiveDataset('lohnweiler')}
        active={precipitationActiveDataset === 'lohnweiler'}
      >
        {precipitationActiveDataset === 'lohnweiler'}Lohnweiler
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => setPrecipitationActiveDataset('wolfstein')}
        active={precipitationActiveDataset === 'wolfstein'}
      >
        {precipitationActiveDataset === 'wolfstein'}Wolfstein
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
</div>


</div>

{/* row with sliders for choosing time span and OpenWeather attribution */}

<div
  className="row  rounded-bottom-3"
  style={{ flex: "1 1 auto", backgroundColor: "#fff" }}
>
  <div className="col-xs-12 p-2 pt-0">


    <div className="d-flex justify-content-between align-items-center position-relative">
      {/* Left: Dropdown */}
      <div className="d-flex align-items-center">
        <Dropdown className=" ps-2">
          <Dropdown.Toggle
            variant="danger"
            id="dropdown-basic"
            className="ps-1 d-flex align-items-center custom-dropdown2"
            style={{ fontSize: "1.1rem" }}
          >
            <img src={time_icon} alt="Time Icon" className="icon" />
            {timePeriodLabels[currentPeriodHistoricalPrecipitation] ||
              "Zeitraum auswählen"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => onPeriodChangeHistoricalPrecipitation("24h")}
            >
              Letzte 24 Stunden
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => onPeriodChangeHistoricalPrecipitation("7d")}
            >
              Letzte 7 Tage
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => onPeriodChangeHistoricalPrecipitation("30d")}
            >
              Letzte 30 Tage
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => onPeriodChangeHistoricalPrecipitation("365d")}
            >
              Letzte 365 Tage
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Center: Attribution for larger screens */}
  {precipitationActiveDataset === 'wolfstein' && (
  <div
    className="d-none d-sm-block position-absolute top-50 start-50 translate-middle"
    style={{ fontSize: "0.9rem" }}
  >
    <a
      href="https://openweathermap.org/"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#555", textDecoration: "underline" }}
    >
      Quelle: OpenWeather
    </a>
  </div>
)}


      {/* Right: Download Icon */}
      <div className="pe-2">
        <DownloadIcon
          isPrecipitationDownload={true}
          tooltipText="Niederschlagsdaten herunterladen"
            precipitationActiveDataset={precipitationActiveDataset} 
        />
      </div>


      
    </div>

        {/* Attribution on small screens - above row */}
{precipitationActiveDataset === 'wolfstein' && (
  <div className="d-block d-sm-none my-2 text-left">
    <a
      href="https://openweathermap.org/"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#555",
        textDecoration: "underline",
        fontSize: "0.9rem",
        paddingLeft: "10px",
      }}
    >
      Quelle: OpenWeather
    </a>
  </div>
)}

  </div>
</div>






   {/* row with the bar chart for the 5 day forecast */}
<div
  className="row mt-4 rounded-top-3"
  style={{
    flex: "1 1 auto",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
  }}
>
  <div className="col-xs-12 d-flex p-2 pb-0">
    <div
      className=""
      style={{
        flex: "1 1 auto",
        minHeight: isSmallScreen
          ? "40vh"
          : window.innerWidth < 1200
          ? "40vh"
          : "40vh",
        maxHeight: "60vh",
      }}
    >
      <WolfsteinForecastBarChart />
      <Chatbot />         
    </div>
  </div>
</div>

{/* Attribution row for forecast OpenWeather */}
<div
  className="row rounded-bottom-3 mb-2"
  style={{ flex: "1 1 auto", backgroundColor: "#fff" }}
>
  <div className="col-xs-12 p-2 pt-0">
    {/* Attribution above on small screens */}
    <div className="d-block d-sm-none mb-2 ps-2">
      <a
        href="https://openweathermap.org/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#555", textDecoration: "underline", fontSize: "0.9rem" }}
      >
        Quelle: OpenWeather
      </a>
    </div>

    {/* Main row with centered attribution on larger screens */}
    <div className="d-flex justify-content-center align-items-center">
      <div className="d-none d-sm-block">
        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#555", textDecoration: "underline", fontSize: "0.9rem" }}
        >
          Quelle: OpenWeather
        </a>
      </div>
    </div>
  </div>
</div>
    </React.Fragment>
  );
};

export default WaterLevelSubpage;
