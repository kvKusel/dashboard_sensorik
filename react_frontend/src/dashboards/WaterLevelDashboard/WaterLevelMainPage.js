import React, { useState, useEffect } from "react";
import axios from "axios";
import WolfsteinSubpage from "./WaterLevelSubpage";
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const API_URL = process.env.REACT_APP_API_URL.endsWith('/')
  ? process.env.REACT_APP_API_URL
  : `${process.env.REACT_APP_API_URL}/`;

const WaterLevelDashboard = () => {
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const [waterLevelKreisverwaltung, setWaterLevelKreisverwaltung] = useState([]);
  const [waterLevelRutsweiler, setWaterLevelRutsweiler] = useState([]);
  const [waterLevelKreimbachKaulbach, setWaterLevelKreimbachKaulbach] = useState([]);
  const [waterLevelWolfstein, setWaterLevelWolfstein] = useState([]);
  const [waterLevelLauterecken1, setWaterLevelLauterecken1] = useState([]);
  const [waterLevelKreimbach1, setWaterLevelKreimbach1] = useState([]);
  const [waterLevelKreimbach3, setWaterLevelKreimbach3] = useState([]);
  const [waterLevelLohnweiler1, setWaterLevelLohnweiler1] = useState([]);
  const [waterLevelHinzweiler1, setWaterLevelHinzweiler1] = useState([]);
  const [waterLevelUntersulzbach, setWaterLevelUntersulzbach] = useState([]);
  const [waterLevelLohnweilerRLP, setWaterLevelLohnweilerRLP] = useState([]);

  const [precipitationWolfsteinHistorical, setPrecipitationWolfsteinHistorical] = useState([]);

  const [timePeriod, setTimePeriod] = useState("30d");
  const [timePeriodHistoricalPrecipitation, setTimePeriodHistoricalPrecipitation] = useState("24h");

  const fetchAllData = async () => {
    try {
      setIsLoading(true); // Show loading before fetching data
  
      // Fetch water level data
      const fetchWaterLevelData = async (timeRange) => {
        const queryParam = `&time_range=${timeRange}`; // Append time range filter
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
        const responseLauterecken1 = await axios.get(
          `${API_URL}water-level-data/?query_type=water_level_lauterecken_1${queryParam}`
        );
        const responseKreimbach1 = await axios.get(
          `${API_URL}water-level-data/?query_type=water_level_kreimbach_1${queryParam}`
        );
        const responseKreimbach3 = await axios.get(
          `${API_URL}water-level-data/?query_type=water_level_kreimbach_3${queryParam}`
        );
        const responseLohnweiler1 = await axios.get(
          `${API_URL}water-level-data/?query_type=water_level_lohnweiler_1${queryParam}`
        );
        const responseHinzweiler1 = await axios.get(
          `${API_URL}water-level-data/?query_type=water_level_hinzweiler_1${queryParam}`
        );
                const responseUntersulzbach = await axios.get(
          `${API_URL}water-level-data/?query_type=water_level_untersulzbach${queryParam}`
        );
                        const responseLohnweilerRLP = await axios.get(
          `${API_URL}water-level-data/?query_type=water_level_lohnweiler_rlp${queryParam}`
        );

        const transformData = (data) =>
          data.map((item) => ({
            time: item.timestamp,
            value: item.water_level_value,
          }));
  
        setWaterLevelKreisverwaltung(transformData(responseKreisverwaltung.data));
        setWaterLevelRutsweiler(transformData(responseRutsweiler.data));
        setWaterLevelKreimbachKaulbach(transformData(responseKreimbachKaulbach.data));
        setWaterLevelWolfstein(transformData(responseWolfstein.data));
        setWaterLevelLauterecken1(transformData(responseLauterecken1.data));
        setWaterLevelKreimbach1(transformData(responseKreimbach1.data));
        setWaterLevelKreimbach3(transformData(responseKreimbach3.data));
        setWaterLevelLohnweiler1(transformData(responseLohnweiler1.data));
        setWaterLevelHinzweiler1(transformData(responseHinzweiler1.data));
                setWaterLevelUntersulzbach(transformData(responseUntersulzbach.data));
                setWaterLevelLohnweilerRLP(transformData(responseLohnweilerRLP.data));

      };
  
      // Fetch precipitation history data
      const fetchPrecipitationHistoryData = async (timeRange) => {
        const queryParam = `/?time_range=${timeRange}`; // Append time range filter
        const responsePrecipitationHistorical = await axios.get(
          `${API_URL}api/historical-precipitation${queryParam}`
        );
  
        const transformHistoricalPrecipitationData = (data) => {
          const timeZone = 'Europe/Berlin'; // CET timezone
          const labels = data.map(entry =>
            format(toZonedTime(new Date(entry.timestamp * 1000), timeZone), 'yyyy-MM-dd HH:mm')
          );
          const precipitationValues = data.map(entry => entry.precipitation);
          return { labels, precipitationValues };
        };
  
        setPrecipitationWolfsteinHistorical(
          transformHistoricalPrecipitationData(responsePrecipitationHistorical.data)
        );
      };
  
      // Call both functions concurrently
      await Promise.all([
        fetchWaterLevelData(timePeriod),
        fetchPrecipitationHistoryData(timePeriodHistoricalPrecipitation),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Set loading to false after all data is fetched
    }
  };


// Combine useEffect to fetch all data on dependency changes
useEffect(() => {
  fetchAllData();
}, [timePeriod, timePeriodHistoricalPrecipitation]);

// Update both handlers to trigger combined fetch
const handleTimePeriodChange = (period) => {
  setTimePeriod(period);
};

const handleTimePeriodChangeHistoricalPrecipitation = (periodHistoricalPrecipitation) => {
  setTimePeriodHistoricalPrecipitation(periodHistoricalPrecipitation);
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
            color: "#18204F",
          }}
        >
          <p className="fs-1">Sensordaten werden geladen...</p>
        </div>
      ) : (
        <React.Fragment>
          <WolfsteinSubpage
          waterLevelKreisverwaltung={waterLevelKreisverwaltung}
            waterLevelWolfstein={waterLevelWolfstein}
            waterLevelRutsweiler={waterLevelRutsweiler}
            waterLevelKreimbach={waterLevelKreimbachKaulbach}
            waterLevelLauterecken1={waterLevelLauterecken1}
            waterLevelKreimbach1={waterLevelKreimbach1}
            waterLevelKreimbach3={waterLevelKreimbach3}
            waterLevelLohnweiler1={waterLevelLohnweiler1}
            waterLevelHinzweiler1={waterLevelHinzweiler1}
            waterLevelUntersulzbach={waterLevelUntersulzbach}
            waterLevelLohnweilerRLP={waterLevelLohnweilerRLP}
            currentPeriod={timePeriod}
            onPeriodChange={handleTimePeriodChange}
            historicalPrecipitationWolfstein={precipitationWolfsteinHistorical}
            onPeriodChangeHistoricalPrecipitation={handleTimePeriodChangeHistoricalPrecipitation}
            currentPeriodHistoricalPrecipitation={timePeriodHistoricalPrecipitation}
          />

          {/* <KuselbachSubpage
            waterLevelKreisverwaltung={waterLevelKreisverwaltung}
          /> */}
        </React.Fragment>
      )}
    </div>
  );
};

export default WaterLevelDashboard;
