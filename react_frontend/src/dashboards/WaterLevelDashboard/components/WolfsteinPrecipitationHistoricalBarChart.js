import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// The import for "chartjs-adapter-date-fns" has been removed to resolve compilation issues.
// The environment is expected to provide the necessary time scale adapter functionality.
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import axios from "axios";

// Register the necessary components for Chart.js
ChartJS.register(TimeScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define the API URL (assuming it's set in the environment)
const API_URL = process.env.REACT_APP_API_URL?.endsWith("/")
  ? process.env.REACT_APP_API_URL
  : `${process.env.REACT_APP_API_URL ?? ''}/`; // Added nullish coalescing for safety

// Define the custom plugin for displaying "no precipitation" message
const noPrecipitationPluginHistorical = {
  id: "noPrecipitationPluginHistorical",
  afterDraw: (chart) => {
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y },
    } = chart;

    // Ensure chart.data and its datasets are defined before proceeding
    if (!chart.data || !chart.data.datasets || !chart.data.datasets[0]) {
      return; // Early exit if data is not ready
    }

    // Get the maximum value from the precipitation data
    const maxValue = Math.max(...chart.data.datasets[0].data);

    // If the maximum value is 0, display the "no precipitation" message
    if (maxValue === 0) {
      const fontSize = window.innerWidth < 768 ? "1rem" : "1.2rem";

      ctx.save(); // Save the current canvas state

      const text = "kein Niederschlag im dargestellten Zeitraum"; // Message to display
      const maxWidth = width - 20; // Maximum width for text
      const lineHeight = 20; // Line height for wrapped text
      const xCenter = left + (right - left) / 2; // Center X coordinate
      const yCenter = top + height / 2 - 8; // Center Y coordinate

      // Set font properties for the text
      ctx.font = `${fontSize} Poppins, sans-serif`;
      ctx.fillStyle = "#6972A8";
      ctx.textAlign = "center";

      // Function to wrap text within a specified width
      function wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(" ");
        let line = "";
        let yPosition = y;

        for (let word of words) {
          const testLine = line + word + " ";
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          // If the test line exceeds maxWidth and it's not the first word, draw current line and start a new one
          if (testWidth > maxWidth && line !== "") {
            ctx.fillText(line, x, yPosition);
            line = word + " ";
            yPosition += lineHeight;
          } else {
            line = testLine; // Otherwise, add word to current line
          }
        }
        ctx.fillText(line, x, yPosition); // Draw the last line
      }

      // Call wrapText function to draw the text on the chart
      wrapText(text, xCenter, yCenter, maxWidth, lineHeight);

      ctx.restore(); // Restore the canvas state
    }
  },
};

const WolfsteinHistoricalBarChart = ({
  currentPeriodHistoricalPrecipitation,
  historicalPrecipitationWolfstein,
  lohnweilerPrecipitation,
  activeDataset
}) => {
  const [chartData, setChartData] = useState(null);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  // State to manage the active dataset: 'lohnweiler' (default) or 'wolfstein'
  // const [activeDataset, setActiveDataset] = useState('lohnweiler');

  // Function to get the time range for the current period
  const getPeriodTimeRange = (period) => {
    const now = new Date();
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999); // Set to end of today

    const startOfPeriod = new Date(endOfToday);
    // Adjust start date based on the selected period
    switch (period) {
      case "24h":
        startOfPeriod.setDate(endOfToday.getDate() - 1);
        break;
      case "7d":
        startOfPeriod.setDate(endOfToday.getDate() - 7);
        break;
      case "30d":
        startOfPeriod.setDate(endOfToday.getDate() - 30);
        break;
      case "365d":
        startOfPeriod.setDate(endOfToday.getDate() - 365);
        break;
      default:
        startOfPeriod.setDate(endOfToday.getDate() - 1); // Default to 24h
    }
    startOfPeriod.setHours(0, 0, 0, 0); // Set to beginning of the start day

    return { start: startOfPeriod.getTime(), end: endOfToday.getTime() };
  };

  // Effect hook to handle window resize events
  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth); // Update window size state on resize
    };

    window.addEventListener("resize", handleResize); // Add resize listener
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  // Effect hook to update chart data when historical data or activeDataset changes
  useEffect(() => {
    let dataToUse = null;
    let chartTitle = "";

    // Determine which dataset to use based on activeDataset state
    if (activeDataset === 'wolfstein' && historicalPrecipitationWolfstein) {
      dataToUse = historicalPrecipitationWolfstein;
      chartTitle = "Niederschlag - Rückblick (Wolfstein)";
    } else if (activeDataset === 'lohnweiler' && lohnweilerPrecipitation) {
      dataToUse = lohnweilerPrecipitation;
      chartTitle = "Niederschlag - Rückblick (Lohnweiler)";
    }

    if (dataToUse) {
      // Set the chart data for Bar component
      setChartData({
        labels: dataToUse.labels,
        datasets: [
          {
            label: "Niederschlag (mm)",
            data: dataToUse.precipitationValues,
            backgroundColor: "rgba(90, 41, 182, 1)",
            borderColor: "rgb(90, 41, 182)",
            borderWidth: 1,
            barThickness: 15, // Set desired minimum thickness
            maxBarThickness: 30, // Optional: set a maximum thickness
          },
        ],
        chartTitle: chartTitle // Store chart title for options
      });
    }
  }, [historicalPrecipitationWolfstein, lohnweilerPrecipitation, activeDataset, currentPeriodHistoricalPrecipitation]); // Dependencies

  // Effect hook for logging chart data after it's set
  useEffect(() => {
    if (chartData) {

    }
  }, [chartData, historicalPrecipitationWolfstein, lohnweilerPrecipitation, activeDataset]);

  // Get min and max for x-axis based on current period
  const { start: xMin, end: xMax } = getPeriodTimeRange(currentPeriodHistoricalPrecipitation);

  // Chart options configuration
  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        min: xMin,
        max: xMax,
        offset: false, // Removes padding/offset
        time: {
          unit: currentPeriodHistoricalPrecipitation === "24h" ? "hour" : "day",
          tooltipFormat: "yyyy-MM-dd HH:mm",
          displayFormats: {
            hour: "MMM d, HH:00",
            day: "MMM d",
          },
          bounds: "ticks", // Align range to ticks instead of data
        },
        grid: {
          offset: false,
          color: "#BFC2DA",
          borderColor: "#6972A8",
          borderWidth: 1,
          lineWidth: 2,
          drawOnChartArea: true,
          drawTicks: true,
          tickMarkLength: 5,
          offsetGridLines: false,
        },
        ticks: {
          maxTicksLimit: 4,
          minTicksLimit: 4,
          color: "#6972A8",
          font: {
            size: 16,
          },
          callback: function (label, index, labels) {
            const parsedDate = new Date(label);
            const formattedDate = format(parsedDate, "MMM d");
            const secondLine =
              currentPeriodHistoricalPrecipitation === "24h"
                ? format(parsedDate, "HH:00")
                : format(parsedDate, "yyyy");
            return [formattedDate, secondLine]; // Always return two lines
          },
        },
      },
y: {
  beginAtZero: true,
  grid: {
    lineWidth: 2,
    color: "#BFC2DA",
  },
  ticks: {
    maxTicksLimit: 4,
    color: "#6972A8",
    font: {
      size: 16,
    },
  },
  title: {
    display: true,
    text: "Niederschlag (mm/h)",
    color: "#6972A8",
    font: {
      size: 18,
    },
    padding: {
      top: 10,
    },
  },
  // ✅ Ensure y-axis max is never below 10
  afterDataLimits: (axis) => {
    if (axis.max < 10) {
      axis.max = 10;
    }
  }
},

    },
    plugins: {
      title: {
        display: true,
        // Dynamically set the title based on the active dataset
        text: chartData?.chartTitle || "Niederschlag - Rückblick",
        padding: { bottom: 20 },
        color: "#18204F",
        font: {
          size: 20,
          weight: "bolder",
        },
      },
      legend: {
        display: false,
      },
      // Register the custom plugin here
    },
  };

  // Render null if chartData is not ready
  if (!chartData) return null;

  return (
    <div className="w-100 h-100  ">

      <div style={{ height: '100%' }}>
        <Bar
          data={chartData}
          options={options}
          key={windowSize} // Key for re-rendering on window resize
          plugins={[noPrecipitationPluginHistorical]} // Enable the custom plugin
        />
      </div>

{/* 
            <div className="">
        <button
          onClick={() => setActiveDataset('lohnweiler')}
          className={`px-4 py-2 mr-2 rounded-md font-bold transition-colors duration-200
            ${activeDataset === 'lohnweiler' ? 'bg-indigo-700 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
          `}
        >
          Lohnweiler
        </button>
        <button
          onClick={() => setActiveDataset('wolfstein')}
          className={`px-4 py-2 rounded-md font-bold transition-colors duration-200
            ${activeDataset === 'wolfstein' ? 'bg-indigo-700 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
          `}
        >
          Wolfstein
        </button>
      </div> */}


    </div>
  );
};

export default WolfsteinHistoricalBarChart;
