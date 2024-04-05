import React, { useState, useEffect } from "react";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import TreeInfoContainer from "./TreeInfoContainer";
import {
  precipitationConfig,
  temperatureConfig,
  soilMoistureConfig,
  electricalResistanceConfig,
} from "../../../chartsConfig/chartsConfig";
import {
  fetchSoilMoistureData,
  fetchWeatherStationData,
  fetchResistanceData,
  fetchTreeHealthData,
} from "../../../chartsConfig/apiCalls";
import WeatherSubpage from "./WeatherSubpage";
//import WeatherSubpage from "./WeatherSubpageWithCards";

const TreeMonitoringSubpage = () => {
  // prepare the trees and props for the child components
  const trees = [
    {
      id: 1,
      name: "Pleiner Mostbirne",
      latitude: 49.55733911301222,
      longitude: 7.3607157322857075,
    },
    {
      id: 2,
      name: "Schöner von Nordhausen",
      latitude: 49.55751276556591,
      longitude: 7.361085800771698,
    },
    {
      id: 3,
      name: "Roter Boskoop",
      latitude: 49.55765249375624,
      longitude: 7.361099770403598,
    },
    {
      id: 4,
      name: "Cox Orangenrenette",
      latitude: 49.55763383926781,
      longitude: 7.36134283963924,
    },
    {
      id: 5,
      name: "Jonathan",
      latitude: 49.55780646950395,
      longitude: 7.361366709398196,
    },
    { id: 6, name: "Projektareal", latitude: 49.5566, longitude: 7.3583 },
    { id: 7, name: "Obstwiese", latitude: 49.5566, longitude: 7.3583 },
  ];

  const [selectedTree, setSelectedTree] = useState(null);

  const handleTreeSelection = (tree) => {
    setSelectedTree(tree);
  };

  const [soilMoistureDataSensor1, setSoilMoistureDataSensor1] = useState([]);

  const [soilMoistureDataJonathan, setSoilMoistureDataJonathan] = useState([]);

  const [resistanceDataSensor1, setResistanceDataSensor1] = useState([]);

  // General tree health

  const [
    treeSenseCoxOrangenrenetteGeneralHealth,
    setTreeSenseCoxOrangenrenetteGeneralHealth,
  ] = useState([]);

  const [weatherStationPrecipitationData, setWeatherStationPrecipitationData] =
    useState([]);
  const [weatherStationTemperatureData, setWeatherStationTemperatureData] =
    useState([]);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  // Execute the API calls and fetch the needed data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Soil moisture data
        const data1 = await fetchSoilMoistureData("sensor1");
        const soilMoistureDataSensorJonathan = await fetchSoilMoistureData(
          "jonathan"
        );

        // General tree health
        const treeSenseGeneralHealthData = await fetchTreeHealthData();
        setTreeSenseCoxOrangenrenetteGeneralHealth(treeSenseGeneralHealthData);

        const data2 = await fetchResistanceData();
        const data3 = await fetchWeatherStationData("precipitation");
        const data4 = await fetchWeatherStationData("temperature");

        setSoilMoistureDataSensor1(data1);
        setSoilMoistureDataJonathan(soilMoistureDataSensorJonathan);
        setResistanceDataSensor1(data2);
        setWeatherStationPrecipitationData(data3);
        setWeatherStationTemperatureData(data4);

        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loading to false in case of error
        console.log("Precipitation data:", weatherStationPrecipitationData)
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ minHeight: "80vh" }}>
      {/* Display loading indicator while data is being fetched */}
      {isLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <p className="fs-1">Sensordaten werden geladen...</p>
        </div>
      )}

      {/* Only render the charts once the data has been fetched */}
      {!isLoading && (
        <React.Fragment>
          {/* First row - map and tree info */}
          {/* {soilMoistureDataSensor1 && soilMoistureDataJonathan && 
            treeSenseCoxOrangenrenetteGeneralHealth && ( */}
          <TreeInfoContainer
            trees={trees}
            selectedTree={selectedTree}
            handleTreeSelection={handleTreeSelection}
            soilMoistureData={
              selectedTree && selectedTree.id === 1
                ? soilMoistureDataSensor1
                : soilMoistureDataJonathan
            }
            treeSenseGeneralHealthData={treeSenseCoxOrangenrenetteGeneralHealth}
          />

          {/* Second row - soil moisture data */}
          <div className="row" style={{ flex: "1 1 auto" }}>
            <div className="col-xs-12 d-flex p-2 ">
              <div
                className="chart-container "
                style={{
                  flex: "1 1 auto",
                  maxHeight: "30vh",
                  borderRadius: "0px",
                  backgroundColor: "white",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "silver",
                }}
              >
                {/* {soilMoistureDataSensor1 && soilMoistureDataJonathan &&( */}
                <LineChart
                  lineChartConfig={soilMoistureConfig}
                  lineData={
                    selectedTree && selectedTree.id === 1
                      ? soilMoistureDataSensor1
                      : soilMoistureDataJonathan
                  }
                  trees={trees}
                  selectedTree={selectedTree}
                />
              </div>
            </div>
          </div>

          {/* Third row - tree crown moisture data */}
          <div className="row " style={{ flex: "1 1 auto" }}>
            <div className="col-xs-12 d-flex p-2">
              <div
                className="chart-container"
                style={{
                  flex: "1 1 auto",
                  maxHeight: "30vh",
                  borderRadius: "0px",
                  backgroundColor: "white",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "silver",
                }}
              >
                {resistanceDataSensor1 && (
                  <LineChart
                    lineChartConfig={electricalResistanceConfig}
                    lineData={resistanceDataSensor1}
                    trees={trees}
                    selectedTree={selectedTree}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Fourth row - precipitation data */}
          <div className="row " style={{ flex: "1 1 auto" }}>
            <div className="col-xs-12 d-flex p-2">
              <div
                className="chart-container"
                style={{
                  flex: "1 1 auto",
                  maxHeight: "30vh",
                  borderRadius: "0px",
                  backgroundColor: "white",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "silver",
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

          {/* Fifth row - temperature from weather station */}
          <div className="row " style={{ flex: "1 1 auto" }}>
            <div className="col-xs-12 d-flex p-2 ">
              <div
                className="chart-container"
                style={{
                  flex: "1 1 auto",
                  maxHeight: "30vh",
                  borderRadius: "0px",
                  backgroundColor: "white",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "silver",
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

          <WeatherSubpage />
        </React.Fragment>
      )}
    </div>
  );
};

export default TreeMonitoringSubpage;
