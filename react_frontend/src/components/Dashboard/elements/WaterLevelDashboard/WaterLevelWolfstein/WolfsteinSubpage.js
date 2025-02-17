import React from "react";
import PegelWolfsteinMap from "./WaterLevelWolfsteinMap/WaterLevelMapWolfstein";
import LineChart from "../../LineChart";
import { waterLevelConfigWolfstein } from "../../../../../chartsConfig/chartsConfig";
import Gauge from "../../DoughnutChart";
import GaugeWaterLevel from "./GaugeChartWaterLevel";
import { pegelWolfsteinGaugeChartConfig } from "../../../../../chartsConfig/chartsConfig";
import MultiLineChart from "../../../../subcomponents/MultilineChart";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import time_icon from '../../../../../assets/time_icon_white.svg';
import WolfsteinForecastBarChart from "./WolfsteinPrecipitationForecastBarChart";
import WolfsteinHistoricalBarChart from "./WolfsteinPrecipitationHistoricalBarChart";

const WolfsteinSubpage = ({
  waterLevelWolfstein = [],
  waterLevelRutsweiler = [],
  waterLevelKreimbach = [],
  currentPeriod = "24h",
  onPeriodChange,
  historicalPrecipitationWolfstein = [],
  onPeriodChangeHistoricalPrecipitation,
  currentPeriodHistoricalPrecipitation = "24h"
}) => {
  const timePeriodLabels = {
    "24h": "Letzte 24 Stunden",
    "7d": "Letzte 7 Tage",
    "30d": "Letzte 30 Tage",
    "365d": "Letzte 365 Tage",
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Keine Daten verfügbar";
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "Ungültiges Datum";

      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}, ${hours}:${minutes} Uhr`;
    } catch (error) {
      return "Fehler beim Datumsformat";
    }
  };

  const getLastValue = (data = []) => {
    if (!Array.isArray(data) || data.length === 0) {
      return { time: null, value: 0 };
    }
    return data[data.length - 1];
  };

  const lastValueRutsweiler = getLastValue(waterLevelRutsweiler);
  const lastValueKreimbach = getLastValue(waterLevelKreimbach);
  const lastValueWolfstein = getLastValue(waterLevelWolfstein);

  const arcs = [
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

  const NoDataMessage = ({ location }) => (
    <div className="text-center py-3" style={{ color: "lightgray" }}>
      <p>Keine Daten verfügbar für {location}</p>
    </div>
  );

  return (
    <React.Fragment>
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
            Pegelmesssystem Wolfstein
          </h2>
        </div>
      </div>

      <div className="row mb-3 mt-3" style={{ flex: "1 1 auto" }}>
        {/* Wolfstein Gauge */}
        <div
          className="col-12 col-lg-3 p-2 mb-3 mb-lg-0 mx-2 d-flex flex-column"
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
            <p className="lead pt-1 fw-bold mb-0" style={{ color: "lightgray" }}>
              Status Pegel Wolfstein
            </p>
            <p className="fw-bold mb-3" style={{ color: "lightgray" }}>
              Letzte Messung: {formatTimestamp(lastValueWolfstein?.time)}
            </p>
          </div>
          {lastValueWolfstein ? (
            <GaugeWaterLevel value={lastValueWolfstein.value || 0} arcs={arcs} />
          ) : (
            <NoDataMessage location="Wolfstein" />
          )}
        </div>

        {/* Rutsweiler Gauge */}
        <div
          className="col-12 col-lg-3 p-2 mb-3 mb-lg-0 mx-2 d-flex flex-column"
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
            <p className="lead pt-1 fw-bold mb-0" style={{ color: "lightgray" }}>
              Status Pegel Rutsweiler a.d. Lauter
            </p>
            <p className="fw-bold mb-3" style={{ color: "lightgray" }}>
              Letzte Messung: {formatTimestamp(lastValueRutsweiler?.time)}
            </p>
          </div>
          {lastValueRutsweiler ? (
            <GaugeWaterLevel value={lastValueRutsweiler.value || 0} arcs={arcs} />
          ) : (
            <NoDataMessage location="Rutsweiler" />
          )}
        </div>

        {/* Kreimbach Gauge */}
        <div
          className="col-12 col-lg-3 p-2 mb-lg-0 mx-2 d-flex flex-column"
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
            <p className="lead pt-1 fw-bold mb-0" style={{ color: "lightgray" }}>
              Status Pegel Kreimbach-Kaulbach
            </p>
            <p className="fw-bold mb-3" style={{ color: "lightgray" }}>
              Letzte Messung: {formatTimestamp(lastValueKreimbach?.time)}
            </p>
          </div>
          {lastValueKreimbach ? (
            <GaugeWaterLevel value={lastValueKreimbach.value || 0} arcs={arcs} />
          ) : (
            <NoDataMessage location="Kreimbach-Kaulbach" />
          )}
        </div>
      </div>

      {/* Line Chart */}
      <div className="row" style={{ flex: "1 1 auto" }}>
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
            {Array.isArray(waterLevelRutsweiler) && Array.isArray(waterLevelKreimbach) && Array.isArray(waterLevelWolfstein) ? (
              <MultiLineChart
                waterLevelRutsweiler={waterLevelRutsweiler}
                waterLevelKreimbach={waterLevelKreimbach}
                waterLevelWolfstein={waterLevelWolfstein}
                currentPeriod={currentPeriod}
              />
            ) : (
              <NoDataMessage location="Linienchart" />
            )}
          </div>
        </div>
      </div>

      {/* Time Period Selector */}
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
                {Object.entries(timePeriodLabels).map(([period, label]) => (
                  <Dropdown.Item
                    key={period}
                    onClick={() => onPeriodChange?.(period)}
                  >
                    {label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Historical Bar Chart */}
      <div className="row" style={{ flex: "1 1 auto" }}>
        <div className="col-xs-12 d-flex p-2 pb-0">
          <div
            className="chart-container"
            style={{
              flex: "1 1 auto",
              minHeight: "40vh",
              borderRadius: "0px",
              backgroundColor: "#5D7280",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "#5D7280",
            }}
          >
            {Array.isArray(historicalPrecipitationWolfstein) ? (
              <WolfsteinHistoricalBarChart
                currentPeriodHistoricalPrecipitation={currentPeriodHistoricalPrecipitation}
                historicalPrecipitationWolfstein={historicalPrecipitationWolfstein}
              />
            ) : (
              <NoDataMessage location="Historische Niederschlagsdaten" />
            )}
          </div>
        </div>
      </div>

      {/* Historical Precipitation Time Period Selector */}
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
                {timePeriodLabels[currentPeriodHistoricalPrecipitation] || "Zeitraum auswählen"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {Object.entries(timePeriodLabels).map(([period, label]) => (
                  <Dropdown.Item
                    key={period}
                    onClick={() => onPeriodChangeHistoricalPrecipitation?.(period)}
                  >
                    {label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Forecast Bar Chart */}
      <div className="row" style={{ flex: "1 1 auto" }}>
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

      {/* Map */}
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