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

  //water level data
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
  const [waterLevelOhmbachsee, setWaterLevelOhmbachsee] = useState([]);
  const [waterLevelNanzdietschweiler, setWaterLevelNanzdietschweiler] = useState([]);
  const [waterLevelRammelsbach, setWaterLevelRammelsbach] = useState([]);
  const [waterLevelEschenau, setWaterLevelEschenau] = useState([]);
  const [waterLevelSulzhof, setWaterLevelSulzhof] = useState([]);
  const [waterLevelOdenbachSteinbruch, setWaterLevelOdenbachSteinbruch] = useState([]);
  const [waterLevelOdenbach, setWaterLevelOdenbach] = useState([]);
  const [waterLevelNiedermohr, setWaterLevelNiedermohr] = useState([]);
  const [waterLevelLoellbach, setWaterLevelLoellbach] = useState([]);
    const [waterLevelLauterLandLieben, setWaterLevelLauterLandLieben] = useState([]);


    //  battery status
const [waterLevelKreisverwaltungBattery, setWaterLevelKreisverwaltungBattery] = useState(null);

const [waterLevelRutsweilerBattery, setWaterLevelRutsweilerBattery] = useState(null);

const [waterLevelKreimbachKaulbachBattery, setWaterLevelKreimbachKaulbachBattery] = useState(null);

const [waterLevelWolfsteinBattery, setWaterLevelWolfsteinBattery] = useState(null);

const [waterLevelLauterecken1Battery, setWaterLevelLauterecken1Battery] = useState(null);

const [waterLevelKreimbach1Battery, setWaterLevelKreimbach1Battery] = useState(null);

const [waterLevelKreimbach3Battery, setWaterLevelKreimbach3Battery] = useState(null);

const [waterLevelLohnweiler1Battery, setWaterLevelLohnweiler1Battery] = useState(null);

const [waterLevelHinzweiler1Battery, setWaterLevelHinzweiler1Battery] = useState(null);

const [waterLevelLauterLandLiebenBattery, setWaterLevelLauterLandLiebenBattery] = useState(null);



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
      kreimbach3, lohnweiler1, hinzweiler1, untersulzbach, lohnweilerRLP,
      ohmbachsee, nanzdietschweiler, rammelsbach, eschenau, sulzhof,
      odenbachSteinbruch, odenbach, niedermohr, loellbach, LohnweilerLauterLandLieben
    ] = await Promise.all([
      fetch("water_level_kv"), 
      fetch("water_level_rutsweiler"), 
      fetch("water_level_kreimbach_kaulbach"),
      fetch("water_level_wolfstein"), 
      fetch("water_level_lauterecken_1"), 
      fetch("water_level_kreimbach_1"),
      fetch("water_level_kreimbach_3"), 
      fetch("water_level_lohnweiler_1"), 
      fetch("water_level_hinzweiler_1"),
      fetch("water_level_untersulzbach"), 
      fetch("water_level_lohnweiler_rlp"),
      fetch("water_level_ohmbachsee"),
      fetch("water_level_nanzdietschweiler"),
      fetch("water_level_rammelsbach"),
      fetch("water_level_eschenau"),
      fetch("water_level_sulzhof"),
      fetch("water_level_odenbach_steinbruch"),
      fetch("water_level_odenbach"),
      fetch("water_level_niedermohr"),
      fetch("water_level_loellbach"),
      fetch("water_level_lohnweiler_lauter_landlieben")
    ]);

    const map = (d) => ({
      readings: d.data.readings.map(item => ({ time: item.timestamp, value: item.water_level_value })),
      battery: d.data.battery
    });


    // Sensors with battery status
    const kvData = map(kv);
    setWaterLevelKreisverwaltung(kvData.readings);
    setWaterLevelKreisverwaltungBattery(kvData.battery);

    const rutsweilerData = map(rutsweiler);
    setWaterLevelRutsweiler(rutsweilerData.readings);
    setWaterLevelRutsweilerBattery(rutsweilerData.battery);

    const kreimbachKData = map(kreimbachK);
    setWaterLevelKreimbachKaulbach(kreimbachKData.readings);
    setWaterLevelKreimbachKaulbachBattery(kreimbachKData.battery);

    const wolfsteinData = map(wolfstein);
    setWaterLevelWolfstein(wolfsteinData.readings);
    setWaterLevelWolfsteinBattery(wolfsteinData.battery);

    const lauterecken1Data = map(lauterecken1);
    setWaterLevelLauterecken1(lauterecken1Data.readings);
    setWaterLevelLauterecken1Battery(lauterecken1Data.battery);

    const kreimbach1Data = map(kreimbach1);
    setWaterLevelKreimbach1(kreimbach1Data.readings);
    setWaterLevelKreimbach1Battery(kreimbach1Data.battery);

    const kreimbach3Data = map(kreimbach3);
    setWaterLevelKreimbach3(kreimbach3Data.readings);
    setWaterLevelKreimbach3Battery(kreimbach3Data.battery);

    const lohnweiler1Data = map(lohnweiler1);
    setWaterLevelLohnweiler1(lohnweiler1Data.readings);
    setWaterLevelLohnweiler1Battery(lohnweiler1Data.battery);

    const hinzweiler1Data = map(hinzweiler1);
    setWaterLevelHinzweiler1(hinzweiler1Data.readings);
    setWaterLevelHinzweiler1Battery(hinzweiler1Data.battery);

    const lauterLandLiebenData = map(LohnweilerLauterLandLieben);
    setWaterLevelLauterLandLieben(lauterLandLiebenData.readings);
    setWaterLevelLauterLandLiebenBattery(lauterLandLiebenData.battery);

    // Sensors without battery status
    const mapNoBattery = (d) => d.data.readings.map(item => ({ time: item.timestamp, value: item.water_level_value }));

    setWaterLevelUntersulzbach(mapNoBattery(untersulzbach));
    setWaterLevelLohnweilerRLP(mapNoBattery(lohnweilerRLP));
    setWaterLevelOhmbachsee(mapNoBattery(ohmbachsee));
    setWaterLevelNanzdietschweiler(mapNoBattery(nanzdietschweiler));
    setWaterLevelRammelsbach(mapNoBattery(rammelsbach));
    setWaterLevelEschenau(mapNoBattery(eschenau));
    setWaterLevelSulzhof(mapNoBattery(sulzhof));
    setWaterLevelOdenbachSteinbruch(mapNoBattery(odenbachSteinbruch));
    setWaterLevelOdenbach(mapNoBattery(odenbach));
    setWaterLevelNiedermohr(mapNoBattery(niedermohr));
    setWaterLevelLoellbach(mapNoBattery(loellbach));



    // Weather station wolfstein
    const precipitationResponse = await axios.get(`${API_URL}api/historical-precipitation/?time_range=${timePeriodHistoricalPrecipitation}`);
    const timeZone = 'Europe/Berlin';
    const transform = (data) => ({
      labels: data.map(e => format(toZonedTime(new Date(e.timestamp * 1000), timeZone), 'yyyy-MM-dd HH:mm')),
      precipitationValues: data.map(e => e.precipitation)
    });
    setPrecipitationWolfsteinHistorical(transform(precipitationResponse.data));

    // Weather station lohnweiler
    const lohnweilerResponse = await axios.get(`${API_URL}api/lohnweiler-weather-data/?time_range=${timePeriodHistoricalPrecipitation}`);
    const transformLohnweiler = (data) => ({
      labels: data.map(e => format(toZonedTime(new Date(e.timestamp), timeZone), 'yyyy-MM-dd HH:mm')),
      precipitationValues: data.map(e => e.precipitation)
    });
    setLohnweilerPrecipitation(transformLohnweiler(lohnweilerResponse.data));

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
          waterLevelOhmbachsee={waterLevelOhmbachsee}
          waterLevelNanzdietschweiler={waterLevelNanzdietschweiler}
          waterLevelRammelsbach={waterLevelRammelsbach}
          waterLevelEschenau={waterLevelEschenau}
          waterLevelSulzhof={waterLevelSulzhof}
          waterLevelOdenbachSteinbruch={waterLevelOdenbachSteinbruch}
          waterLevelOdenbach={waterLevelOdenbach}
          waterLevelNiedermohr={waterLevelNiedermohr}
          waterLevelLoellbach={waterLevelLoellbach}
          waterLevelLohnweilerLauterLandLieben={waterLevelLauterLandLieben}

          waterLevelKreisverwaltungBattery={waterLevelKreisverwaltungBattery}
waterLevelRutsweilerBattery={waterLevelRutsweilerBattery}
waterLevelKreimbachKaulbachBattery={waterLevelKreimbachKaulbachBattery}
waterLevelWolfsteinBattery={waterLevelWolfsteinBattery}
waterLevelLauterecken1Battery={waterLevelLauterecken1Battery}
waterLevelKreimbach1Battery={waterLevelKreimbach1Battery}
waterLevelKreimbach3Battery={waterLevelKreimbach3Battery}
waterLevelLohnweiler1Battery={waterLevelLohnweiler1Battery}
waterLevelHinzweiler1Battery={waterLevelHinzweiler1Battery}
waterLevelLauterLandLiebenBattery={waterLevelLauterLandLiebenBattery}



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