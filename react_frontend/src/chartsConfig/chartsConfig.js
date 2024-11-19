// props to individualize each chart

///////////////////////      Charts for the tree monitoring dashboard       ////////////////////////////////

// Water Level Monitoring Chart - Kuselbach
export const waterLevelConfig = {
  
  datasets: [
    {
      fill: true,
      borderColor: "#03C988",
      tension: 0.1,
      backgroundColor: "transparent", // Fill color
    },
  ],
  
  options: {
    scales: {
      y: {
        reverse: true, // Flip the y-axis so highest values are at the bottom
        grid: {
          color: "lightgrey",
        },
        
        ticks: {
          precision: 0,
          color: "lightgrey",
          font: {
            size: 14,
          },
        },
      },
      x: {
        grid: {
          color: "lightgrey",
        },
        ticks: {
          color: "lightgrey",
          font: {
            size: 14,
          },
        },
      },
    },
  },
  
  plugins: {
    annotation: {
      annotations: {
        line1: {
          type: "line",
          yMin: 0,
          yMax: 0,
          borderColor: "red",
          borderWidth: 2, // Adjusted width
          label: {
            content: "Sensorhöhe",
            display: true,
            position: "center", // Adjusted position
            color: "red",
            font: {
              size: "13rem",
            },
            backgroundColor: "",
          },
        },
      },
    },
    title: {
      text: "Kuselbach - Abstand zum Sensor [cm]",
    },
  },
};


// Water Level Monitoring Chart - Wolfstein
export const waterLevelConfigWolfstein = {
  
  datasets: [
    {
      fill: true,
      borderColor: "#03C988",
      tension: 0.1,
      backgroundColor: "transparent", // Fill color
    },
  ],
  
  options: {
    scales: {
      y: {
        //reverse: true, // Flip the y-axis so highest values are at the bottom
        grid: {
          color: "lightgrey",
        },
        
        ticks: {
          precision: 0,
          color: "lightgrey",
          font: {
            size: 14,
          },
                    // Add 'cm' to each y-axis tick value
                    callback: function(value) {
                      return value + " cm";
                    },
        },
      },
      x: {
        grid: {
          color: "lightgrey",
        },
        ticks: {
          color: "lightgrey",
          font: {
            size: 14,
          },
        },
      },
    },
  },
  
  plugins: {
    annotation: {
      // annotations: {
      //   line1: {
      //     type: "line",
      //     yMin: 100,
      //     yMax: 100,
      //     borderColor: "red",
      //     borderWidth: 2, // Adjusted width
      //     label: {
      //       content: "Oberkante Gelände",
      //       display: true,
      //       position: "center", // Adjusted position
      //       color: "red",
      //       font: {
      //         size: "13rem",
      //       },
      //       backgroundColor: "",
      //     },
      //   },
      // },
    },
    title: {
      text: "Pegelstände",
    },
  },
};



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

//Temperature Burg Lichtenberg - used in the Weather Dashboard
export const temperatureConfigBurgLichtenbergWeatherDashboard = {
  datasets: [
    {
      fill: true,
      borderColor: "rgba(75, 192, 192, 1)",
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


//Temperature Siebenpfeiffer-Gymnasium - used in the Weather Dashboard
export const temperatureConfigGymnasiumWeatherDashboard = {
  datasets: [
    {
      fill: true,
      borderColor: "rgba(153, 102, 255, 1)",
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


export const precipitationConfigGymnasium = {
  datasets: [
    {
      fill: false,
      backgroundColor: "rgba(153, 102, 255, 1)",
    },
  ],
  plugins: {
    title: {
      text: "Niederschlag [mm/h]",
    },
  },
};

export const precipitationConfigBurgLichtenberg = {
  datasets: [
    {
      fill: false,
      backgroundColor: "rgba(75, 192, 192, 1)",
      borderColor:"red",

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

//Doughnut Chart - barometer
export const barometerConfig = {
  // arcsLength: [0.075, 0.525], // Array of arc lengths, adjusted for 270 degrees
  colors: ["rgba(75, 192, 192, 0.2)", "rgb(192, 192, 192)"], // Array of colors
};

export const pHConfig = {
  arcsLength: [5 / 14, 1 / 14, 2 / 14, 1 / 14, 5 / 14], // Adjusted array of arc lengths
  colors: ["#FF0060", "#F6FA70", "#00DFA2", "#F6FA70", "#FF0060"], // Array of colors matching the arc lengths
};

