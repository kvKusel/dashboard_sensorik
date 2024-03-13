import React, { useState, useEffect } from "react";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import LeafletMap from "./LeafletMap";
import { ReactComponent as GreenTreeImage } from "../../../assets/green_tree.svg";
import TreeInfoContainer from "./TreeInfoContainer";
import { precipitationConfig, temperatureConfig, soilMoistureConfig, electricalResistanceConfig } from "../../../chartsConfig/chartsConfig";
import { fetchSoilMoistureData, fetchWeatherStationData, fetchResistanceData } from "../../../chartsConfig/apiCalls";
import WeatherSubpage from "./WeatherSubpage";

const TreeMonitoringSubpage = () => {

  // prepare the trees and props for the grandchild "Dropdown.js" component
  const trees = [
    { id: 1, name: 'Tree 1', latitude: 49.55740, longitude: 7.36071 },
    { id: 2, name: 'Tree 2', latitude: 49.55759, longitude: 7.36093 },
    { id: 3, name: 'Tree 3', latitude: 49.55775, longitude: 7.36120 },
    { id: 4, name: 'Tree 4', latitude: 49.55794, longitude: 7.36147 },
    { id: 5, name: 'Tree 5', latitude: 49.55811, longitude: 7.36188 },
    { id: 6, name: 'Übersicht', latitude: 49.55660, longitude: 7.35830 }
  ];

  const [selectedTree, setSelectedTree] = useState(null);

  const handleTreeSelection = (tree) => {
    setSelectedTree(tree);
  };

 
  const [soilMoistureDataSensor1, setSoilMoistureDataSensor1] = useState([]);
  const [resistanceDataSensor1, setResistanceDataSensor1] = useState([]);
  const [weatherStationPrecipitationData, setWeatherStationPrecipitationData] = useState([]);
  const [weatherStationTemperatureData, setWeatherStationTemperatureData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status



  // Execute the API calls and fetch the needed data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data1 = await fetchSoilMoistureData("sensor1");
        const data2 = await fetchResistanceData();
        const data3 = await fetchWeatherStationData("precipitation");
        const data4 = await fetchWeatherStationData("temperature");


        setSoilMoistureDataSensor1(data1);
        setResistanceDataSensor1(data2);
        setWeatherStationPrecipitationData(data3);
        setWeatherStationTemperatureData(data4);
        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loading to false in case of error
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ minHeight: "80vh" }}>
      
      {/* Display loading indicator while data is being fetched */}
      {isLoading && 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <p className="fs-1">Sensordaten werden geladen...</p>
      </div>}

      {/* Only render the charts once the data has been fetched */}
      {!isLoading && (
        <React.Fragment>
          {/* First row - map and tree info */}
          <TreeInfoContainer trees={trees} selectedTree={selectedTree} handleTreeSelection={handleTreeSelection} />

          {/* Second row - soil moisture data */}
          <div className="row" style={{ flex: "1 1 auto" }}>
            <div className="col-xs-12 d-flex p-2">
              <div className="chart-container"
                style={{
                  flex: "1 1 auto",
                  maxHeight: "30vh",
                  borderRadius: "0px", 
                  backgroundColor: "white", 
                  borderStyle: 'solid',
                  borderWidth:'1px',
                  borderColor: 'silver'
                }}
              >
                {soilMoistureDataSensor1 && (
                  <LineChart lineChartConfig={soilMoistureConfig} lineData={soilMoistureDataSensor1} trees={trees} selectedTree={selectedTree}/>
                )}
              </div>
            </div>
          </div>

          {/* Third row - tree crown moisture data */}
          <div className="row " style={{ flex: "1 1 auto" }}>
            <div className="col-xs-12 d-flex p-2">
              <div className="chart-container"
                style={{
                  flex: "1 1 auto",
                  maxHeight: "30vh",
                  borderRadius: "0px", 
                  backgroundColor: "white", 
                  borderStyle: 'solid',
                  borderWidth:'1px',
                  borderColor: 'silver'
                }}
              >
                {resistanceDataSensor1 && (
                  <LineChart lineChartConfig={electricalResistanceConfig} lineData={resistanceDataSensor1}  trees={trees} selectedTree={selectedTree}/>
                )}
              </div>
            </div>
          </div>

          {/* Fourth row - precipitation data */}
          <div className="row " style={{ flex: "1 1 auto" }}>
            <div className="col-xs-12 d-flex p-2">
              <div className="chart-container"
                style={{
                  flex: "1 1 auto",
                  maxHeight: "30vh",
                  borderRadius: "0px", 
                  backgroundColor: "white",
                  borderStyle: 'solid',
                  borderWidth:'1px',
                  borderColor: 'silver'
                }}
              >
                {weatherStationPrecipitationData && (
                  <BarChart barChartConfig={precipitationConfig} barChartData={weatherStationPrecipitationData} />
                )}
              </div>
            </div>
          </div>

                    {/* Fifth row - temperature from weather station */}
                    <div className="row " style={{ flex: "1 1 auto" }}>
            <div className="col-xs-12 d-flex p-2 ">
              <div className="chart-container"
                style={{
                  flex: "1 1 auto",
                  maxHeight: "30vh",
                  borderRadius: "0px", 
                  backgroundColor: "white", 
                  borderStyle: 'solid',
                  borderWidth:'1px',
                  borderColor: 'silver',
                }}
              >
                {weatherStationTemperatureData && (
                  <LineChart id="temperatureChart" lineChartConfig={temperatureConfig} lineData={weatherStationTemperatureData} />
                )}
              </div>
            </div>
          </div>

          <WeatherSubpage />
        </React.Fragment>
      )}
    </div>
  );
};

export default TreeMonitoringSubpage;
