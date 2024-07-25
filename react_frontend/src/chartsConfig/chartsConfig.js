// props to individualize each chart

///////////////////////      Charts for the tree monitoring dashboard       ////////////////////////////////

//Soil Moisture Chart
export const soilMoistureConfig = {
  datasets: [
    {
      fill: true,
      borderColor: "#03C988",
      tension: 0.1,
      backgroundColor: "#92C7A5", // Fill color
    },
  ],
  plugins: {
    title: {
      text: "Bodenfeuchte [%]",
    },
  },
};

//electrical resistance Chart
export const treeMoistureContentLineChartConfig = {
  datasets: [
    {
      fill: true,
      borderColor: "#263FCD",
      tension: 0.1,
      backgroundColor: "#92C7A5", // Fill color
    },
  ],
  plugins: {
    title: {
      text: "Wasserbilanz des Baums [%]",
    },
  },
};

//electrical resistance Chart
export const electricalResistanceConfig = {
  datasets: [
    {
      fill: true,
      borderColor: "#FFB84C",
      tension: 0.1,
      backgroundColor: "#92C7A5", // Fill color
    },
  ],
  plugins: {
    title: {
      text: "Elektr. Widerstand des Baums [kΩ]",
    },
  },
};

//Temperature last 24h Line Chart
export const temperatureConfig = {
  datasets: [
    {
      fill: true,
      borderColor: "#E26EE5",
      tension: 0.1,
      backgroundColor: "#92C7A5", // Fill color
    },
  ],
  plugins: {
    title: {
      text: "Temperatur [°C]",
    },
  },
};

//Air Pressure last 24h Line Chart
export const airPressureConfig = {
  datasets: [
    {
      fill: true,
      borderColor: "#39B5E0",
      tension: 0.1,
      backgroundColor: "#92C7A5", // Fill color
    },
  ],
  plugins: {
    title: {
      text: "Luftdruck [hPa]",
    },
  },
};


//Humidity last 24h Line Chart
export const humidityConfig = {
  datasets: [
    {
      fill: true,
      borderColor: "orange",
      tension: 0.1,
      backgroundColor: "#92C7A5", // Fill color
    },
  ],
  plugins: {
    title: {
      text: "Luftfeuchte [%]",
    },
  },
};



//Bar Chart - Precipitation
export const precipitationConfig = {
  datasets: [
    {
      fill: false,
      backgroundColor: "#39B5E0",
      tension: 0.1,
    },
  ],
  plugins: {
    title: {
      text: "Niederschlag [mm/h]",
    },
  },
};

//Doughnut Chart - General Tree Condition
export const treeHealthConfig = {
  arcsLength: [0.3, 0.3, 0.3, 0.3], // Array of arc lengths
  colors: ["#0079FF", "#FF0060", "#F6FA70", "#00DFA2"], // Array of colors
};

//Doughnut Chart - soil moisture
export const soilMoistureGaugeChartConfig = {
  arcsLength: [0.1, 0.1, 0.8], // Array of arc lengths
  colors: ["#FF0060", "#F6FA70", "#00DFA2"], // Array of colors
};

//Doughnut Chart - UV Index
export const uvIndexConfig = {
  // arcsLength: [0.1, 0.4], // Array of arc lengths, make dynamic later!!!!!!!!!!!!
  colors: ["rgba(75, 192, 192, 0.2)", "rgb(192, 192, 192)"], // Array of colors
};

//Doughnut Chart - barometere
export const barometerConfig = {
  // arcsLength: [0.075, 0.525], // Array of arc lengths, adjusted for 270 degrees
  colors: ["rgba(75, 192, 192, 0.2)", "rgb(192, 192, 192)"], // Array of colors
};

export const pHConfig = {
  arcsLength: [5 / 14, 1 / 14, 2 / 14, 1 / 14, 5 / 14], // Adjusted array of arc lengths
  colors: ["#FF0060", "#F6FA70", "#00DFA2", "#F6FA70", "#FF0060"], // Array of colors matching the arc lengths
};
