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
import { ReactComponent as TreeSVG} from "../../assets/tree.svg";

const API_URL = process.env.REACT_APP_API_URL.endsWith("/")
  ? process.env.REACT_APP_API_URL
  : `${process.env.REACT_APP_API_URL}/`;

const EtschbergDashboard = () => {
  const [isLoading, setIsLoading] = useState(true); // Start as loading

            //precipitation data from the weather station
            const {
              weatherStationPrecipitationData,
            } = useWeatherStationPrecipitation();
        


  const [waterLevelKreisverwaltung, setWaterLevelKreisverwaltung] = useState(
    []
  );
  const [waterLevelRutsweiler, setWaterLevelRutsweiler] = useState([]);
  const [waterLevelKreimbachKaulbach, setWaterLevelKreimbachKaulbach] =
    useState([]);
  const [waterLevelWolfstein, setWaterLevelWolfstein] = useState([]);

  const [timePeriod, setTimePeriod] = useState("30d");

  const fetchData = async (timeRange) => {
    try {
      const queryParam = `&time_range=${timeRange}`; // Append time range filter



      // Fetch data from all endpoints with time range applied
      const responseKreisverwaltung = await axios.get(
        `${API_URL}water-level-data/?query_type=water_level_kv${queryParam}`
      );
      const responseRutsweiler = await axios.get(
        `${API_URL}water-level-data/?query_type=water_level_rutsweiler${queryParam}`
      );
      const responseKreimbachKaulbach = await axios.get(
        `${API_URL}water-level-data/?query_type=water_level_kreimbach_kaulbach${queryParam}`
      );
      const responseWolfstein = await axios.get(
        `${API_URL}water-level-data/?query_type=water_level_wolfstein${queryParam}`
      );

      // Transform data for each dataset
      const transformData = (data) =>
        data.map((item) => ({
          time: item.timestamp,
          value: item.water_level_value,
        }));

      const transformedKreisverwaltung = transformData(
        responseKreisverwaltung.data
      );
      const transformedRutsweiler = transformData(responseRutsweiler.data);
      const transformedKreimbachKaulbach = transformData(
        responseKreimbachKaulbach.data
      );
      const transformedWolfstein = transformData(responseWolfstein.data);

      // Set the individual state for each dataset
      setWaterLevelKreisverwaltung(transformedKreisverwaltung);
      setWaterLevelRutsweiler(transformedRutsweiler);
      setWaterLevelKreimbachKaulbach(transformedKreimbachKaulbach);
      setWaterLevelWolfstein(transformedWolfstein);
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
          <div className="row mt-4  rounded-3 " style={{ flex: "1 1 auto", minHeight: "60vh" }}>
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
    alignItems: "stretch",   // Make children stretch to container width
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
    <SmallMap />
  </div>
</div>

            <div
              className="col-3 p-2  m-2 mb-3 mb-lg-2 mb-xl-0  rounded-3 d-flex flex-column"
              style={{
                flex: "1 1 auto",
                maxWidth: "100%",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
    
                borderRadius: "0px",
                borderStyle: 'solid',
                borderWidth:'1px',
                borderColor: '#FFFFFF',
                zIndex: "0", //add this to make sure the controls of the map are underneath the dropdown elements (Dropdown is directly above the map)
              }}
            >
              <div className="" style={{ display: "flex", justifyContent: "center", width: "100%" , height: "auto", overflow: "hidden" }}>
<TreeSVG className='pt-5' style={{ width: "90%", height: "auto", maxWidth: "90%" }} />
              </div>
              <div
  className="d-flex flex-column "
  style={{ width: "100%", height: "30%", justifyContent: "flex-end" }}
>
  <p className="fs-3 fw-bold">Baum:</p>
  <p className="fs-3 fw-bold">Bodenfeuchte:</p>
</div>
            </div>



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
                  borderStyle: 'solid',
                  borderWidth:'1px',
                  borderColor: '#FFFFFF'
                }}
              >
                <MultiLineChartEtschberg
                  currentPeriod={"30d"}
                  waterLevelWolfstein={waterLevelWolfstein}
                  waterLevelRutsweiler={waterLevelRutsweiler}
                  waterLevelKreimbach={waterLevelKreimbachKaulbach}
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
                  borderStyle: 'solid',
                  borderWidth:'1px',
                  borderColor: '#FFFFFF'
                }}
              >
                {weatherStationPrecipitationData && (
                  <BarChart
                    barChartConfig={precipitationConfig}
                    barChartData={weatherStationPrecipitationData}
                  />
                )}              </div>
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
                  borderStyle: 'solid',
                  borderWidth:'1px',
                  borderColor: '#FFFFFF'
                }}
              >
                < EtschbergMap
                />
              </div>
            </div>
          </div>


        </React.Fragment>
      )}
    </div>
  );
};

export default EtschbergDashboard;
