import React from "react";
import HochbeetMap from "./WaterLevelMapKuselbach";
import LineChart from "../../LineChart";
import { waterLevelConfig } from "../../../../../chartsConfig/chartsConfig";


const KuselbachSubpage = ({ waterLevelKreisverwaltung }) => {
  return (
    <React.Fragment>
              <div className="row " style={{ flex: "1 1 auto" }}>
                <div  className="col-12 p-2 mx-2 d-flex align-items-center justify-content-center"         style={{
            flex: "1 1 auto",
            backgroundColor: "#5D7280",
            borderRadius: "0px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "#5D7280",
            zIndex: "0",
          }}><h2 className="fw-bold my-2" style={{ color:"lightgray" }}>Pegel Kuselbach</h2></div>
        </div>
      <div className="row mt-3" style={{ flex: "1 1 auto" }}>
        <div
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
            src="/pegelsensor_kusel2.jpg"
            alt="Distance sensor for water level measurement installed in Kusel"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "0px",
              minHeight: "300px",
              objectFit: "cover",
            }}
          />
        </div>

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
          <HochbeetMap />
        </div>
      </div>

      <div className="row" style={{ flex: "1 1 auto" }}>
        <div
          className="col-8 p-2 mb-3 mx-2 order-1 order-md-2"
          style={{
            flex: "1 1 auto",
            backgroundColor: "#5D7280",
            borderRadius: "0px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "#5D7280",
            maxHeight: "30vh",
          }}
        >
          <LineChart
            lineChartConfig={waterLevelConfig}
            lineData={waterLevelKreisverwaltung}
            id="temperatureChart"
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default KuselbachSubpage;