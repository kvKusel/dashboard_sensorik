import React, { useState, useEffect } from "react";
import axios from "axios";
import KuselbachSubpage from "./WaterLevelKusel/KuselbachSubpage";
import WolfsteinSubpage from "./WaterLevelWolfstein/WolfsteinSubpage";
import Chatbot from "../../../../tools/Chatbot";

const API_URL = process.env.REACT_APP_API_URL;

const WaterLevelDashboard = () => {
  const [isLoading, setIsLoading] = useState(true); // Start as loading

  const [waterLevelKreisverwaltung, setWaterLevelKreisverwaltung] = useState(
    []
  );

  const [waterLevelRutsweiler, setWaterLevelRutsweiler] = useState(
    []
  );

  const [waterLevelKreimbachKaulbach, setWaterLevelKreimbachKaulbach] = useState(
    []
  );



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from all three endpoints separately
        const responseKreisverwaltung = await axios.get(
          `${API_URL}water-level-data/?query_type=water_level_kv`
        );
        const responseRutsweiler = await axios.get(
          `${API_URL}water-level-data/?query_type=water_level_rutsweiler`
        );
        const responseKreimbachKaulbach = await axios.get(
          `${API_URL}water-level-data/?query_type=water_level_kreimbach_kaulbach`
        );
  
        // Transform data for each dataset
        const transformedKreisverwaltung = responseKreisverwaltung.data.map((item) => ({
          time: item.timestamp,
          value: item.water_level_value,
        }));
  
        const transformedRutsweiler = responseRutsweiler.data.map((item) => ({
          time: item.timestamp,
          value: item.water_level_value,
        }));
  
        const transformedKreimbachKaulbach = responseKreimbachKaulbach.data.map((item) => ({
          time: item.timestamp,
          value: item.water_level_value,
        }));


  
        // Set the individual state for each dataset
        setWaterLevelKreisverwaltung(transformedKreisverwaltung);
        setWaterLevelRutsweiler(transformedRutsweiler);
        setWaterLevelKreimbachKaulbach(transformedKreimbachKaulbach);
  
      } catch (error) {
        console.error("Error fetching the water level data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after data fetch
      }
    };
  
    fetchData();
  }, []);
  

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
            waterLevelKreisverwaltung={waterLevelKreisverwaltung}
            waterLevelRutsweiler={waterLevelRutsweiler}
          />

          <KuselbachSubpage
            waterLevelKreisverwaltung={waterLevelKreisverwaltung}
          />
          {/* <Chatbot /> */}
        </React.Fragment>
      )}
    </div>
  );
};

export default WaterLevelDashboard;
