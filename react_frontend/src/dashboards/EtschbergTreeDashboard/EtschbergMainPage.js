import React, { useState, useEffect } from "react";
import axios from "axios";
import { ReactSVG } from "react-svg";
// import { ReactComponent as EtschbergHeatMap } from "../../assets/etschberg_heatmap.svg";
import EtschbergMap from "./EtschbergOSMMap/EtschbergMap";
import MultiLineChartEtschberg from "./EtschbergMultiLineChart/EtschbergMultilineChart";
import { useWeatherStationPrecipitation } from "../../hooks/weatherStation/WeatherStationPrecipitation ";
import BarChart from "../../components/BarChart";
import { precipitationConfig } from "../../chartsConfig/chartsConfig";
import { Bar } from "react-chartjs-2";
import SmallMap from "./SmallMap/SmallMap";
import TreeCard from "./EtschbergTreeIllustrationWithStatus/EtschbergTreeIllustrationWithStatus";

const API_URL = process.env.REACT_APP_API_URL.endsWith("/")
  ? process.env.REACT_APP_API_URL
  : `${process.env.REACT_APP_API_URL}/`;

const EtschbergDashboard = () => {
  const [isLoading, setIsLoading] = useState(true); // Start as loading

  //precipitation data from the weather station
  const { weatherStationPrecipitationData } = useWeatherStationPrecipitation();

  const [soilMoistureEtschberg1, setSoilMoistureEtschberg1] = useState([]);
  const [soilMoistureEtschberg2, setSoilMoistureEtschberg2] = useState([]);
  const [soilMoistureEtschberg3, setSoilMoistureEtschberg3] = useState([]);
  const [soilMoistureEtschberg4, setSoilMoistureEtschberg4] = useState([]);
  const [soilMoistureEtschberg5, setSoilMoistureEtschberg5] = useState([]);

  const [lastValueSoilMoistureEtschberg1, setLastValueSoilMoistureEtschberg1] =
    useState(null);
  const [lastValueSoilMoistureEtschberg2, setLastValueSoilMoistureEtschberg2] =
    useState(null);
  const [lastValueSoilMoistureEtschberg3, setLastValueSoilMoistureEtschberg3] =
    useState(null);
  const [lastValueSoilMoistureEtschberg4, setLastValueSoilMoistureEtschberg4] =
    useState(null);
  const [lastValueSoilMoistureEtschberg5, setLastValueSoilMoistureEtschberg5] =
    useState(null);


    const [selectedTree, setSelectedTree] = useState(1); // Track which tree is selected, default is 1

    const handleTreeChange = (event) => {
      setSelectedTree(Number(event.target.value)); // Update selected tree based on user selection
    };


      // Get the corresponding last value based on the selected tree
  let selectedLastValue;
  let selectedTreeName;

  switch (selectedTree) {
    case 1:
      selectedLastValue = lastValueSoilMoistureEtschberg1;
      selectedTreeName = "SW";
      break;
    case 2:
      selectedLastValue = lastValueSoilMoistureEtschberg2;
      selectedTreeName = "SE";
      break;
    case 3:
      selectedLastValue = lastValueSoilMoistureEtschberg3;
      selectedTreeName = "Mitte";
      break;
    case 4:
      selectedLastValue = lastValueSoilMoistureEtschberg4;
      selectedTreeName = "NW";
      break;
    case 5:
      selectedLastValue = lastValueSoilMoistureEtschberg5;
      selectedTreeName = "NE";
      break;
    default:
      selectedLastValue = lastValueSoilMoistureEtschberg1;
      selectedTreeName = "SW";
  }



  const [timePeriod, setTimePeriod] = useState("30d");

  const fetchData = async (timeRange) => {
    try {
      const queryParam = `&time_range=${timeRange}`; // Append time range filter

      // Fetch data from all endpoints with time range applied
      const responseEtschberg1 = await axios.get(
        `${API_URL}soil-data/etschberg/?query_type=etschberg_1${queryParam}`
      );
      const responseEtschberg2 = await axios.get(
        `${API_URL}soil-data/etschberg/?query_type=etschberg_2${queryParam}`
      );
      const responseEtschberg3 = await axios.get(
        `${API_URL}soil-data/etschberg/?query_type=etschberg_3${queryParam}`
      );
      const responseEtschberg4 = await axios.get(
        `${API_URL}soil-data/etschberg/?query_type=etschberg_4${queryParam}`
      );
      const responseEtschberg5 = await axios.get(
        `${API_URL}soil-data/etschberg/?query_type=etschberg_5${queryParam}`
      );

      // Transform data for each dataset
      const transformData = (data) =>
        data.map((item) => ({
          time: item.timestamp,
          value: item.soil_moisture_value,
        }));

      const transformedEtschberg1 = transformData(responseEtschberg1.data);
      const transformedEtschberg2 = transformData(responseEtschberg2.data);
      const transformedEtschberg3 = transformData(responseEtschberg3.data);
      const transformedEtschberg4 = transformData(responseEtschberg4.data);
      const transformedEtschberg5 = transformData(responseEtschberg5.data);

      // Extract the last (newest) value from each dataset
      const getLastValue = (data) => {
        return data[data.length - 1] || { time: null, value: null }; // In case of empty data
      };

      // Set the individual state for each dataset
      setSoilMoistureEtschberg1(transformedEtschberg1);
      setSoilMoistureEtschberg2(transformedEtschberg2);
      setSoilMoistureEtschberg3(transformedEtschberg3);
      setSoilMoistureEtschberg4(transformedEtschberg4);
      setSoilMoistureEtschberg5(transformedEtschberg5);

      const lastValueEtschberg1 = getLastValue(transformedEtschberg1);
      const lastValueEtschberg2 = getLastValue(transformedEtschberg2);
      const lastValueEtschberg3 = getLastValue(transformedEtschberg3);
      const lastValueEtschberg4 = getLastValue(transformedEtschberg4);
      const lastValueEtschberg5 = getLastValue(transformedEtschberg5);

      // Set the state for the last values
      setLastValueSoilMoistureEtschberg1(lastValueEtschberg1);
      setLastValueSoilMoistureEtschberg2(lastValueEtschberg2);
      setLastValueSoilMoistureEtschberg3(lastValueEtschberg3);
      setLastValueSoilMoistureEtschberg4(lastValueEtschberg4);
      setLastValueSoilMoistureEtschberg5(lastValueEtschberg5);
    } catch (error) {
      console.error("Error fetching the water level data:", error);
    } finally {
      setIsLoading(false); // Set loading to false after data fetch
    }
  };

  // Call fetchData when the component mounts or timePeriod changes
  useEffect(() => {
    fetchData(timePeriod);
  }, [timePeriod]);

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
    setIsLoading(true); // Show loading while fetching new data
  };

  //////////////////////////////////////////////////////                             DASHBOARD                     /////////////////////////////////////////////////

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
          <div
            className="row mt-4 mb-2 rounded-3 "
            style={{ flex: "1 1 auto", minHeight: "60vh" }}
          >
            <div
              className="col-12 col-lg-8 p-2 m-2 mb-3 mb-lg-2 mb-xl-0 rounded-3 d-flex"
              style={{
                flex: "1 1 auto",
                // Remove minHeight: "60vh",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
                borderRadius: "0px",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "#FFFFFF",
                zIndex: "0",
                // Add these flexbox properties to control height based on content
                flexDirection: "column", // Stack items vertically
                alignItems: "stretch", // Make children stretch to container width
              }}
            >
<div
  style={{
    flex: "1 1 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center", // Ensure vertical centering
    width: "100%",
  }}
>
  <SmallMap 
    setSelectedTree={setSelectedTree} 
    lastValueSoilMoistureEtschberg1={lastValueSoilMoistureEtschberg1}
    lastValueSoilMoistureEtschberg2={lastValueSoilMoistureEtschberg2}
    lastValueSoilMoistureEtschberg3={lastValueSoilMoistureEtschberg3}
    lastValueSoilMoistureEtschberg4={lastValueSoilMoistureEtschberg4}
    lastValueSoilMoistureEtschberg5={lastValueSoilMoistureEtschberg5}
  />
</div>
            </div>

            <TreeCard
        selectedTreeName={selectedTreeName}
        selectedLastValue={selectedLastValue}
            />
          </div>

          {/* row with the multiline chart */}

          <div className="row  " style={{ flex: "1 1 auto" }}>
            <div className="col-12 d-flex p-2 pb-0 ">
              <div
                className="chart-container rounded-3"
                style={{
                  flex: "1 1 auto",
                  minHeight: "40vh",
                  maxHeight: "60vh",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

                  borderRadius: "0px",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "#FFFFFF",
                }}
              >
                <MultiLineChartEtschberg
                  currentPeriod={"30d"}
                  soilMoistureEtschberg1={soilMoistureEtschberg1}
                  soilMoistureEtschberg2={soilMoistureEtschberg2}
                  soilMoistureEtschberg3={soilMoistureEtschberg3}
                  soilMoistureEtschberg4={soilMoistureEtschberg4}
                  soilMoistureEtschberg5={soilMoistureEtschberg5}
                />
              </div>
            </div>
          </div>

          {/* row with the bar chart with precipitation data */}

          <div className="row mt-2  " style={{ flex: "1 1 auto" }}>
            <div className="col-xs-12 d-flex p-2 pb-0">
              <div
                className="chart-container rounded-3"
                style={{
                  flex: "1 1 auto",
                  minHeight: "40vh",
                  maxHeight: "40vh",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

                  borderRadius: "0px",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "#FFFFFF",
                }}
              >
                {weatherStationPrecipitationData && (
                  <BarChart
                    barChartConfig={precipitationConfig}
                    barChartData={weatherStationPrecipitationData}
                  />
                )}{" "}
              </div>
            </div>
          </div>

          {/* row with the osm map */}

          <div className="row mt-2 mb-5 " style={{ flex: "1 1 auto" }}>
            <div className="col-xs-12 d-flex p-2 pb-0 ">
              <div
                className="chart-container rounded-3"
                style={{
                  flex: "1 1 auto",
                  minHeight: "40vh",
                  maxHeight: "60vh",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

                  borderRadius: "0px",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "#FFFFFF",
                }}
              >
                <EtschbergMap />
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default EtschbergDashboard;
