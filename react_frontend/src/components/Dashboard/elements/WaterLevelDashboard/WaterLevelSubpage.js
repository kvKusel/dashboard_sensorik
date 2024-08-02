import React, { useState, useEffect } from "react";
import axios, { all } from "axios";
import HochbeetTable from "./WaterLevelTable"
import LeafletMap from "../LeafletMap";
import LineChart from "../LineChart";

import {

  temperatureConfig,

} from "../../../../chartsConfig/chartsConfig";

import HochbeetMap from "./WaterLevelMap";

const API_URL = process.env.REACT_APP_API_URL; // This will switch based on the environment - dev env will point to local Django, prod env to the proper domain


const WaterLevelDashboard = () => {

  const [isLoading, setIsLoading] = useState(false); // State to track loading status





 // Execute the API calls and fetch the needed data
//  useEffect(() => {
//   if (
//     waterLevelData !== null 


//  )  {

//       try {        
//         setIsLoading(false); // Set loading to false once data is fetched
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setIsLoading(false); // Set loading to false in case of error
//       }
    
//   }
// }, [
//   waterLevelData,

// ]);



  
  return (
    <div style={{ minHeight: "80vh" }} className="first-step ">
      {/* Display loading indicator while data is being fetched */}
      {isLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
            color: "lightgrey"
          }}
        >
          <p className="fs-1">Sensordaten werden geladen...</p>
        </div>

      )}

{!isLoading && (
  <React.Fragment>

      <div className="row mt-4" style={{ flex: "1 1 auto" }}>


        <div
          className="col-12 col-md-8 p-2 mb-3 mx-2  "
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
          <HochbeetMap />
        </div>


      </div>





      <div className="row " style={{ flex: "1 1 auto" }}>


        <div
          className="col-12 col-md-8 p-2 mb-3 mx-2 order-1 order-md-2 "
          style={{
            flex: "1 1 auto",

            backgroundColor: "#5D7280",
            borderRadius: "0px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "#5D7280",
            // minHeight: "300px",
            maxHeight: "30vh"
          }}
        >
        
                {/* <LineChart
                  lineChartConfig={ soilMoistureConfig }
                  lineData={selectedDataset}
                /> */}
           
        </div>





      </div>
      
      
  </React.Fragment>
)}
        </div>












      )
    }

export default WaterLevelDashboard;
