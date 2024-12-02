import React from "react";
import PegelWolfsteinMap from "./WaterLevelMapWolfstein";
import LineChart from "../../LineChart";
import { waterLevelConfigWolfstein } from "../../../../../chartsConfig/chartsConfig";
import Gauge from "../../DoughnutChart";
import GaugeWaterLevel from "./GaugeChartWaterLevel";
import { pegelWolfsteinGaugeChartConfig } from "../../../../../chartsConfig/chartsConfig";
import MultiLineChart from "../../../../subcomponents/MultilineChart";

const WolfsteinSubpage = ({
  waterLevelKreisverwaltung,
  waterLevelRutsweiler,
}) => {
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
              Letzte Messung:{" "}
            </p>
          </div>

          <GaugeWaterLevel value={50} arcs={arcs} />
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
              Letzte Messung:{" "}
            </p>
          </div>

          <GaugeWaterLevel value={25} arcs={arcs} />
        </div>
      </div>

      {/* row with the line chart */}

      <div className="row " style={{ flex: "1 1 auto" }}>
        <div className="col-xs-12 d-flex p-2">
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
            <MultiLineChart waterLevelRutsweiler={waterLevelRutsweiler} />
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
