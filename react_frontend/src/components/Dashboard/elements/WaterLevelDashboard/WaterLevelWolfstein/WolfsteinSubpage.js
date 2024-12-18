import React from "react";
import PegelWolfsteinMap from "./WaterLevelMapWolfstein";
import LineChart from "../../LineChart";
import { waterLevelConfigWolfstein } from "../../../../../chartsConfig/chartsConfig";
import Gauge from "../../DoughnutChart";
import GaugeWaterLevel from "./GaugeChartWaterLevel";
import { pegelWolfsteinGaugeChartConfig } from "../../../../../chartsConfig/chartsConfig";
import MultiLineChart from "../../../../subcomponents/MultilineChart";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import time_icon from '../../../../../assets/time_icon_white.svg'; // Adjust the path as needed

const WolfsteinSubpage = ({
  waterLevelWolfstein,
  waterLevelRutsweiler,
  waterLevelKreimbach,
  currentPeriod,
  onPeriodChange,
}) => {

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


  const lastValueRutsweiler =
    waterLevelRutsweiler[waterLevelRutsweiler.length - 1];

  const lastValueKreimbach =
    waterLevelKreimbach[waterLevelKreimbach.length - 1];

    const lastValueWolfstein =
    waterLevelWolfstein[waterLevelWolfstein.length - 1];

  

  //arc settings for the water level gauge chart component
  const arcs = [
    {
      limit: 60,
      color: "#00DFA2",
      showTick: true,
    },
    {
      limit: 80,
      color: "#F6FA70",
      showTick: true,
    },
    {
      limit: 100,
      color: "#FF0060",
      showTick: true,
    },
  ];


  const arcsRutsweiler = [
    {
      limit: 100,
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
          <h2 className="fw-bold my-2" style={{ color: "lightgray" }}>
            Pegelmesssystem Wolfstein (System im Aufbau)
          </h2>
        </div>
      </div>

      {/* row with two gauge charts and water level values as text */}

      <div className="row mb-3 mt-3" style={{ flex: "1 1 auto" }}>
        <div
          className="col-12 col-lg-3 p-2 mb-3 mb-lg-0 mx-2 d-flex flex-column "
          style={{
            flex: "1 1 auto",
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
            <p
              className="lead pt-1 fw-bold mb-0"
              style={{ color: "lightgray" }}
            >
              Status Pegel Wolfstein
            </p>
            <p className=" fw-bold mb-3" style={{ color: "lightgray" }}>
            Letzte Messung: {formatTimestamp(lastValueWolfstein.time)}{" "}
            </p>
          </div>

          <GaugeWaterLevel value={lastValueWolfstein.value} arcs={arcs} />
        </div>

        <div
          className="col-12 col-lg-3 p-2 mb-3 mb-lg-0 mx-2 d-flex flex-column "
          style={{
            flex: "1 1 auto",
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
            <p
              className="lead pt-1 fw-bold mb-0"
              style={{ color: "lightgray" }}
            >
              Status Pegel Rutsweiler a.d. Lauter
            </p>
            <p className=" fw-bold mb-3" style={{ color: "lightgray" }}>
              Letzte Messung: {formatTimestamp(lastValueRutsweiler.time)}{" "}
            </p>
          </div>

          <GaugeWaterLevel value={lastValueRutsweiler.value} arcs={arcsRutsweiler} />
        </div>

        <div
          className="col-12 col-lg-3 p-2  mb-lg-0 mx-2 d-flex flex-column "
          style={{
            flex: "1 1 auto",
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
            <p
              className="lead pt-1 fw-bold mb-0"
              style={{ color: "lightgray" }}
            >
              Status Pegel Kreimbach-Kaulbach
            </p>
            <p className=" fw-bold mb-3" style={{ color: "lightgray" }}>
            Letzte Messung: {formatTimestamp(lastValueKreimbach.time)}{" "}
            </p>
          </div>

          <GaugeWaterLevel value={lastValueKreimbach.value} arcs={arcsRutsweiler} />
        </div>
      </div>

      {/* row with the line chart */}

      <div className="row " style={{ flex: "1 1 auto" }}>
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

            <MultiLineChart waterLevelRutsweiler={waterLevelRutsweiler} waterLevelKreimbach={ waterLevelKreimbach } waterLevelWolfstein = { waterLevelWolfstein } currentPeriod={ currentPeriod }/>



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

      {/* row with the picture of the sensor and the map */}

      <div className="row mt-3" style={{ flex: "1 1 auto" }}>
        <div
          className="col-12 col-md-5 col-lg-8 p-2 mb-3 mx-2"
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
    </React.Fragment>
  );
};

export default WolfsteinSubpage;
