import React, { useState, useEffect } from "react";
import { ReactComponent as GreenTreeImage } from "../../../assets/green_tree.svg";
import cloudsImage from "../../../assets/sky-with-clouds.jpg";
import precipitationImage from "../../../assets/precipitation.jpg";
import Gauge from "./DoughnutChart";
import HorizontalBarChart from "./HorizontalBarChart";
import { barometerConfig, uvIndexConfig } from "../../../chartsConfig/chartsConfig";
import WindDirectionChart from "./PolarAreaChart";

const WeatherSubpage = () => {
  // set up for the gauge, delete later
  const currentValue = 20;

  return (
    // first row - weather station header
    <div>
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


            <div className="row mb-4">
      <div className="col-sm-6  d-flex p-2 ">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: "1 1 auto",
              borderRadius: "0px",
              backgroundColor: "white",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "silver",
              backgroundColor: "#DDF2FD",
                            // backgroundImage: `url(${cloudsImage})`, // Set the background image

            }}
          >
            <div className="d-flex flex-column align-items-center justify-content-center pt-2">
            <div className="display-5" >Temperatur:<br></br> <span className="d-flex justify-content-center">20°C</span></div>

            </div>
          </div>
        </div>

        <div className="col-sm-6 d-flex p-2">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: "1 1 auto",
              borderRadius: "0px",
              backgroundColor: "white",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "silver",
              backgroundColor: "#DDF2FD",
                            // backgroundImage: `url(${precipitationImage})`, // Set the background image

            }}
          >
            <div className="d-flex flex-column align-items-center justify-content-center py-2">
            <div className="display-5 " >Niederschlag: <br></br><span className="d-flex justify-content-center">3 mm/h</span></div>

            </div>
          </div>
        </div>

        
        <div className="col-md-6   d-flex p-2">
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
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div className="d-flex flex-column align-items-center justify-content-center pt-2 " style={{ flex: "1 1 auto" }}>
      <Gauge currentValue={currentValue} config={uvIndexConfig} id={"uvIndex"}/>
      <p className="text-center">UV-Index: <strong>4</strong></p>
    </div>
  </div>
</div>


        <div className="col-md-6   d-flex p-2">
          <div className="justify-content-center align-items-center"
            style={{
              flex: "1 1 auto",
              borderRadius: "0px",
              backgroundColor: "white",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "silver",
            }}
          >
            <div className="d-flex flex-column align-items-center justify-content-center pt-2 ">
            <WindDirectionChart />
              <p className=' text-center '>Wind: <strong>2 km/h, NWN</strong></p>

            </div>
          </div>
        </div>

      {/* third row */}





        <div className="col-md-6   d-flex p-2">
          
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: "1 1 auto",
              borderRadius: "0px",
              backgroundColor: "white",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "silver",
            }}
          >
            <div className="d-flex flex-column align-items-center pt-2" style={{flex: "1 1 auto"}} >

              <HorizontalBarChart />
              <div className=' text-center'>Luftfeuchte: <strong>80%</strong></div>

            </div>
          </div>
        </div>

        <div className="col-md-6   d-flex p-2">
  <div className="justify-content-center align-items-center"
    style={{
      flex: "1 1 auto",
      borderRadius: "0px",
      backgroundColor: "white",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "silver",
      display: "flex", // Ensure inner div fills available space
      flexDirection: "column", // Stack children vertically

    }}
  >
    <div className="d-flex flex-column align-items-center justify-content-center pt-2" style={{ flex: "1 1 auto" }}>
      <Gauge currentValue={currentValue} config={barometerConfig} id={"Luftdruck"}/>
      <p className="text-center">Luftdruck: <strong>1015 hPa</strong></p>
    </div>
  </div>
</div>

      </div>
      </div>
  );
};

export default WeatherSubpage;