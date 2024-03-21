// props to individualize each chart  

///////////////////////      Charts for the tree monitoring dashboard       ////////////////////////////////

//Soil Moisture Chart
export const soilMoistureConfig = {
    datasets: [
      {
        fill: true,
        borderColor: "#03C988",
        tension: 0.1,
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color
      },
    ],
    plugins: {
      title: {
        text: "Bodenfeuchte [%]",
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
      backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color
    },
  ],
  plugins: {
    title: {
      text: "Elektrischer Widerstand [kΩ]",
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
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color
      },
    ],
    plugins: {
      title: {
        text: "Temperatur [°C]",
      },
    },
  };


//Bar Chart - Precipitation
export const precipitationConfig = {
  datasets: [
    {
      fill: false,
      backgroundColor: '#39B5E0',
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
  colors: ['#79E0EE','#FF0000', '#FDFF00', '#379237'], // Array of colors
};

//Doughnut Chart - soil moisture
export const soilMoistureGaugeChartConfig = {
  arcsLength: [0.1, 0.1, 0.8], // Array of arc lengths
  colors: ['#FF0000', '#FDFF00', '#379237'], // Array of colors
};

//Doughnut Chart - UV Index
export const uvIndexConfig = {
  arcsLength: [0.1, 0.4], // Array of arc lengths, make dynamic later!!!!!!!!!!!!
  colors: ['#6499E9', '#DDF2FD'], // Array of colors
};

//Doughnut Chart - barometere
export const barometerConfig = {
  arcsLength: [0.075, 0.525], // Array of arc lengths, adjusted for 270 degrees
  colors: ['#6499E9', '#DDF2FD'], // Array of colors
};