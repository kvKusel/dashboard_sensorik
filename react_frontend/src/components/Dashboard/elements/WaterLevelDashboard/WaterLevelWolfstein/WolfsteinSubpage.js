import React, { useEffect, useState } from 'react';
import PegelWolfsteinMap from "./WaterLevelWolfsteinMap/WaterLevelMapWolfstein";
import LineChart from "../../LineChart";
import { waterLevelConfigWolfstein } from "../../../../../chartsConfig/chartsConfig";
import Gauge from "../../DoughnutChart";
import GaugeWaterLevel from "./GaugeChartWaterLevel";
import { pegelWolfsteinGaugeChartConfig } from "../../../../../chartsConfig/chartsConfig";
import MultiLineChart from "../../../../subcomponents/MultilineChart";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import time_icon from "../../../../../assets/time_icon_white.svg"; // Adjust the path as needed
import WolfsteinForecastBarChart from "./WolfsteinPrecipitationForecastBarChart";
import WolfsteinHistoricalBarChart from "./WolfsteinPrecipitationHistoricalBarChart";
import SensorTable from "./SensorTable";

const WolfsteinSubpage = ({
  waterLevelKreisverwaltung,
  waterLevelWolfstein,
  waterLevelRutsweiler,
  waterLevelKreimbach,
  waterLevelLauterecken1,
  waterLevelKreimbach1,
  waterLevelKreimbach3,
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

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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



///////////////////////////////////            set up for the table that displays all sensors         ///////////////////////////////////////////////

    const [selectedRow, setSelectedRow] = useState("default");

    const [lastValue, setLastValue] = useState(lastValueWolfstein); // Default to Wolfstein's last value

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
        lastValueKreisverwaltung
      };
  
      setLastValue(valueMap[queryType]);
    };

    const nameMapping = {
      lastValueWolfstein: "Wolfstein",
      lastValueRutsweiler: "Rutsweiler a.d. Lauter",
      lastValueKreimbach1: "Kreimbach 1",
      lastValueKreimbach3: "Kreimbach 3",
      lastValueKreimbach4: "Kreimbach 4",
      lastValueLauterecken1: "Lauterecken",
      lastValueKreisverwaltung: "Kusel",
    };

      // Get the name from the mapping based on selectedRow
  const displayName = selectedRow !== "default"
  ? nameMapping[selectedRow] 
  : "(Wählen Sie einen Pegel aus der Tabelle, um seine Details anzuzeigen.)";

    
    



  //arc settings for the water level gauge chart component
  const arcsDefault = [
    {
      limit: 200,
      color: "#00DFA2",
      showTick: true,
    },
    {
      limit: 250,
      color: "#F6FA70",
      showTick: true,
    },
    {
      limit: 300,
      color: "#FF0060",
      showTick: true,
    },
  ];


  const arcsRutsweiler = [
    {
      limit: 200,
      color: "#00DFA2",
      showTick: true,
    },
    {
      limit: 250,
      color: "#F6FA70",
      showTick: true,
    },
    {
      limit: 300,
      color: "#FF0060",
      showTick: true,
    },
  ];


  ///////////////////////////////////        END OF set up for the table that displays all sensors         ///////////////////////////////////////////////


  return (
    <React.Fragment>
      {/* row with the title */}

      <div className="row mt-4" style={{ flex: "1 1 auto" }}>
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
      </div>

      {/* row with the map */}

      <div className="row mt-3" style={{ flex: "1 1 auto" }}>
        <div
          className="col-12 col-md-3 d-flex flex-column mx-2"
          style={{
            flex: "1 1 auto",
            backgroundColor: "rgb(53, 79, 97)",
            borderRadius: "0px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "rgb(53, 79, 97)",
            zIndex: "0",
          }}
        >
          {/* SensorTable Section */}
          <div
            className="row flex-grow-1"
            style={{ backgroundColor: "#5D7280" }}
          >

            <SensorTable
                    onRowClick={handleRowClick}
              lastValueKreisverwaltung={lastValueKreisverwaltung}
              lastValueKreimbach1={lastValueKreimbach1}
              lastValueKreimbach3={lastValueKreimbach3}
              lastValueKreimbach4={lastValueKreimbach4}
              lastValueLauterecken1={lastValueLauterecken1}
              lastValueRutsweiler={lastValueRutsweiler}
              lastValueWolfstein={lastValueWolfstein}
            />
          </div>

          {/* Status Section */}
          <div
            className="row flex-grow-1 mt-3"
            style={{ backgroundColor: "#5D7280" }}
          >
            <div
              className="col-12 d-flex flex-column flex-grow-1"
              style={{
                backgroundColor: "#5D7280",
                borderRadius: "0px",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "#5D7280",
                position: "relative",
                zIndex: "0",
              }}
            >
              <div>
              <p className=" pt-1 fw-bold mb-0" style={{ color: "lightgray" }}>
            {displayName}
          </p>
          {selectedRow !== "default" && (
            <p className="fw-bold mb-0" style={{ color: "lightgray" }}>
              Letzte Messung: {formatTimestamp(lastValue.time)}
            </p>
          )}
              </div>

              {/* Ensure the gauge takes up the remaining space */}
              <div className="flex-grow-1 d-flex align-items-center justify-content-center pb-0">
              <GaugeWaterLevel 
            value={selectedRow === "default" ? "0" : lastValue.value} 
            arcs={ arcsDefault } 
          />              </div>
            </div>
          </div>
        </div>

        <div
          className="col-12 col-md-8  p-2  mx-2 mt-3 mt-sm-0"
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
          <PegelWolfsteinMap />
        </div>
      </div>

    

      {/* row with the line chart */}

      <div className="row mt-2" style={{ flex: "1 1 auto" }}>
        <div className="col-xs-12 d-flex p-2 pb-0">
        <div
          className="chart-container"
          style={{
            flex: "1 1 auto",
            minHeight: isSmallScreen ? "60vh" : "40vh", // Conditional minHeight
            maxHeight: "60vh",
            borderRadius: "0px",
            backgroundColor: "#5D7280",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "#5D7280",
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
              currentPeriod={currentPeriod}
            />
          </div>
        </div>
      </div>

      {/* row with sliders for choosing time span */}

      <div className="row" style={{ flex: "1 1 auto" }}>
        <div className="col-xs-12 d-flex p-2 pt-0">
          <div
            className="chart-container d-flex pb-2"
            style={{
              flex: "1 1 auto",
              borderRadius: "0px",
              backgroundColor: "#5D7280",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "#5D7280",
            }}
          >
            <Dropdown className="pt-3 ps-2">
              <Dropdown.Toggle
                variant="danger"
                id="dropdown-basic"
                className="ps-1 d-flex align-items-center custom-dropdown2"
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

      <div className="row " style={{ flex: "1 1 auto" }}>
        <div className="col-xs-12 d-flex p-2 pb-0">
          <div
            className="chart-container"
            style={{
              flex: "1 1 auto",
              minHeight: "40vh",
              // maxHeight: "60vh",
              borderRadius: "0px",
              backgroundColor: "#5D7280",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "#5D7280",
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

      <div className="row" style={{ flex: "1 1 auto" }}>
        <div className="col-xs-12 d-flex p-2 pt-0">
          <div
            className="chart-container d-flex pb-2"
            style={{
              flex: "1 1 auto",
              borderRadius: "0px",
              backgroundColor: "#5D7280",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "#5D7280",
            }}
          >
            <Dropdown className="pt-3 ps-2">
              <Dropdown.Toggle
                variant="danger"
                id="dropdown-basic"
                className="ps-1 d-flex align-items-center custom-dropdown2"
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

      <div className="row mb-4" style={{ flex: "1 1 auto" }}>
        <div className="col-xs-12 d-flex p-2 pb-0">
          <div
            className="chart-container"
            style={{
              flex: "1 1 auto",
              minHeight: "40vh",
              maxHeight: "60vh",
              borderRadius: "0px",
              backgroundColor: "#5D7280",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "#5D7280",
            }}
          >
            <WolfsteinForecastBarChart />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default WolfsteinSubpage;
