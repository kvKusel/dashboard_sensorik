import React, { useState } from "react";
import LeafletMap from "../LeafletMap";
import LineChart from "../LineChart";
import BarChart from "../BarChart";

import { useWeatherStationTemperature } from "../../../../hooks/weatherStation/WeatherStationTemperatureData";
import { useWeatherStationPrecipitation } from "../../../../hooks/weatherStation/WeatherStationPrecipitation ";

import {
  precipitationConfig,
  temperatureConfig,
  soilMoistureConfig,
  electricalResistanceConfig,
  treeMoistureContentLineChartConfig,
} from "../../../../chartsConfig/chartsConfig";

import WeatherMap from "./WeatherMap";

const WeatherDashboard = () => {
  // set up for the needles of the  gauge charts
  //const currentValue = soilMoistureData? soilMoistureData[soilMoistureData.length - 1].value : 0

  //temperature data from the weather station
  const { weatherStationTemperatureData, lastValueWeatherStationTemperature } =
    useWeatherStationTemperature();

  //precipitation data from the weather station
  const {
    weatherStationPrecipitationData,
    lastTimestampFormatted,
    lastPrecipitationValue,
  } = useWeatherStationPrecipitation();

  return (
    <>
      <div className="row mt-4" style={{ flex: "1 1 auto" }}>
        <div
          className="col-12 p-2 mb-3 mx-2"
          style={{
            flex: "1 1 auto",

            backgroundColor: "#5D7280",
            borderRadius: "0px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "#5D7280",
            zIndex: "0", //add this to make sure the controls of the map are underneath the dropdown elements (Dropdown is directly above the map)
          }}
        >
          <WeatherMap />
        </div>
      </div>

      <div className="row " style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex px-2 ">
          <div
            className="chart-container d-flex "
            style={{
              flex: "1 1 auto",
              maxHeight: "30vh",
              borderRadius: "0px",
              backgroundColor: "#5D7280",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "#5D7280",
            }}
          >
            {weatherStationTemperatureData && (
              <LineChart
                id="temperatureChart"
                lineChartConfig={temperatureConfig}
                lineData={weatherStationTemperatureData}
              />
            )}
          </div>
        </div>
      </div>

      <div className="row" style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex flex-wrap px-2">
          <div
            className="col-12 col-md-6 col-lg-4 col-xl-5 pb-2 d-flex align-items-center px-2"
            style={{
              backgroundColor: "#5D7280",
              color: "lightgray",
            }}
          >
            <div className="px-4">Wetterstation Burg Lichtenberg</div>
            <div className="">
            <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
            </div>
          </div>

          <div
            className="col-12 col-md-6 col-lg-8 col-xl-7 pb-2 d-flex align-items-center px-2"
            style={{
              backgroundColor: "#5D7280",
              color: "lightgray",
            }}
          >
            <div className="px-4">Wetterstation Siebenpfeiffer-Gymnasium</div>
            <div className="">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3" style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex px-2 ">
          <div
            className="chart-container d-flex "
            style={{
              flex: "1 1 auto",
              maxHeight: "30vh",
  
              backgroundColor: "#5D7280",
   
            }}
          >
            {weatherStationPrecipitationData && (
              <BarChart
                barChartConfig={precipitationConfig}
                barChartData={weatherStationPrecipitationData}
              />
            )}
          </div>
        </div>
      </div>

      <div className="row" style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex flex-wrap px-2">
          <div
            className="col-12 col-md-6 col-lg-4 col-xl-5 pb-2 d-flex align-items-center px-2"
            style={{
              backgroundColor: "#5D7280",
              color: "lightgray",
            }}
          >
            <div className="px-4">Wetterstation Burg Lichtenberg</div>
            <div className="">
         <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
            </div>
          </div>

          <div
            className="col-12 col-md-6 col-lg-8 col-xl-7 pb-2 d-flex align-items-center px-2"
            style={{
              backgroundColor: "#5D7280",
              color: "lightgray",
            }}
          >
            <div className="px-4">Wetterstation Siebenpfeiffer-Gymnasium</div>
            <div className="">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default WeatherDashboard;
