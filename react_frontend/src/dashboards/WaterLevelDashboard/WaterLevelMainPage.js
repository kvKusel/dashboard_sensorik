import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import WolfsteinSubpage from "./WaterLevelSubpage";
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const API_URL = process.env.REACT_APP_API_URL.endsWith('/')
  ? process.env.REACT_APP_API_URL
  : `${process.env.REACT_APP_API_URL}/`;

const WaterLevelDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

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
  const [lohnweilerPrecipitation, setLohnweilerPrecipitation] = useState([]);

  const [timePeriod, setTimePeriod] = useState("30d");
  const [timePeriodHistoricalPrecipitation, setTimePeriodHistoricalPrecipitation] = useState("30d");

  const [activeDataset, setActiveDataset] = useState(null);
  const [selectedRow, setSelectedRow] = useState("default");

  const scrollTargetRef = useRef(null);
  const [pendingScroll, setPendingScroll] = useState(null);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const queryParam = `&time_range=${timePeriod}`;

      const fetch = (type) => axios.get(`${API_URL}water-level-data/?query_type=${type}${queryParam}`);

      const [
        kv, rutsweiler, kreimbachK, wolfstein, lauterecken1, kreimbach1,
        kreimbach3, lohnweiler1, hinzweiler1, untersulzbach, lohnweilerRLP
      ] = await Promise.all([
        fetch("water_level_kv"), fetch("water_level_rutsweiler"), fetch("water_level_kreimbach_kaulbach"),
        fetch("water_level_wolfstein"), fetch("water_level_lauterecken_1"), fetch("water_level_kreimbach_1"),
        fetch("water_level_kreimbach_3"), fetch("water_level_lohnweiler_1"), fetch("water_level_hinzweiler_1"),
        fetch("water_level_untersulzbach"), fetch("water_level_lohnweiler_rlp")
      ]);

      const map = (d) => d.data.map(item => ({ time: item.timestamp, value: item.water_level_value }));

      setWaterLevelKreisverwaltung(map(kv));
      setWaterLevelRutsweiler(map(rutsweiler));
      setWaterLevelKreimbachKaulbach(map(kreimbachK));
      setWaterLevelWolfstein(map(wolfstein));
      setWaterLevelLauterecken1(map(lauterecken1));
      setWaterLevelKreimbach1(map(kreimbach1));
      setWaterLevelKreimbach3(map(kreimbach3));
      setWaterLevelLohnweiler1(map(lohnweiler1));
      setWaterLevelHinzweiler1(map(hinzweiler1));
      setWaterLevelUntersulzbach(map(untersulzbach));
      setWaterLevelLohnweilerRLP(map(lohnweilerRLP));

    const precipitationResponse = await axios.get(`${API_URL}api/historical-precipitation/?time_range=${timePeriodHistoricalPrecipitation}`);
    const timeZone = 'Europe/Berlin';
    const transform = (data) => ({
      labels: data.map(e => format(toZonedTime(new Date(e.timestamp * 1000), timeZone), 'yyyy-MM-dd HH:mm')),
      precipitationValues: data.map(e => e.precipitation)
    });
    const wolfsteinData = transform(precipitationResponse.data);
    setPrecipitationWolfsteinHistorical(wolfsteinData);
    

    const lohnweilerResponse = await axios.get(`${API_URL}api/lohnweiler-weather-data/?time_range=${timePeriodHistoricalPrecipitation}`);
    const transformLohnweiler = (data) => ({
      labels: data.map(e => format(toZonedTime(new Date(e.timestamp), timeZone), 'yyyy-MM-dd HH:mm')),
      precipitationValues: data.map(e => e.precipitation)
    });

    const lohnweilerData = transformLohnweiler(lohnweilerResponse.data);
    setLohnweilerPrecipitation(lohnweilerData);



  } catch (e) {
    console.error("Error fetching data:", e);
  } finally {
    setIsLoading(false);
  }
};

  const handlePeriodChange = (newPeriod) => {
    setPendingScroll('multiline-chart');
    setTimePeriod(newPeriod);
  };

  const handleHistoricalPeriodChange = (newPeriod) => {
    setPendingScroll('historical-precipitation');
    setTimePeriodHistoricalPrecipitation(newPeriod);
  };

  useEffect(() => {
    if (!isLoading && pendingScroll) {
      const scrollToTarget = () => {
        const targetId = pendingScroll;
        const element = document.getElementById(targetId);

        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }

        setPendingScroll(null);
      };

      const timeoutId = setTimeout(scrollToTarget, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, pendingScroll]);

  useEffect(() => {
    fetchAllData();
  }, [timePeriod, timePeriodHistoricalPrecipitation]);




  return (
    <div style={{ minHeight: "80vh" }}>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ color: "#18204F" }}>
          <p className="fs-1">Sensordaten werden geladen...</p>
        </div>
      ) : (
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
          onPeriodChange={handlePeriodChange}
          historicalPrecipitationWolfstein={precipitationWolfsteinHistorical}
          onPeriodChangeHistoricalPrecipitation={handleHistoricalPeriodChange}
          currentPeriodHistoricalPrecipitation={timePeriodHistoricalPrecipitation}
          activeDataset={activeDataset}
          setActiveDataset={setActiveDataset}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          lohnweilerPrecipitation={lohnweilerPrecipitation}
        />
      )}
    </div>
  );
};

export default WaterLevelDashboard;
