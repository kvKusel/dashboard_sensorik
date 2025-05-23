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

const WaterLevelSubpage = ({
  waterLevelKreisverwaltung,
  waterLevelWolfstein,
  waterLevelRutsweiler,
  waterLevelKreimbach,
  waterLevelLauterecken1,
  waterLevelKreimbach1,
  waterLevelKreimbach3,
  waterLevelLohnweiler1,
  waterLevelHinzweiler1,
  waterLevelUntersulzbach,
  waterLevelLohnweilerRLP,
  currentPeriod,
  onPeriodChange,
  historicalPrecipitationWolfstein,
  onPeriodChangeHistoricalPrecipitation,
  currentPeriodHistoricalPrecipitation,
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

  const lastValueKreisverwaltung =
    waterLevelKreisverwaltung[waterLevelKreisverwaltung.length - 1];

  const lastValueRutsweiler =
    waterLevelRutsweiler[waterLevelRutsweiler.length - 1];

  const lastValueKreimbach4 =
    waterLevelKreimbach[waterLevelKreimbach.length - 1]; // sensor by the PfalzMalz

  const lastValueWolfstein =
    waterLevelWolfstein[waterLevelWolfstein.length - 1];

  const lastValueLauterecken1 =
    waterLevelLauterecken1[waterLevelLauterecken1.length - 1];

  const lastValueKreimbach1 =
    waterLevelKreimbach1[waterLevelKreimbach1.length - 1];

  const lastValueKreimbach3 =
    waterLevelKreimbach3[waterLevelKreimbach3.length - 1];

  const lastValueLohnweiler1 =
    waterLevelLohnweiler1[waterLevelLohnweiler1.length - 1];

  const lastValueHinzweiler1 =
    waterLevelHinzweiler1[waterLevelHinzweiler1.length - 1];

      const lastValueUntersulzbach =
    waterLevelUntersulzbach[waterLevelUntersulzbach.length - 1];

  const lastValueLohnweilerRLP =  
    waterLevelLohnweilerRLP[waterLevelLohnweilerRLP.length - 1];


  ///////////////////////////////////            set up for the dynamic markers on the open street map        ///////////////////////////////////////////////

  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);

  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  ///////////////////////////////////            set up for the table that displays all sensors and controls which data is displayed        ///////////////////////////////////////////////

  const [activeDataset, setActiveDataset] = useState(null);

  const [selectedRow, setSelectedRow] = useState("default");

  const [lastValue, setLastValue] = useState(lastValueWolfstein); // Default to Wolfstein's last value

  // Handle table row clicks
  const handleRowClick = (queryType) => {
    setSelectedRow(queryType);
    // Update lastValue based on the selected queryType
    const valueMap = {
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
    };

    setLastValue(valueMap[queryType]);

    // Update the active dataset
    setActiveDataset(queryType);
  };

  const nameMapping = {
    lastValueWolfstein: "Wolfstein",
    lastValueRutsweiler: "Rutsweiler a.d. Lauter",
    lastValueKreimbach1: "Kreimbach 1",
    lastValueKreimbach3: "Kreimbach 2",
    lastValueKreimbach4: "Kreimbach 3",
    lastValueLauterecken1: "Lauterecken",
    lastValueKreisverwaltung: "Kusel",
    lastValueLohnweiler1: "Lohnweiler",
    lastValueHinzweiler1: "Hinzweiler",
    lastValueUntersulzbach: "Untersulzbach",
    lastValueLohnweilerRLP: "Lohnweiler (Lauter)",
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
      : "(Pegel aus der Tabelle auswählen, um Details anzuzeigen.)";

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
  };

  ///////////////////////////////////        END OF set up for the table that displays all sensors         ///////////////////////////////////////////////

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

      {/* row with the map */}

      <div className="row mt-3 rounded-3" style={{ flex: "1 1 auto" }}>
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
            className="row flex-grow-1 rounded-3 mb-2"
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
              setHoveredMarkerId={setHoveredMarkerId}
              setSelectedMarkerId={setSelectedMarkerId}
              onSelectPosition={handleMarkerClick}
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
                <p
                  className=" pt-2 mb-0"
                  style={{ color: "#18204F", fontSize: "1.1rem" }}
                >
                  Pegel {displayName}
                </p>
                {selectedRow !== "default" && (
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
                  key={selectedRow} // Force re-render when selectedRow changes
                  value={selectedRow === "default" ? "0" : lastValue.value}
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
        </div>
      </div>

      {/* row with the line chart */}

      <div
        className="row mt-4 rounded-top-3"
        style={{
          flex: "1 1 auto",
          backgroundColor: "#FFF",
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
                ? "30vh"
                : "40vh",
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
        <div className="col-xs-12 d-flex p-2 pt-0">
          <div
            className=" d-flex pb-2"
            style={{
              flex: "1 1 auto",

              // borderStyle: "solid",
              // borderWidth: "1px",
              // borderColor: "#5D7280",
              // borderRadius: "0px",
            }}
          >
            <Dropdown className="pt-3 ps-2">
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
        </div>
      </div>

      {/* row with the bar chart showing the past precipitation  */}

      <div
        className="row rounded-top-3 "
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
                ? "20vh"
                : "40vh",
              // maxHeight: "60vh",
              // backgroundColor: "#5D7280",
              // borderStyle: "solid",
              // borderWidth: "1px",
              // borderRadius: "0px",

              // borderColor: "#5D7280",
            }}
          >
            <WolfsteinHistoricalBarChart
              currentPeriodHistoricalPrecipitation={
                currentPeriodHistoricalPrecipitation
              }
              historicalPrecipitationWolfstein={
                historicalPrecipitationWolfstein
              }
            />
          </div>
        </div>
      </div>

      {/* row with sliders for choosing time span */}

      <div
        className="row rounded-bottom-3"
        style={{ flex: "1 1 auto", backgroundColor: "#fff" }}
      >
        <div className="col-xs-12 d-flex p-2 pt-0">
          <div
            className=" d-flex pb-2"
            // style={{
            //   flex: "1 1 auto",
            //   borderRadius: "0px",
            //   backgroundColor: "#5D7280",
            //   borderStyle: "solid",
            //   borderWidth: "1px",
            //   borderColor: "#5D7280",
            // }}
          >
            <Dropdown className="pt-3 ps-2 ">
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
        </div>
      </div>

      {/* row with the bar chart for the 5 day forecast */}

      <div
        className="row mt-4 mb-2 rounded-3"
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
                ? "20vh"
                : "40vh",
              maxHeight: "60vh",
              // borderRadius: "0px",

              // borderStyle: "solid",
              // borderWidth: "1px",
              // borderColor: "#5D7280",
            }}
          >
            <WolfsteinForecastBarChart />
            <Chatbot />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default WaterLevelSubpage;
