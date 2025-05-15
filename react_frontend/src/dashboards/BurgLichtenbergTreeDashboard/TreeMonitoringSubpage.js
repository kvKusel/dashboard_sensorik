import React, { useEffect, useState } from "react";
import {
  fetchTreeHealthData
} from "../../chartsConfig/apiCalls";
import {
  electricalResistanceConfig,
  precipitationConfig,
  soilMoistureConfig,
  temperatureConfig,
  treeMoistureContentLineChartConfig,
} from "../../chartsConfig/chartsConfig";
import BarChart from "../../components/BarChart";
import LineChart from "../../components/LineChart";
import { useFetchSoilMoistureDataCoxOrangenrenette } from "../../hooks/soilMoisture/CoxOrangenrenette";
import { useFetchSoilMoistureDataJonathan } from "../../hooks/soilMoisture/Jonathan";
import { useFetchSoilMoistureDataPleinerMostbirne } from "../../hooks/soilMoisture/PleinerMostbirne";
import { useFetchSoilMoistureDataRoterBoskoop } from "../../hooks/soilMoisture/RoterBoskoop";
import { useFetchSoilMoistureDataSchoenerVonNordhausen } from "../../hooks/soilMoisture/SchoenerVonNordhausen";
import { useWeatherStationPrecipitation } from "../../hooks/weatherStation/WeatherStationPrecipitation ";
import { useWeatherStationTemperature } from "../../hooks/weatherStation/WeatherStationTemperatureData";
import TreeInfoContainer from "./TreeInfoContainer";

import { useFetchResistanceDataCoxOrangenrenette } from "../../hooks/treeSense/CoxOrangenrenetteTS";

import { useFetchTreeMoistureContentDataCoxOrangenrenette } from "../../hooks/treeSense/CoxOrangenrenetteMoistureContent";


const TreeMonitoringSubpage = ({ run, setRun, steps }) => {
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

  /////////////////////////                     update the state, by using hooks (from hooks subfolder) that make api calls:     ///////////////////////////////////////

  //precipitation data from the weather station
  const {
    weatherStationPrecipitationData,
    lastTimestampFormatted,
    lastPrecipitationValue,
  } = useWeatherStationPrecipitation();

  //temperature data from the weather station
  const { weatherStationTemperatureData, lastValueWeatherStationTemperature } =
    useWeatherStationTemperature();

  // soil moisture - "Cox Orangenrenette"
  const {
    soilMoistureDataCoxOrangenrenette,
    lastValueSoilMoistureCoxOrangenrenette,
  } = useFetchSoilMoistureDataCoxOrangenrenette();

  // soil moisture - "Pleiner Mostbirne"
  const {
    soilMoistureDataPleinerMostbirne,
    lastValueSoilMoisturePleinerMostbirne,
  } = useFetchSoilMoistureDataPleinerMostbirne();

  // soil moisture - "Roter Boskoop"
  const { soilMoistureDataRoterBoskoop, lastValueSoilMoistureRoterBoskoop } =
    useFetchSoilMoistureDataRoterBoskoop();

  // soil moisture - "SchoenerVonNordhausen"
  const {
    soilMoistureDataSchoenerVonNordhausen,
    lastValueSoilMoistureSchoenerVonNordhausen,
  } = useFetchSoilMoistureDataSchoenerVonNordhausen();

  // soil moisture - "Jonathan"
  const { soilMoistureDataJonathan, lastValueSoilMoistureJonathan } =
    useFetchSoilMoistureDataJonathan();

  // Resistance Data and Tree Water Content Data  - "Cox Orangenrenette"
  const resistanceDataCoxOrangenrenette =
    useFetchResistanceDataCoxOrangenrenette();

  const treeMoistureContentDataCoxOrangenrenette =
    useFetchTreeMoistureContentDataCoxOrangenrenette();

  /////////////////////////                 End of updating the state by using hooks (from hooks subfolder) that make api calls     ///////////////////////////////////////

  const [selectedTree, setSelectedTree] = useState(null);

  const handleTreeSelection = (tree) => {
    setSelectedTree(tree);
  };

  const [lastValuesSoilMoisture, setLastValuesSoilMoisture] = useState([]);

  // General tree health

  const [
    treeSenseCoxOrangenrenetteGeneralHealth,
    setTreeSenseCoxOrangenrenetteGeneralHealth,
  ] = useState();

  const [
    treeSensePleinerMostbirneGeneralHealth,
    setTreeSensePleinerMostbirneGeneralHealth,
  ] = useState();

  const [
    treeSenseSchoenerVonNordhausenGeneralHealth,
    setTreeSenseSchoenerVonNordhauseneGeneralHealth,
  ] = useState();

  const [generalTreeHealthList, setGeneralTreeHealthList] = useState([]);

  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);

  // Execute the API calls and fetch the needed data
  useEffect(() => {
    if (
      lastValueSoilMoistureCoxOrangenrenette !== null &&
      lastValueSoilMoisturePleinerMostbirne !== null &&
      lastValueSoilMoistureRoterBoskoop !== null &&
      lastValueSoilMoistureSchoenerVonNordhausen !== null &&
      lastValueSoilMoistureJonathan !== null &&
      resistanceDataCoxOrangenrenette !== null &&
      treeMoistureContentDataCoxOrangenrenette !== null &&
      weatherStationTemperatureData !== null &&
      weatherStationPrecipitationData !== null
    ) {
      // Extracting the last value from each dataset, will be used to render icon colors on the map
      const lastValueSoilMoisture = [
        lastValueSoilMoistureCoxOrangenrenette,
        lastValueSoilMoisturePleinerMostbirne,
        lastValueSoilMoistureRoterBoskoop,
        lastValueSoilMoistureSchoenerVonNordhausen,
        lastValueSoilMoistureJonathan,
      ];

      if (lastValuesSoilMoisture.every((value) => !isNaN(value))) {
        setLastValuesSoilMoisture(lastValueSoilMoisture);
      }

      const fetchData = async () => {
        try {
          const deviceIdCoxOrangenrenette = "A84041B42187E5C6"; // Cox Orangenrenette Device ID
          const deviceIdCoxPleinerMostbirne = "A840418F1187E5C4"; // Cox Orangenrenette Device ID
          const deviceIdSchoenerVonNordhausen = "A840414A6187E5C5"; // Cox Orangenrenette Device ID

          // General tree health
          const treeSenseGeneralHealthDataCoxOrangenrenette =
            await fetchTreeHealthData(deviceIdCoxOrangenrenette);
          setTreeSenseCoxOrangenrenetteGeneralHealth(
            treeSenseGeneralHealthDataCoxOrangenrenette
          );

          const treeSenseGeneralHealthDataPleinerMostbirne =
            await fetchTreeHealthData(deviceIdCoxPleinerMostbirne);
          setTreeSensePleinerMostbirneGeneralHealth(
            treeSenseGeneralHealthDataPleinerMostbirne
          );

          const treeSenseGeneralHealthDataSchoenerVonNordhausen =
            await fetchTreeHealthData(deviceIdSchoenerVonNordhausen);
          setTreeSenseSchoenerVonNordhauseneGeneralHealth(
            treeSenseGeneralHealthDataSchoenerVonNordhausen
          );

          setIsLoading(false); // Set loading to false once data is fetched
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false); // Set loading to false in case of error
        }
      };

      fetchData();
    }
  }, [
    lastValueSoilMoistureCoxOrangenrenette,
    lastValueSoilMoisturePleinerMostbirne,
    lastValueSoilMoistureSchoenerVonNordhausen,
    lastValueSoilMoistureJonathan,
    weatherStationTemperatureData,
    lastValueWeatherStationTemperature,
  ]);

  useEffect(() => {

    let treeSenseGeneralHealthDataList = [];


    if (
      treeSenseCoxOrangenrenetteGeneralHealth !== null &&
      treeSensePleinerMostbirneGeneralHealth !== null &&
      treeSenseSchoenerVonNordhausenGeneralHealth !== null
    ) {
      // Extracting the last value from each dataset, will be used to render icon colors on the map
       treeSenseGeneralHealthDataList = [
        treeSenseCoxOrangenrenetteGeneralHealth,
        treeSensePleinerMostbirneGeneralHealth,
        treeSenseSchoenerVonNordhausenGeneralHealth,
      ];
    }

    if (
      treeSenseGeneralHealthDataList.length === 3 &&
      treeSenseGeneralHealthDataList[0] && treeSenseGeneralHealthDataList[0].length > 0 &&
      treeSenseGeneralHealthDataList[1] && treeSenseGeneralHealthDataList[1].length > 0 &&
      treeSenseGeneralHealthDataList[2] && treeSenseGeneralHealthDataList[2].length > 0
    ) {

      
    // You can access the latest (newest) status here if needed
    const healthStatusList = treeSenseGeneralHealthDataList.map(dataset => dataset[0].status);
    

    setGeneralTreeHealthList(healthStatusList);

      }



  }, [
    treeSenseCoxOrangenrenetteGeneralHealth,
    treeSensePleinerMostbirneGeneralHealth,
    treeSenseSchoenerVonNordhausenGeneralHealth,
  ]);




  // Set a timeout to check if isLoading is stuck
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        // Handle the timeout situation, you can either refresh or show an error message
        window.location.reload(); // Refresh the page
        // Or you can show an error message:
        // setIsLoading(false);
        // alert("Loading data is taking longer than expected. Please try again later.");
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(loadingTimeout); // Clear the timeout if the component unmounts or isLoading changes
  }, [isLoading]);

  return (
    <div style={{ minHeight: "80vh" }} className="first-step">
      {/* Display loading indicator while data is being fetched */}
      {isLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
            color: "#18204F",
          }}
        >
          <p className="fs-1">Sensordaten werden geladen...</p>
        </div>
      )}

      {/* Only render the charts once the data has been fetched */}
      {!isLoading && (
        <React.Fragment>
          {/* First row - map and tree info */}
          {/* {soilMoistureDataPleinerMostbirne && soilMoistureDataJonathan && 
            treeSenseCoxOrangenrenetteGeneralHealth && ( */}
          <div>
            <TreeInfoContainer
              trees={trees}
              selectedTree={selectedTree}
              handleTreeSelection={handleTreeSelection}
              soilMoistureData={
                selectedTree && selectedTree.id === 1
                  ? soilMoistureDataPleinerMostbirne
                  : selectedTree && selectedTree.id === 2
                  ? soilMoistureDataSchoenerVonNordhausen
                  : selectedTree && selectedTree.id === 3
                  ? soilMoistureDataRoterBoskoop
                  : selectedTree && selectedTree.id === 4
                  ? soilMoistureDataCoxOrangenrenette
                  : selectedTree && selectedTree.id === 5
                  ? soilMoistureDataJonathan
                  : //else / default
                    [soilMoistureDataPleinerMostbirne]
              }
              lastValuesSoilMoisture={lastValuesSoilMoisture}
              treeSenseGeneralHealthData={
                generalTreeHealthList
              }
              run={run}
              setRun={setRun}
              steps={steps}
            />
          </div>
          {/* Second row - soil moisture data */}
          <div className="row " style={{ flex: "1 1 auto" }}>
            <div className="col-xs-12 d-flex p-2 ">
              <div
                className="chart-container step-4 rounded-3"
                style={{
                  flex: "1 1 auto",
                  maxHeight: "30vh",
                  borderRadius: "0px",
                  backgroundColor: "#FFFFFF",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "#FFFFFF",
                  boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

                }}
              >
                {/* {soilMoistureDataPleinerMostbirne && soilMoistureDataJonathan &&( */}
                <LineChart
                  lineChartConfig={soilMoistureConfig}
                  lineData={
                    selectedTree && selectedTree.id === 1
                      ? soilMoistureDataPleinerMostbirne
                      : selectedTree && selectedTree.id === 2
                      ? soilMoistureDataSchoenerVonNordhausen
                      : selectedTree && selectedTree.id === 3
                      ? soilMoistureDataRoterBoskoop
                      : selectedTree && selectedTree.id === 4
                      ? soilMoistureDataCoxOrangenrenette
                      : selectedTree && selectedTree.id === 5
                      ? soilMoistureDataJonathan
                      : //else / default
                        [soilMoistureDataPleinerMostbirne]
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
                className="chart-container rounded-3"
                style={{
                  flex: "1 1 auto",
                  maxHeight: "30vh",
                  borderRadius: "0px",
                  backgroundColor: "#FFFFFF",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "#FFFFFF",
                  boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

                }}
              >
                <LineChart
                  lineChartConfig={treeMoistureContentLineChartConfig}
                  lineData={treeMoistureContentDataCoxOrangenrenette}
                  trees={trees}
                  selectedTree={selectedTree}
                  id="treesense"
                />
              </div>
            </div>
          </div>

          {/* fourth row - tree crown electrical resistance data */}
          <div className="row " style={{ flex: "1 1 auto" }}>
            <div className="col-xs-12 d-flex p-2">
              <div
                className="chart-container rounded-3"
                style={{
                  flex: "1 1 auto",
                  maxHeight: "30vh",
                  borderRadius: "0px",
                  backgroundColor: "#FFFFFF",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "#FFFFFF",
                  boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

                }}
              >
                <LineChart
                  lineChartConfig={electricalResistanceConfig}
                  lineData={resistanceDataCoxOrangenrenette}
                  trees={trees}
                  selectedTree={selectedTree}
                  id="treesense"

                />
              </div>
            </div>
          </div>

          {/* fifth row - precipitation data */}
          <div className="row " style={{ flex: "1 1 auto" }}>
            <div className="col-xs-12 d-flex p-2">
              <div
                className="chart-container rounded-3"
                style={{
                  flex: "1 1 auto",
                  maxHeight: "30vh",
                  borderRadius: "0px",
                  backgroundColor: "#FFFFFF",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "#FFFFFF",
                  boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

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

          {/* sixth row - temperature from weather station */}
          <div
            className="row "
            style={{ flex: "1 1 auto", marginBottom: "15px" }}
          >
            <div className="col-xs-12 d-flex p-2 ">
              <div
                className="chart-container rounded-3"
                style={{
                  flex: "1 1 auto",
                  maxHeight: "30vh",
                  borderRadius: "0px",
                  backgroundColor: "#FFFFFF",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "#FFFFFF",
                  boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

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

        </React.Fragment>
      )}
    </div>
  );
};

export default TreeMonitoringSubpage;
