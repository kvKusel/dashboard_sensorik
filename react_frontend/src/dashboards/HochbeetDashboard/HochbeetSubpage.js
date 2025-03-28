import axios from "axios";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  pHConfig,
  precipitationConfig,
  soilMoistureConfig,
  soilMoistureGaugeChartConfig,
} from "../../chartsConfig/chartsConfig";
import BarChart from "../../components/BarChart";
import LineChart from "../../components/LineChart";
import Gauge from "../../components/DoughnutChart";
import { useWeatherStationPrecipitation } from "../../hooks/weatherStation/WeatherStationPrecipitation ";
import { useWeatherStationTemperature } from "../../hooks/weatherStation/WeatherStationTemperatureData";
import HochbeetTable from "./HochbeetTable";
import HochbeetMap from "./HochbeetMap";

const API_URL = process.env.REACT_APP_API_URL;

const HochbeetDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allSoilMoistureDataGymnasium, setAllSoilMoistureDataGymnasium] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState([]);
  const [lastValue, setLastValue] = useState(null);
  const [allPHData, setAllPHData] = useState([]);
  const [lastPHValue, setLastPHValue] = useState(null);
  const [weatherStationGymnasiumPrecipitationData, setWeatherStationGymnasiumPrecipitationData] = useState([]);

  // Memoized function to get last value
  const getLastValue = useCallback((data) => {
    return data.length > 0 ? data[data.length - 1].value : null;
  }, []);

  // Fetch all data concurrently
  const fetchAllData = useCallback(async () => {
    try {
      const [
        weatherResponse,
        soilMoistureResponses,
        phDataResponses
      ] = await Promise.all([
        axios.get(`${API_URL}/weather-data-gymnasium/`),
        Promise.all([
          axios.get(`${API_URL}/soil-moisture-data-hochbeet-project/?query_type=hochbeet_moisture1`),
          axios.get(`${API_URL}/soil-moisture-data-hochbeet-project/?query_type=moisture_dragino_2`),
          axios.get(`${API_URL}/soil-moisture-data-hochbeet-project/?query_type=moisture_dragino_3`),
          axios.get(`${API_URL}/soil-moisture-data-hochbeet-project/?query_type=moisture_dragino_4`),
          axios.get(`${API_URL}/soil-moisture-data-hochbeet-project/?query_type=moisture_dragino_5`),
          axios.get(`${API_URL}/soil-moisture-data-hochbeet-project/?query_type=moisture_dragino_6`)
        ]),
        Promise.all([
          axios.get(`${API_URL}/ph-data/?query_type=ph_dragino_1`),
          axios.get(`${API_URL}/ph-data/?query_type=ph_dragino_2`),
          axios.get(`${API_URL}/ph-data/?query_type=ph_sensecap_2`),
          axios.get(`${API_URL}/ph-data/?query_type=ph_sensecap_1`)
        ])
      ]);

      // Process precipitation data
      const precipitationData = weatherResponse.data.weather_data.map((entry) => ({
        time: entry.timestamp,
        value: entry.precipitation,
      }));
      setWeatherStationGymnasiumPrecipitationData(precipitationData);

      // Process soil moisture data
      setAllSoilMoistureDataGymnasium([
        { queryType: "hochbeet_moisture1", data: soilMoistureResponses[0].data },
        { queryType: "moisture_dragino_2", data: soilMoistureResponses[1].data },
        { queryType: "moisture_dragino_3", data: soilMoistureResponses[2].data },
        { queryType: "moisture_dragino_4", data: soilMoistureResponses[3].data },
        { queryType: "moisture_dragino_5", data: soilMoistureResponses[4].data },
        { queryType: "moisture_dragino_6", data: soilMoistureResponses[5].data },
      ]);

      // Process pH data
      setAllPHData([
        { queryType: "moisture_dragino_6", data: phDataResponses[0].data },
        { queryType: "moisture_dragino_5", data: phDataResponses[1].data },
        { queryType: "hochbeet_moisture1", data: phDataResponses[2].data },
        { queryType: "moisture_dragino_3", data: phDataResponses[3].data },
      ]);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  }, []);

  // Memoized derived values to prevent unnecessary re-renders
  const moistureValues = useMemo(() => 
    allSoilMoistureDataGymnasium.map((item) => ({
      queryType: item.queryType,
      value: getLastValue(item.data),
    })),
    [allSoilMoistureDataGymnasium, getLastValue]
  );

  const phValues = useMemo(() => 
    allPHData.map((item) => ({
      queryType: item.queryType,
      value: getLastValue(item.data),
    })),
    [allPHData, getLastValue]
  );

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Handle row click for selecting dataset
  const handleRowClick = useCallback((queryType) => {
    const selectedData = allSoilMoistureDataGymnasium.find(
      (item) => item.queryType === queryType
    );
    setSelectedDataset(selectedData ? selectedData.data : null);

    const selectedPHData = allPHData.find(
      (item) => item.queryType === queryType
    );

    if (selectedPHData && selectedPHData.data.length > 0) {
      const lastPHDataPoint = selectedPHData.data[selectedPHData.data.length - 1];
      setLastPHValue(lastPHDataPoint ? lastPHDataPoint.ph_value : null);
    } else {
      setLastPHValue(null);
    }
  }, [allSoilMoistureDataGymnasium, allPHData]);

  // Update last value when selected dataset changes
  useEffect(() => {
    if (selectedDataset && selectedDataset.length > 0) {
      const lastDataPoint = selectedDataset[selectedDataset.length - 1];
      setLastValue(lastDataPoint.value);
    }
  }, [selectedDataset]);

  // Rest of the component remains the same...
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
            color: "#18204F",
          }}
        >
          <p className="fs-1">Sensordaten werden geladen...</p>
        </div>
      )}

      {!isLoading && (
        <React.Fragment>
          <div className="row mt-4" style={{ flex: "1 1 auto" }}>
            <div
              className="col-12 col-md-3 p-0 mb-3 mx-2 rounded-3"
              style={{
                flex: "1 1 auto",
                boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
                backgroundColor: "#FFF",
                // borderRadius: "0px",
                // borderStyle: "solid",
                // borderWidth: "1px",
                // borderColor: "#5D7280",
                zIndex: "0", //add this to make sure the controls of the map are underneath the dropdown elements (Dropdown is directly above the map)
              }}
            >
              <HochbeetTable
                onRowClick={handleRowClick}
                moistureValues={moistureValues}
                phValues={phValues}
              />
            </div>

            <div
              className="col-12 col-md-8 p-2 mb-3 mx-2  rounded-3"
              style={{
                flex: "1 1 auto",
                boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

                backgroundColor: "#FFF",
                // borderRadius: "0px",
                // borderStyle: "solid",
                // borderWidth: "1px",
                // borderColor: "#5D7280",

                zIndex: "0", //add this to make sure the controls of the map are underneath the dropdown elements (Dropdown is directly above the map)
              }}
            >
              <HochbeetMap />
            </div>
          </div>

          <div className="row mb-0" style={{ flex: "1 1 auto" }}>
            <div
              className="col-12 col-md-3 p-0 mb-3 mx-2 order-3 order-md-1 d-flex flex-column align-items-center justify-content-center rounded-3"
              style={{
                flex: "1 1 auto",
                boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

                backgroundColor: "#FFF",

                maxHeight: "30vh",
                // minHeight: "300px",
                zIndex: "0", //add this to make sure the controls of the map are underneath the dropdown elements (Dropdown is directly above the map)
              }}
            >
              <Gauge
                config={soilMoistureGaugeChartConfig}
                currentValue={lastValue}
                classAsProp="gaugeChartsTrees"
              />
              <p
                className="d-flex flex-column align-items-center justify-content-center text-center px-2 "
                style={{ flex: "0.1 0.1 auto", color: "#18204F" }}
              >
                Bodenfeuchte:
                <br />
                <strong>
                  {lastValue <= 10
                    ? "Trockenstress"
                    : lastValue > 10 && lastValue < 20
                    ? "Leichter Trockenstress"
                    : "kein Trockenstress"}
                </strong>
              </p>
            </div>

            <div
              className="col-12 col-md-8 p-2 mb-3 mx-2 order-1 order-md-2 rounded-3"
              style={{
                flex: "1 1 auto",
                boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

                backgroundColor: "#FFF",
                // minHeight: "300px",
                maxHeight: "30vh",
              }}
            >
              <LineChart
                lineChartConfig={soilMoistureConfig}
                lineData={selectedDataset}
              />
            </div>

            <div
              className="col-12 col-md-3 p-0 mb-3 mx-2 order-4 order-md-3 d-flex flex-column align-items-center justify-content-center rounded-3"
              style={{
                flex: "1 1 auto",
                boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

                backgroundColor: "#FFF",

                maxHeight: "30vh",
                // minHeight: "300px",
                zIndex: "0", //add this to make sure the controls of the map are underneath the dropdown elements (Dropdown is directly above the map)
              }}
            >
              <Gauge
                config={pHConfig}
                currentValue={lastPHValue}
                classAsProp="gaugeChartsTrees"
                id={"pH"}
              />
              <p
                className="d-flex flex-column align-items-center justify-content-center text-center px-2 "
                style={{ flex: "0.1 0.1 auto", color: "#18204F" }}
              >
                pH:
                <strong>
                  <strong>{lastPHValue !== null ? lastPHValue : "-"}</strong>
                </strong>
              </p>
            </div>

            <div
              className="col-12 col-md-8 p-2 mb-3 mx-2 order-2 order-md-4 rounded-3"
              style={{
                flex: "1 1 auto",
                boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

                backgroundColor: "#FFF",

                maxHeight: "30vh",
                // minHeight: "300px",
              }}
            >
              {weatherStationGymnasiumPrecipitationData && (
                <BarChart
                  barChartConfig={precipitationConfig}
                  barChartData={weatherStationGymnasiumPrecipitationData}
                />
              )}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default HochbeetDashboard;