import React from "react";
import PegelWolfsteinMap from "./WaterLevelMapWolfstein";
import LineChart from "../../LineChart";
import { waterLevelConfigWolfstein } from "../../../../../chartsConfig/chartsConfig";
import Gauge from "../../DoughnutChart";
import GaugeWaterLevel from "./GaugeChartWaterLevel";
import { pegelWolfsteinGaugeChartConfig } from "../../../../../chartsConfig/chartsConfig";
import MultiLineChart from "../../../../subcomponents/MultilineChart";

const WolfsteinSubpage = ({ waterLevelKreisverwaltung }) => {

  //arc settings for the water level gauge chart component
  const arcs = [
    {
      limit: 60,
      color: '#00DFA2',
      showTick: true
    },
    {
      limit: 80,
      color: '#F6FA70',
      showTick: true
    },
    {
      limit: 100,
      color: '#FF0060',
      showTick: true
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
            position:"relative",
            zIndex: "0",
          }}
        ><div>
          <p className="lead pt-1 fw-bold mb-0" style={{ color: "lightgray",  }}>Status Pegel Wolfstein</p>
          <p className=" fw-bold mb-3" style={{ color: "lightgray",  }}>Letzte Messung: </p>

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
            position:"relative",
            zIndex: "0",
          }}
        ><div>
                    <p className="lead pt-1 fw-bold mb-0" style={{ color: "lightgray",  }}>Status Pegel Rutsweiler a.d. Lauter</p>
                    <p className=" fw-bold mb-3" style={{ color: "lightgray",  }}>Letzte Messung: </p>
          </div>

    

  
  <GaugeWaterLevel value={75} arcs={arcs} />

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
            position:"relative",
            zIndex: "0",
          }}
        ><div>
                              <p className="lead pt-1 fw-bold mb-0" style={{ color: "lightgray",  }}>Status Pegel Kreimbach-Kaulbach</p>
                              <p className=" fw-bold mb-3" style={{ color: "lightgray",  }}>Letzte Messung: </p>
          </div>

    

  
  <GaugeWaterLevel value={25} arcs={arcs} />

        </div>
        {/* <div
          className="col-12 col-lg-3 mb-3 mb-lg-0  mx-2 d-flex flex-column  justify-content-center"
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
  <p className="lead mb-0 fw-bold" style={{ color: "lightgray",  }}>Wasserstandswerte:</p>
  
  <hr className="mt-0" style={{ backgroundColor: "lightgray", width: "100%", border: "none", height: "2px" }} />
  
  <p style={{ color: "lightgray" }}>
    Wasserstand aktuell:
  </p>
  <p className="fw-bold" style={{ color: "lightgray" }}>
    28 cm
  </p>
  <p style={{ color: "lightgray" }}>
    Höchster gemessener Wasserstand:
  </p>
  <p className="fw-bold" style={{ color: "lightgray" }}>
    56 cm am 07/10/2024
  </p>
  <p style={{ color: "lightgray" }}>
    Tiefster gemessener Wasserstand:
  </p>
  <p className="fw-bold" style={{ color: "lightgray" }}>
    14 cm am 05/10/2024
  </p>
        </div> */}
        {/* <div
  className="col-12 col-lg-3   mx-2 d-flex flex-column justify-content-center"
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
  <p className="lead mb-0 fw-bold" style={{ color: "lightgray",  }}>Sensordaten:</p>
  
  <hr className="mt-0" style={{ backgroundColor: "lightgray", width: "100%", border: "none", height: "2px" }} />
  

  <p style={{ color: "lightgray" }}>
    Batteriestatus:
  </p>
  <p className="fw-bold" style={{ color: "lightgray" }}>
    98% / 98%
  </p>
  <p style={{ color: "lightgray" }}>
  Δ Sensor 1 / Sensor 2:
  </p>
  <p className="fw-bold" style={{ color: "lightgray" }}>
    0.2 cm 
  </p>
  <p style={{ color: "lightgray" }}>
    Letzte Infonachricht am:
  </p>
  <p className="fw-bold" style={{ color: "lightgray" }}>
    05/10/2024
  </p>
</div> */}

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
          <MultiLineChart />

              </div>
            </div>
          </div>

{/* 
      <div className="row" style={{ flex: "1 1 auto" }}>
        <div
          className="col-12 p-2  mx-2 order-1 order-md-2 chart-container"
          style={{
            flex: "1 1 auto",
            backgroundColor: "#5D7280",
            borderRadius: "0px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "#5D7280",
           // maxHeight: "50vh",
          }}
        >
          <MultilineChartWithToggle />
        </div>
      </div> */}

         {/* row with the picture of the sensor and the map */}

         <div className="row mt-3" style={{ flex: "1 1 auto" }}>
        {/* <div
          className="col-12 col-md-3 col-lg-3 p-2 mb-3 mx-2 d-flex align-items-center justify-content-center"
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
          <img
            src="/pegelsensor_wolfstein_1.jpg"
            alt="Distance sensor for water level measurement installed in Wolfstein"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "0px",
              minHeight: "300px",
              objectFit: "cover",
            }}
          />
        </div> */}

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
