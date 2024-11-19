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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/water-level-data/?query_type=water_level_kv`
        );
        const data = response.data;

        const transformedData = data.map((item) => ({
          time: item.timestamp,
          value: item.water_level_value,
        }));

        setWaterLevelKreisverwaltung(transformedData);
      } catch (error) {
        console.error("Error fetching the weather data:", error);
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
