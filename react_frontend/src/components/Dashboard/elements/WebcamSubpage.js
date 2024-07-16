import React, { useState, useEffect } from "react";
import { ReactComponent as GreenTreeImage } from "../../../assets/green_tree.svg";
import cloudsImage from "../../../assets/sky-with-clouds.jpg";
import precipitationImage from "../../../assets/precipitation.jpg";
import Gauge from "./DoughnutChart";
import HorizontalBarChart from "./HorizontalBarChart";
import {
  barometerConfig,
  uvIndexConfig,
} from "../../../chartsConfig/chartsConfig";
import WindDirectionChart from "./PolarAreaChart";
import weatherStation from "../../../assets/weather_station.jpg";
import LeafletMap from "./LeafletMap";


//function to convert numerical values of wind direction provided by sensor into compass directions
function getWindDirection(degrees) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8; // Divide by 45 degrees for each sector and use modulo 8 to wrap around
  return directions[index];
}

const WeatherSubpage = ({
  lastMeasurementTime,
  temperature,
  precipitation,
  UV,
  humidity,
  airPressure,
  windSpeed,
  windDirection,
}) => {
  const windDirectionDescription = getWindDirection(windDirection);

  return (
    <div>
       {/* row - weather station header */}
       <div className="row" style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex p-2">
          <div
            className="fs-1 text-center p-3"
            style={{
              flex: "1 1 auto",
              backgroundColor: "#5D7280",
              borderRadius: "0px",
              borderStyle: 'solid',
              borderWidth:'1px',
              borderColor: '#5D7280',
              // backgroundImage: `url(${cloudsImage})`, // Set the background image
            }}
          >
          <LeafletMap />
          </div>
        </div>
      </div>
       {/* row - weather station header */}
      <div className="row" style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex p-2">
          <div
            className="fs-1 text-center p-3"
            style={{
              flex: "1 1 auto",
              maxHeight: "30vh",
              borderRadius: "0px",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "silver",
              // backgroundImage: `url(${cloudsImage})`, // Set the background image
            }}
          >
            Aktuelle Wetterlage - Wetterstation Lichtenberg:
          </div>
        </div>
      </div>
      {/* second row */}
      <div className="row mb-4 ">
        <div className="row px-3">
          <div className="col-12  d-flex  p-2 ">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: "1 1 auto",
                borderRadius: "0px",
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "transparent",
                backgroundColor: "transparent",
                // backgroundImage: `url(${cloudsImage})`, // Set the background image
              }}
            >
              <div className="d-flex flex-column  pt-2">
                <div className=" fs-3 text-center">
                  Letzte Messung:<br></br>{" "}
                  <span className="d-flex justify-content-center fw-bold">
                    {lastMeasurementTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6  d-flex  p-2 ">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: "1 1 auto",
                borderRadius: "0px",
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "transparent",
                backgroundColor: "transparent",
                // backgroundImage: `url(${cloudsImage})`, // Set the background image
              }}
            >
              <div className="d-flex flex-column align-items-center justify-content-center pt-2">
                <div className="fs-3">
                  Temperatur:<br></br>{" "}
                  <span className="d-flex justify-content-center fw-bold">
                    {parseInt(Math.round(temperature))}°C
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 d-flex  p-2">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: "1 1 auto",
                borderRadius: "0px",
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "transparent",
                backgroundColor: "transparent",
                // backgroundImage: `url(${precipitationImage})`, // Set the background image
              }}
            >
              <div className="d-flex flex-column align-items-center justify-content-center pt-2">
                <div className="fs-3">
                  Niederschlag: <br></br>
                  <span className="d-flex justify-content-center fw-bold">
                    {" "}
                    {Math.round(precipitation)} mm/h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6  col-lg-3 d-flex p-2">
          <div
            style={{
              flex: "1 1 auto",
              borderRadius: "0px",
              backgroundColor: "white",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "silver",
              display: "flex", // Ensure inner div fills available space
              flexDirection: "column", // Stack children vertically
              //justifyContent: "center",
              alignItems: "center",
              width: "50%",
            }}
          >
            <div
              className="d-flex pt-2 align-items-center"
              style={{ flex: "1 1 auto", maxWidth: "100%", maxHeight: "100%" }}
            >
              <Gauge
                currentValue={UV * 10}
                config={uvIndexConfig}
                id={"uvIndex"}
              />
            </div>
            <p className="text-center">
              UV-Index: <br></br>
              <strong>
                {UV} {UV >= 0 && UV <= 2 && "(niedrig)"}
                {UV > 2 && UV <= 5 && "(mäßig)"}
                {UV > 5 && UV <= 7 && "(hoch)"}
                {UV > 7 && UV <= 10 && "(sehr hoch)"}
                {UV > 10 && "(extrem)"}
              </strong>
            </p>
          </div>
        </div>

        <div className="col-6  col-lg-3 d-flex p-2">
          <div
            className=" "
            style={{
              flex: "1 1 auto",
              borderRadius: "0px",
              backgroundColor: "white",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "silver",
              width: "50%",
              flexDirection: "column",
            }}
          >
            <div
              className=" pt-2 pb-3"
              style={{ maxWidth: "", maxHeight: "", flex: "" }}
            >
              <WindDirectionChart windDirection={windDirection} />
            </div>
            <p style={{ flex: "1 1 auto" }} className=" text-center ">
              Wind: <br></br>{" "}
              <strong>
                {windSpeed} km/h, {windDirectionDescription}
              </strong>
            </p>
          </div>
        </div>

        {/* third row */}

        <div className="col-6  col-lg-3 d-flex p-2">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              //alignItems: 'center',
              flex: "1 1 auto",
              borderRadius: "0px",
              backgroundColor: "white",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "silver",
              width: "50%",
              flexDirection: "column",
            }}
          >
            <div
              className="d-flex flex-column pt-2 px-2 align-items-center"
              style={{ flex: "1 1 auto" }}
            >
              <HorizontalBarChart values={humidity} />
            </div>
            <p style={{ flex: "1 1 auto" }} className=" text-center">
              Luftfeuchte: <br></br> <strong>{humidity}%</strong>
            </p>
          </div>
        </div>

        <div className="col-6  col-lg-3 d-flex p-2">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              flex: "1 1 auto",
              borderRadius: "0px",
              backgroundColor: "white",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "silver",
              display: "flex", // Ensure inner div fills available space
              flexDirection: "column", // Stack children vertically
              width: "50%",
            }}
          >
            <div
              className="d-flex pt-2 align-items-center"
              style={{ flex: "1 1 auto", maxWidth: "100%", maxHeight: "100%" }}
            >
              <Gauge
                currentValue={(parseInt(airPressure) / 100 + 47).toFixed(0)}
                config={barometerConfig}
                id={"airPressure"}
              />
            </div>
            <div>
              <p className="text-center">
                Luftdruck:<br></br>{" "}
                <strong>
                  {(parseInt(airPressure) / 100 + 47).toFixed(0)} hPa
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherSubpage;
