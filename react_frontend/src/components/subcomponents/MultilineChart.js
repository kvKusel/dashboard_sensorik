import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Weight } from "lucide-react";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


// Helper to calculate timestamp boundaries
const calculateTimePeriodBoundary = (period) => {
  const now = Date.now(); // Current time in milliseconds
  switch (period) {
    case "24h":
      return now - 24 * 60 * 60 * 1000; // Last 24 hours
    case "7d":
      return now - 7 * 24 * 60 * 60 * 1000; // Last 7 days
    case "30d":
      return now - 30 * 24 * 60 * 60 * 1000; // Last 30 days
    case "365d":
      return now - 365 * 24 * 60 * 60 * 1000; // Last 365 days
    default:
      return now - 24 * 60 * 60 * 1000; // Default to 24 hours
  }
};

// Example of filtering data
const filterDataByPeriod = (data, periodBoundary) => {
  return data.filter((item) => new Date(item.time).getTime() >= periodBoundary);
};


const MultiLineChart = ({ waterLevelRutsweiler, waterLevelKreimbach, waterLevelWolfstein, currentPeriod }) => {
  // Helper to calculate timestamp boundaries
  const calculateTimePeriodBoundary = (period) => {
    const now = Date.now(); // Current time in milliseconds
    console.log("current period: ", currentPeriod)
    switch (period) {
      case "24h":
        return now - 24 * 60 * 60 * 1000; // Last 24 hours
      case "7d":
        return now - 7 * 24 * 60 * 60 * 1000; // Last 7 days
      case "30d":
        return now - 30 * 24 * 60 * 60 * 1000; // Last 30 days
      case "365d":
        return now - 365 * 24 * 60 * 60 * 1000; // Last 365 days
      default:
        return now - 24 * 60 * 60 * 1000; // Default to 24 hours
    }
  };

  const periodBoundary = calculateTimePeriodBoundary(currentPeriod);

  // Filter data by time period
  const filterDataByPeriod = (data, periodBoundary) => {
    return data.filter((item) => new Date(item.time).getTime() >= periodBoundary);
  };

  // Filter the data for each dataset
  const filteredRutsweilerData = filterDataByPeriod(waterLevelRutsweiler, periodBoundary);
  const filteredKreimbachData = filterDataByPeriod(waterLevelKreimbach, periodBoundary);
  const filteredWolfsteinData = filterDataByPeriod(waterLevelWolfstein, periodBoundary);

  // Combine and sort all unique labels for x-axis
  const allLabels = Array.from(
    new Set([
      ...filteredRutsweilerData.map((item) => new Date(item.time).toISOString()),
      ...filteredKreimbachData.map((item) => new Date(item.time).toISOString()),
      ...filteredWolfsteinData.map((item) => new Date(item.time).toISOString()),
    ])
  ).sort((a, b) => new Date(a) - new Date(b));

  // Align data with the labels (to handle missing values)
  const alignDataWithLastValue = (data, labels) => {
    let lastValue = null;
    return labels.map((label) => {
      const dataPoint = data.find((item) => new Date(item.time).toISOString() === label);
      if (dataPoint) {
        lastValue = dataPoint.value;
      }
      return lastValue;
    });
  };

  // Align data for each filtered dataset
  const alignedRutsweilerData = alignDataWithLastValue(filteredRutsweilerData, allLabels);
  const alignedKreimbachData = alignDataWithLastValue(filteredKreimbachData, allLabels);
  const alignedWolfsteinData = alignDataWithLastValue(filteredWolfsteinData, allLabels);

  console.log("current labels: ", allLabels )

  // Chart data configuration
  const chartData = {
    labels: allLabels.map((label) => new Date(label)), // Convert back to Date objects
    datasets: [
      {
        label: "Pegel Rutsweiler a.d. Lauter",
        data: alignedRutsweilerData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Pegel Wolfstein",
        data: alignedWolfsteinData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Pegel Kreimbach-Kaulbach",
        data: alignedKreimbachData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  // Chart configuration options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Pegelstände - zeitlicher Verlauf",
        color: "lightgrey",
        font: {
          size: "18rem",
          weight: "bolder",
        },
      },
      legend: {
        display: true,
        labels: {
          color: "lightgrey",
          font: {
            size: "18rem",
          },
        },
        position: "bottom",
        align: "start",
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: "Zeitstempel", // X-axis title
          color: "lightgrey", // Title color
          font: {
            size: 16,
          },
        },
        grid: {
          color: "lightgrey",
        },
        type: "timeseries",
        min: new Date(periodBoundary),
        max: Date.now(),
        ticks: {
          color: "lightgrey", // Set tick label color to lightgrey
          callback: function (label) {
            const parsedDate = new Date(label);
            return format(parsedDate, "MMM d, HH:00");
          },
          maxTicksLimit: 4,
          color: "lightgrey",
          font: {
            size: 14,
          },
        },

      },
      y: {
        title: {
          display: true,
          text: "Wasserstand (cm)", // Y-axis title
          color: "lightgrey", // Title color
          font: {
            size: 16,
          },
          padding: {
            top: 10,
          },
        },
        grid: {
          color: "lightgrey",
        },
        ticks: {
          maxTicksLimit: 4,
          color: "lightgrey", // Set tick label color to lightgrey
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="w-100 h-100">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MultiLineChart;