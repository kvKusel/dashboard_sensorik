import React, { useEffect, useState } from "react";
import { ReactComponent as EtschbergSVG } from "../../../assets/etschberg_illustration_desktop.svg";
import { ReactComponent as EtschbergSVGTablet } from "../../../assets/etschberg_illustration_tablet.svg";
import { ReactComponent as EtschbergSVGMobile } from "../../../assets/etschberg_illustration_mobile.svg";

import MapIcon from "./MapIcon"; // Import the MapIcon component

const SmallMap = ({ 
  setSelectedTree, 
  lastValueSoilMoistureEtschberg1,
  lastValueSoilMoistureEtschberg2,
  lastValueSoilMoistureEtschberg3,
  lastValueSoilMoistureEtschberg4,
  lastValueSoilMoistureEtschberg5
}) => {
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let MapSVG;
  if (screenSize < 768) {
    MapSVG = EtschbergSVGMobile;
  } else if (screenSize < 1200) {
    MapSVG = EtschbergSVGTablet;
  } else {
    MapSVG = EtschbergSVG;
  }

  return (
    <div style={{ width: "100%", height: "auto", position: "relative", display: "block" }}>
      <MapSVG className="etschberg-svg" />
      {/* Add map icons with their respective tree numbers and moisture values */}
      <MapIcon 
        left={20} 
        top={80} 
        treeNumber={1} 
        treePosition="SW" 
        setSelectedTree={setSelectedTree} 
        moistureValue={lastValueSoilMoistureEtschberg1} 
      />
      <MapIcon 
        left={82} 
        top={80} 
        treeNumber={2} 
        treePosition="SE" 
        setSelectedTree={setSelectedTree} 
        moistureValue={lastValueSoilMoistureEtschberg2} 
      />
      <MapIcon 
        left={50} 
        top={50} 
        treeNumber={3} 
        treePosition="Mitte" 
        setSelectedTree={setSelectedTree} 
        moistureValue={lastValueSoilMoistureEtschberg3} 
      />
      <MapIcon 
        left={20} 
        top={20} 
        treeNumber={4} 
        treePosition="NW" 
        setSelectedTree={setSelectedTree} 
        moistureValue={lastValueSoilMoistureEtschberg4} 
      />
      <MapIcon 
        left={82} 
        top={20} 
        treeNumber={5} 
        treePosition="NE" 
        setSelectedTree={setSelectedTree} 
        moistureValue={lastValueSoilMoistureEtschberg5} 
      />
    </div>
  );
};

export default SmallMap;