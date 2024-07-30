import React from "react";
import GaugeChart from "react-gauge-chart";

//its possible apparently to create a gauge chart using chart.js, update this later accordingly

const Gauge = ({ currentValue, config, selectedTree, id, classAsProp}) => {
  let arcsLength;

  const minPressure = 950;
  const maxPressure = 1050;
  const minPH = 0;
  const maxPH = 14;

   // Function to normalize pH value to a 0-100 scale
   const normalizePHValue = (value) => {
    const minGauge = 0;
    const maxGauge = 100;
    return ((value - minPH) / (maxPH - minPH)) * (maxGauge - minGauge) + minGauge;
  };

  // Check if config.arcsLength is defined
  if (config.arcsLength) {
    arcsLength = config.arcsLength;
  } else if (id === "uvIndex") {
    // Convert currentValue scaled by 10 into a portion of 2π radians
    const scaledValue = (currentValue ) / 150 * 2 * Math.PI;
    const remaining = 2 * Math.PI - scaledValue; // Remaining part of the circle
    arcsLength = [scaledValue, remaining];
  } else if (id === "airPressure") {
    // Calculate arc lengths based on air pressure from 950 to 1050 hPa

    const range = maxPressure - minPressure;
    const normalizedValue = (currentValue - minPressure) / range; // Normalize the current value within the range
    const airPressureArc = normalizedValue * Math.PI; // Convert to radians (half-circle)
    const remainingArc = Math.PI - airPressureArc; // Remaining arc in the half-circle
    arcsLength = [airPressureArc, remainingArc];
  } 
  else {
    arcsLength = [0.1, 0.4]; // Default values if no specific conditions are met
  }  let colors = config.colors;


  // Check if selectedTree is undefined or selectedTree.id is 6
  if (id === "specialChartGeneral" && (!selectedTree || selectedTree.id === 3 || selectedTree.id === 5 || selectedTree.id === 6 || selectedTree.id === 7 || selectedTree === null)) {
    // Set needle to a hard-coded value if selectedTree is undefined or selectedTree.id is 6 (overview project area) or 7 (overview Streuobstwiese)
    colors = config.colors;
    currentValue = 0;
  } else if ( id === "specialChartGeneral" && selectedTree) {
    if (selectedTree.id === 4) {
      currentValue = currentValue[0];
    } else if (selectedTree.id === 1) {
      currentValue = currentValue[1];
    } else if (selectedTree.id === 2) {
      currentValue = currentValue[2];
    }
  }

  else if (id === "specialChartSoilMoisture" && (!selectedTree   || selectedTree.id === 6 || selectedTree.id === 7 || selectedTree === null)) {
    // Set needle to a hard-coded value if selectedTree is undefined or selectedTree.id is 6 (overview project area) or 7 (overview Streuobstwiese)
    colors = config.colors;
    currentValue = 0;
  }

  

  return (
    <GaugeChart
      id="gauge-chart"
      percent={
        id === "airPressure"
          ? ((currentValue - minPressure) / (maxPressure - minPressure))  // Normalize air pressure
          : id === "pH"
          ? currentValue / 14  // Normalize UV index based on the scale of 0-150
          : currentValue / 100  // Default scaling for other types
      }
      
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
      //style={{width:"100%"}}
      />
  );
};

export default Gauge;
