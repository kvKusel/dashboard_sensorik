import React, { useState, useEffect } from "react";
import axios, { all } from "axios";
import HochbeetTable from "./HochbeetTable"
import LeafletMap from "../LeafletMap";
import LineChart from "../LineChart";
import BarChart from "../BarChart";
import Gauge from "../DoughnutChart";
import { useWeatherStationTemperature } from "../../../../hooks/weatherStation/WeatherStationTemperatureData";
import { useWeatherStationPrecipitation } from "../../../../hooks/weatherStation/WeatherStationPrecipitation ";
import {
  precipitationConfig,
  temperatureConfig,
  soilMoistureConfig,
  electricalResistanceConfig,
  treeMoistureContentLineChartConfig,
  pHConfig,
  soilMoistureGaugeChartConfig
} from "../../../../chartsConfig/chartsConfig";

import HochbeetMap from "./HochbeetMap";

const API_URL = process.env.REACT_APP_API_URL; // This will switch based on the environment - dev env will point to local Django, prod env to the proper domain


const HochbeetDashboard = () => {

  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  const [allSoilMoistureDataGymnasium, setAllSoilMoistureDataGymnasium] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState([]);
  const [lastValue, setLastValue] = useState(null);

  //pH
  const [allPHData, setAllPHData] = useState([]);
  const [lastPHValue, setLastPHValue] = useState(null);


  const [
    weatherStationGymnasiumPrecipitationData,
    setWeatherStationGymnasiumPrecipitationData,
  ] = useState([]);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/weather-data-gymnasium/`);
        const data = response.data;

        // Extract precipitation data
        const precipitationData = data.weather_data.map((entry) => ({
          time: entry.timestamp,
          value: entry.precipitation,
        }));

        setWeatherStationGymnasiumPrecipitationData(precipitationData)
      } catch (error) {
        console.error("Error fetching the weather data:", error);
      }
    };

    fetchData();
  }, []);




  const fetchAllSoilMoistureGymnasiumData = async () => {
    try {
      const response1 = await axios.get(`${API_URL}/soil-moisture-data-hochbeet-project/?query_type=hochbeet_moisture1`);
      const response2 = await axios.get(`${API_URL}/soil-moisture-data-hochbeet-project/?query_type=moisture_dragino_2`);
      const response3 = await axios.get(`${API_URL}/soil-moisture-data-hochbeet-project/?query_type=moisture_dragino_3`);
      const response4 = await axios.get(`${API_URL}/soil-moisture-data-hochbeet-project/?query_type=moisture_dragino_4`);
      const response5 = await axios.get(`${API_URL}/soil-moisture-data-hochbeet-project/?query_type=moisture_dragino_5`);
      const response6 = await axios.get(`${API_URL}/soil-moisture-data-hochbeet-project/?query_type=moisture_dragino_6`);
      
      setAllSoilMoistureDataGymnasium([
        { queryType: 'hochbeet_moisture1', data: response1.data },
        { queryType: 'moisture_dragino_2', data: response2.data },
        { queryType: 'moisture_dragino_3', data: response3.data },
        { queryType: 'moisture_dragino_4', data: response4.data },
        { queryType: 'moisture_dragino_5', data: response5.data },
        { queryType: 'moisture_dragino_6', data: response6.data },
      ]);

 
      
    } catch (error) {
      console.error("Error fetching soil moisture data:", error);
    }
  };


  const fetchAllPHData = async () => {
    try {
      const response1 = await axios.get(`${API_URL}/ph-data/?query_type=ph_dragino_1`);
      const response2 = await axios.get(`${API_URL}/ph-data/?query_type=ph_dragino_2`);
      const response3 = await axios.get(`${API_URL}/ph-data/?query_type=ph_sensecap_2`);
      const response4 = await axios.get(`${API_URL}/ph-data/?query_type=ph_sensecap_1`);

      setAllPHData([
        { queryType: 'moisture_dragino_6', data: response1.data }, //'ph_dragino_1'
        { queryType: 'moisture_dragino_5', data: response2.data },//'ph_dragino_2'
        { queryType: 'hochbeet_moisture1', data: response3.data },//'ph_sensecap_2'
        { queryType: 'moisture_dragino_3', data: response4.data },//'ph_sensecap_1'
      ]);

    } catch (error) {
      console.error("Error fetching pH data:", error);
    }
  };


  const getLastValue = (data) => {
    if (data.length > 0) {
      return data[data.length - 1].value;
    }
    return null;
  };

  const moistureValues = allSoilMoistureDataGymnasium.map((item) => ({
    queryType: item.queryType,
    value: getLastValue(item.data),
  }));

  const phValues = allPHData.map((item) => ({
    queryType: item.queryType,
    value: getLastValue(item.data),
  }));

  useEffect(() => {
    fetchAllSoilMoistureGymnasiumData();
    fetchAllPHData();
  }, []);

  useEffect(() => {
  }, [allSoilMoistureDataGymnasium]);

  useEffect(() => {
  }, [allPHData]);

  useEffect(() => {
  }, [selectedDataset]);

  useEffect(() => {
  }, [lastPHValue]);

  const handleRowClick = (queryType) => {

    const selectedData = allSoilMoistureDataGymnasium.find(item => item.queryType === queryType);
    setSelectedDataset(selectedData ? selectedData.data : null);

    const selectedPHData = allPHData.find(item => item.queryType === queryType);
    
    if (selectedPHData && selectedPHData.data.length > 0) {
      const lastPHDataPoint = selectedPHData.data[selectedPHData.data.length - 1];
      setLastPHValue(lastPHDataPoint ? lastPHDataPoint.ph_value : null);
    } else {
      setLastPHValue(null);
    }
  };


  
  //temperature data from the Burg Lichtenberg weather station
  const { weatherStationTemperatureData } =
    useWeatherStationTemperature();

  //precipitation data from the Burg Lichtenberg weather station
  const {
    weatherStationPrecipitationData
  } = useWeatherStationPrecipitation();


 // Execute the API calls and fetch the needed data
 useEffect(() => {
  if (
    weatherStationTemperatureData !== null &&
    weatherStationPrecipitationData !== null &&
    allSoilMoistureDataGymnasium !== null &&
    allSoilMoistureDataGymnasium.length > 5 &&
    allPHData !== null &&
    moistureValues !== null &&
    phValues !== null 
 )  {

      try {        
        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set loading to false in case of error
      }
    
  }
}, [
  weatherStationTemperatureData,
  weatherStationPrecipitationData,
  allSoilMoistureDataGymnasium,
  allPHData,
  moistureValues,
  phValues
]);


// get the last value of each dataset to pass it to the gauge charts
useEffect(() => {
  if (selectedDataset && selectedDataset.length > 0) {
    const lastDataPoint = selectedDataset[selectedDataset.length - 1];
    setLastValue(lastDataPoint.value);
  }
}, [selectedDataset]);


  
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
            color: "#18204F"
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
          <HochbeetTable onRowClick={handleRowClick} moistureValues={moistureValues} phValues={phValues}/>
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
      
            maxHeight:"30vh",
            // minHeight: "300px",
            zIndex: "0", //add this to make sure the controls of the map are underneath the dropdown elements (Dropdown is directly above the map)
          }}
        >
          <Gauge config={ soilMoistureGaugeChartConfig} currentValue={lastValue} classAsProp="gaugeChartsTrees"/>
          <p className="d-flex flex-column align-items-center justify-content-center text-center px-2 " style={{flex: "0.1 0.1 auto", color: "#18204F"}}>
  Bodenfeuchte:<br />
  <strong>
  {
  lastValue <= 10 ? 'Trockenstress' : (
    lastValue > 10 && lastValue < 20 ? 'Leichter Trockenstress' : 'kein Trockenstress'
  )
}

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
            maxHeight: "30vh"
          }}
        >
        
                <LineChart
                  lineChartConfig={ soilMoistureConfig }
                  lineData={selectedDataset}
                  activeTab={"hochbeet"}
                />
           
        </div>


        <div
          className="col-12 col-md-3 p-0 mb-3 mx-2 order-4 order-md-3 d-flex flex-column align-items-center justify-content-center rounded-3" 
          style={{
            flex: "1 1 auto",
            boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

            backgroundColor: "#FFF",
 
            maxHeight:"30vh",
            // minHeight: "300px",
            zIndex: "0", //add this to make sure the controls of the map are underneath the dropdown elements (Dropdown is directly above the map)
          }}
        >
          <Gauge config={ pHConfig} currentValue={lastPHValue} classAsProp="gaugeChartsTrees" id={"pH"} />
          <p className="d-flex flex-column align-items-center justify-content-center text-center px-2 " style={{flex: "0.1 0.1 auto", color: "#18204F"}}>
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

            maxHeight:"30vh",
            // minHeight: "300px",

          }}
        >
                      {weatherStationGymnasiumPrecipitationData && (
                  <BarChart
                    barChartConfig={precipitationConfig}
                    barChartData={weatherStationGymnasiumPrecipitationData}
                  />)}
        </div>


      </div>
      
      
  </React.Fragment>
)}
        </div>












      )
    }

export default HochbeetDashboard;
