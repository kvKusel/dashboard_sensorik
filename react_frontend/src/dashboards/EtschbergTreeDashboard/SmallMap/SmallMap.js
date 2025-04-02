import React, { useEffect, useState } from "react";
import { ReactComponent as EtschbergSVG } from "../../../assets/etschberg_illustration_desktop.svg";
import { ReactComponent as EtschbergSVGTablet } from "../../../assets/etschberg_illustration_tablet.svg";
import { ReactComponent as EtschbergSVGMobile } from "../../../assets/etschberg_illustration_mobile.svg";

import MapIcon from "./MapIcon"; // Import the MapIcon component

const SmallMap = () => {
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
      {/* Add multiple icons at different positions */}
      <MapIcon left={20} top={80} />
      <MapIcon left={50} top={50} />
      <MapIcon left={82} top={20} />
      <MapIcon left={20} top={20} />
      <MapIcon left={82} top={80} />
    </div>
  );
};

export default SmallMap;
