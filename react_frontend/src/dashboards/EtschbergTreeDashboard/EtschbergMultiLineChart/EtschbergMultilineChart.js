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
import { bounds } from "leaflet";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MultiLineChart = ({currentPeriod, soilMoistureEtschberg1, soilMoistureEtschberg2, soilMoistureEtschberg3, soilMoistureEtschberg4, soilMoistureEtschberg5 }) => {

  const [windowSize, setWindowSize] = useState(window.innerWidth);

useEffect(() => {
  const handleResize = () => {
    setWindowSize(window.innerWidth); // Change state on resize
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);



  const calculateTimePeriodBoundary = (period) => {
    const now = Date.now();
    switch (period) {
      case "24h":
        return now - 24 * 60 * 60 * 1000;
      case "7d":
        return now - 7 * 24 * 60 * 60 * 1000;
      case "30d":
        return now - 30 * 24 * 60 * 60 * 1000;
      case "365d":
        return now - 365 * 24 * 60 * 60 * 1000;
      default:
        return now - 24 * 60 * 60 * 1000;
    }
  };


  const periodBoundary = calculateTimePeriodBoundary(currentPeriod);

  // Create datasets with actual timestamps
  const createDataset = (data) => {
    return data.map(item => ({
      x: new Date(item.time).getTime(),
      y: item.value
    }));
  };

const chartData = {
    datasets: [
      {
        label: "Baum im SW",
        data: createDataset(soilMoistureEtschberg1),
        borderColor: "rgba(231, 132, 78, 1)",
        backgroundColor: "rgba(231, 132, 78, 1)",
        tension: 0.2, // Adjust this value for more or less smoothing

      },
      {
        label: "Baum im SE",
        data: createDataset(soilMoistureEtschberg2),
        borderColor: "rgba(131, 201, 104, 1)",
        backgroundColor: "rgba(131, 201, 104, 1)",
        tension: 0.2, // Adjust this value for more or less smoothing

      },
      {
        label: "Baum in der Mitte",
        data: createDataset(soilMoistureEtschberg3),
        borderColor: "rgba(78, 159, 188, 1)",
        backgroundColor: "rgba(78, 159, 188, 1)",
        tension: 0.2, // Adjust this value for more or less smoothing

      },
      {
        label: "Baum im NW",
        data: createDataset(soilMoistureEtschberg4),
        borderColor: "	rgba(166, 109, 212, 1)",
        backgroundColor: "	rgba(166, 109, 212, 1)",
        tension: 0.2, // Adjust this value for more or less smoothing

      },
      {
        label: "Baum im NE",
        data: createDataset(soilMoistureEtschberg5),
        borderColor: "rgba(236, 200, 91, 1)",
        backgroundColor: "rgba(236, 200, 91, 1)",
        tension: 0.2, // Adjust this value for more or less smoothing

      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Bodenfeuchte - letzte 30 Tage",
        color: "#18204F",
        font: {
          size: "20",
          weight: "bolder",
        },
      },
      legend: {
        display: true,
        labels: {
          color: "#6972A8",
          padding: 20,
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
        type: 'timeseries',
        time: {
          unit: currentPeriod === "24h" ? 'hour' : 'day',
          displayFormats: {
            hour: 'MMM d, HH:00',
            day: 'MMM d'
          },
          //round: 'hour', // Round time intervals

        },
        min: periodBoundary,
        max: Date.now(),
        grid: {
          color: "#BFC2DA",
          
        },
        ticks: {
          color: "#6972A8",
          maxTicksLimit: 4,
          font: {
            size: 16,
          },
          callback: function (label, index, labels) {
            const parsedDate = new Date(label);
            const formattedDate = format(parsedDate, "MMM d");
            const secondLine =
              currentPeriod === "24h" ? format(parsedDate, "HH:00") : format(parsedDate, "yyyy");
            return [formattedDate, secondLine];
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Bodenfeuchte (%)",
          color: "#6972A8",
          font: {
            size: 18,
          },
          padding: {
            top: 10,
          },
        },
        min: 0,
        // max: 200,
        grid: {
          color: "#BFC2DA",

        },
        ticks: {
          maxTicksLimit: 4,
          color: "#6972A8",
          font: {
            size: 16,
          },
        },
      },
    },
  };

  return (
    <div className="w-100 h-100">
      <Line key={windowSize} data={chartData} options={options} />
    </div>
  );
};

export default MultiLineChart;