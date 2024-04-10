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

  const [
    soilMoistureDataPleinerMostbirne,
    setSoilMoistureDataPleinerMostbirne,
  ] = useState([]);
  const [soilMoistureDataRoterBoskoop, setSoilMoistureDataRoterBoskoop] =
    useState([]);
  const [
    soilMoistureDataSchoenerVonNordhausen,
    setSoilMoistureDataSchoenerVonNordhausen,
  ] = useState([]);
  const [soilMoistureDataJonathan, setSoilMoistureDataJonathan] = useState([]);
  const [
    soilMoistureDataCoxOrangenrenette,
    setSoilMoistureDataCoxOrangenrenette,
  ] = useState([]);

  const [lastValuesSoilMoisture, setLastValuesSoilMoisture] = useState([]);

  const [weatherStationPrecipitationData, setWeatherStationPrecipitationData] =
    useState([]);

  const [weatherStationTemperatureData, setWeatherStationTemperatureData] =
    useState([]);

  const [
    lastTimestampWeatherStationFormatted,
    setLastTimestampWeatherStationFormatted,
  ] = useState("");

  const [
    lastValueWeatherStationPrecipitation,
    setLastValueWeatherStationPrecipitation,
  ] = useState("");

  const [
    lastValueWeatherStationTemperature,
    setLastValueWeatherStationTemperature,
  ] = useState("");

  const [resistanceDataSensor1, setResistanceDataSensor1] = useState([]);

  // General tree health

  const [
    treeSenseCoxOrangenrenetteGeneralHealth,
    setTreeSenseCoxOrangenrenetteGeneralHealth,
  ] = useState([]);

  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  // Execute the API calls and fetch the needed data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Soil moisture data
        const soilMoistureDataSensorPleinerMostbirne =
          await fetchSoilMoistureData("pleiner_mostbirne");
        const soilMoistureDataSensorRoterBoskoop = await fetchSoilMoistureData(
          "roter_boskoop"
        );
        const soilMoistureDataSensorSchoenerVonNordhausen =
          await fetchSoilMoistureData("schoener_von_nordhausen");
        const soilMoistureDataSensorJonathan = await fetchSoilMoistureData(
          "jonathan"
        );
        const soilMoistureDataSensorCoxOrangenrenette =
          await fetchSoilMoistureData("cox_orangenrenette");

        setSoilMoistureDataPleinerMostbirne(
          soilMoistureDataSensorPleinerMostbirne
        );
        setSoilMoistureDataRoterBoskoop(soilMoistureDataSensorRoterBoskoop);
        setSoilMoistureDataSchoenerVonNordhausen(
          soilMoistureDataSensorSchoenerVonNordhausen
        );
        setSoilMoistureDataJonathan(soilMoistureDataSensorJonathan);
        setSoilMoistureDataCoxOrangenrenette(
          soilMoistureDataSensorCoxOrangenrenette
        );

        // Extracting the last value from each dataset, will be used to render icon colors on the map
        const lastValueSoilMoisture = [
          parseFloat(
            soilMoistureDataSensorPleinerMostbirne[
              soilMoistureDataSensorPleinerMostbirne.length - 1
            ].value
          ),
          parseFloat(
            soilMoistureDataSensorRoterBoskoop[
              soilMoistureDataSensorRoterBoskoop.length - 1
            ].value
          ),
          parseFloat(
            soilMoistureDataSensorSchoenerVonNordhausen[
              soilMoistureDataSensorSchoenerVonNordhausen.length - 1
            ].value
          ),
          parseFloat(
            soilMoistureDataSensorJonathan[
              soilMoistureDataSensorJonathan.length - 1
            ].value
          ),
          parseFloat(
            soilMoistureDataSensorCoxOrangenrenette[
              soilMoistureDataSensorCoxOrangenrenette.length - 1
            ].value
          ),
        ];

        if (lastValuesSoilMoisture.every((value) => !isNaN(value))) {
          setLastValuesSoilMoisture(lastValueSoilMoisture);
        }

        // General tree health
        const treeSenseGeneralHealthData = await fetchTreeHealthData();
        setTreeSenseCoxOrangenrenetteGeneralHealth(treeSenseGeneralHealthData);

        const resistanceDataFetched = await fetchResistanceData();

        const weatherStationPrecipitationDataFetched =
          await fetchWeatherStationData("precipitation");
        const weatherStationTemperatureDataFetched =
          await fetchWeatherStationData("temperature");

        // get and set the date and time of the last measurement, will be displayed in the weather station section
        const lastTimestampWeatherStation =
          weatherStationPrecipitationDataFetched[
            weatherStationPrecipitationDataFetched.length - 1
          ].time;

        const lastTimestampWeatherStationAsDate = new Date(
          lastTimestampWeatherStation
        );
        const lastTimestampWeatherStationFormatted = `${(
          "0" + lastTimestampWeatherStationAsDate.getDate()
        ).slice(-2)}/${(
          "0" +
          (lastTimestampWeatherStationAsDate.getMonth() + 1)
        ).slice(-2)}/${lastTimestampWeatherStationAsDate.getFullYear()} um ${(
          "0" + lastTimestampWeatherStationAsDate.getHours()
        ).slice(-2)}:${(
          "0" + lastTimestampWeatherStationAsDate.getMinutes()
        ).slice(-2)}`;
        setLastTimestampWeatherStationFormatted(
          lastTimestampWeatherStationFormatted
        );

        // get and set the last precipitation value, will be displayed in the weather station section
        const lastEntryWeatherStationPrecipitation =
          weatherStationPrecipitationDataFetched[
            weatherStationPrecipitationDataFetched.length - 1
          ].value;

        setLastValueWeatherStationPrecipitation(lastEntryWeatherStationPrecipitation)  

        // get and set the last temperature value, will be displayed in the weather station section
        const lastEntryWeatherStationTemperature =
        weatherStationTemperatureDataFetched[
          weatherStationTemperatureDataFetched.length - 1
        ].value;
                
        setLastValueWeatherStationTemperature(lastEntryWeatherStationTemperature) 




        setResistanceDataSensor1(resistanceDataFetched);
        setWeatherStationPrecipitationData(
          weatherStationPrecipitationDataFetched
        );
        setWeatherStationTemperatureData(weatherStationTemperatureDataFetched);

        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        console.log("Precipitation data:", weatherStationPrecipitationData);
        setIsLoading(false); // Set loading to false in case of error
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
          {/* {soilMoistureDataPleinerMostbirne && soilMoistureDataJonathan && 
            treeSenseCoxOrangenrenetteGeneralHealth && ( */}
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

          <WeatherSubpage
            lastMeasurementTime={lastTimestampWeatherStationFormatted}
            precipitation={lastValueWeatherStationPrecipitation}
            temperature={lastValueWeatherStationTemperature}
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default TreeMonitoringSubpage;
