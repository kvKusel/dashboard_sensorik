import React, { useState, useEffect } from "react";
import axios from "axios";
import KuselbachSubpage from "./WaterLevelKusel/KuselbachSubpage";
import WolfsteinSubpage from "./WaterLevelWolfstein/WolfsteinSubpage";

const API_URL = process.env.REACT_APP_API_URL.endsWith('/')
  ? process.env.REACT_APP_API_URL
  : `${process.env.REACT_APP_API_URL}/`;

const WaterLevelDashboard = () => {
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const [waterLevelKreisverwaltung, setWaterLevelKreisverwaltung] = useState([]);
  const [waterLevelRutsweiler, setWaterLevelRutsweiler] = useState([]);
  const [waterLevelKreimbachKaulbach, setWaterLevelKreimbachKaulbach] = useState([]);
  const [waterLevelWolfstein, setWaterLevelWolfstein] = useState([]);
  const [timePeriod, setTimePeriod] = useState("24h");

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

      const transformedKreisverwaltung = transformData(responseKreisverwaltung.data);
      const transformedRutsweiler = transformData(responseRutsweiler.data);
      const transformedKreimbachKaulbach = transformData(responseKreimbachKaulbach.data);
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

  return (
    <div style={{ minHeight: "80vh" }}>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
            color: "lightgrey",
          }}
        >
          <p className="fs-1">Sensordaten werden geladen...</p>
        </div>
      ) : (
        <React.Fragment>
          <WolfsteinSubpage
            waterLevelWolfstein={waterLevelWolfstein}
            waterLevelRutsweiler={waterLevelRutsweiler}
            waterLevelKreimbach={waterLevelKreimbachKaulbach}
            currentPeriod={timePeriod}
            onPeriodChange={handleTimePeriodChange}
          />

          <KuselbachSubpage
            waterLevelKreisverwaltung={waterLevelKreisverwaltung}
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default WaterLevelDashboard;
