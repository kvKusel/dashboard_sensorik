import React from "react";
import GaugeChart from "react-gauge-chart";

//its possible apparently to create a gauge chart using chart.js, update this later accordingly

const Gauge = ({ currentValue, config, selectedTree, id, classAsProp}) => {
  const arcsLength = config.arcsLength;
  let colors = config.colors;

  console.log(selectedTree)

  // Check if selectedTree is undefined or selectedTree.id is 6
  if (id === "specialChart" && (!selectedTree || selectedTree.id === 6 || selectedTree.id === 7 || selectedTree.id === 3 || selectedTree.id === 5 || selectedTree === null)) {
    // Set needle to a hard-coded value if selectedTree is undefined or selectedTree.id is 6 (overview project area) or 7 (overview Streuobstwiese)
    colors = config.colors;
    currentValue = 0;
  }
  else {
    
  }

  return (
    <GaugeChart
      id="gauge-chart"
      percent={currentValue / 100}
      needleColor="black"
      textColor="transparent"
      fontSize="2px"
      arcPadding={0}
      animDelay={0}
      arcWidth={0.25}
      cornerRadius={0}
      arcsLength={arcsLength}
      colors={colors}
      className={`gauge-chart ${classAsProp}`}
      style={{width:"100%"}}
      />
  );
};

export default Gauge;
