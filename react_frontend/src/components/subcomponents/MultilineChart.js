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

const MultiLineChart = ({
  waterLevelKreisverwaltung,
  waterLevelRutsweiler,
  waterLevelKreimbach,
  waterLevelWolfstein,
  waterLevelLauterecken1,
  waterLevelKreimbach1,
  waterLevelKreimbach3,
  currentPeriod,
  activeDataset = null // This will be the dataset we want to show
}) => {
  // Create a ref to the chart instance
  const chartRef = React.useRef(null);

  // Define the noDatasetPlugin
  const noDatasetPlugin = {
    id: 'noDatasetMessage',
    beforeDraw: (chart) => {
      const anyDatasetVisible = chart.data.datasets.some(
        (dataset, index) => chart.isDatasetVisible(index)
      );
      
      if (!anyDatasetVisible) {
        const { ctx, chartArea } = chart;
        if (chartArea) {
          const { top, left, width, height } = chartArea;
          
          ctx.save();
          const text = "Pegel aus Tabelle oder Legende auswählen, um die Daten anzuzeigen.";
          const maxWidth = width - 20;
          const lineHeight = 20;
          const xCenter = left + (width / 2);
          const yCenter = top + (height / 2) - 6;
          
          ctx.font = "1rem Poppins, sans-serif";
          ctx.fillStyle = "lightgrey";
          ctx.textAlign = "center";
          
          // Function to wrap text
          function wrapText(text, x, y, maxWidth, lineHeight) {
            const words = text.split(" ");
            let line = "";
            let yPosition = y;
            
            for (let word of words) {
              const testLine = line + word + " ";
              const metrics = ctx.measureText(testLine);
              const testWidth = metrics.width;
              
              if (testWidth > maxWidth && line !== "") {
                ctx.fillText(line, x, yPosition);
                line = word + " ";
                yPosition += lineHeight;
              } else {
                line = testLine;
              }
            }
            
            ctx.fillText(line, x, yPosition);
          }
          
          // Call wrapText function
          wrapText(text, xCenter, yCenter, maxWidth, lineHeight);
          ctx.restore();
        }
      }
    }
  };

  // Use effect to update dataset visibility when activeDataset changes
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      
      // Map dataset name to index
      const datasetIndices = {
        lastValueWolfstein: 0,
        lastValueRutsweiler: 1,
        lastValueKreimbach1: 2,
        lastValueKreimbach3: 3,
        lastValueKreimbach4: 4,
        lastValueLauterecken1: 5,
        lastValueKreisverwaltung: 6
      };
      
      // Hide all datasets
      chart.data.datasets.forEach((dataset, index) => {
        chart.setDatasetVisibility(index, false);
      });
      
      // Show only the active dataset if it exists
      if (activeDataset) {
        const indexToShow = datasetIndices[activeDataset];
        if (indexToShow !== undefined) {
          chart.setDatasetVisibility(indexToShow, true);
        }
      }
      
      chart.update();
    }
  }, [activeDataset]);

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
    return data.map((item) => ({
      x: new Date(item.time).getTime(),
      y: item.value,
    }));
  };

  const chartData = {
    datasets: [
      {
        label: "Pegel Wolfstein",
        data: createDataset(waterLevelWolfstein),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.2,
        hidden: true
      },
      {
        label: "Pegel Rutsweiler a.d. Lauter",
        data: createDataset(waterLevelRutsweiler),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.2,
        hidden: true
      },
      {
        label: "Pegel Kreimbach 1",
        data: createDataset(waterLevelKreimbach1),
        borderColor: "rgb(255, 0, 255)",
        backgroundColor: "rgba(255, 0, 255, 0.2)",
        tension: 0.2,
        hidden: true
      },
      {
        label: "Pegel Kreimbach 3",
        data: createDataset(waterLevelKreimbach3),
        borderColor: "rgb(219, 6, 77)",
        backgroundColor: "rgba(219, 6, 77, 0.2)",
        tension: 0.2,
        hidden: true
      },
      {
        label: "Pegel Kreimbach 4",
        data: createDataset(waterLevelKreimbach),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.2,
        hidden: true
      },
      {
        label: "Pegel Lauterecken 1",
        data: createDataset(waterLevelLauterecken1),
        borderColor: "rgb(238, 255, 0)",
        backgroundColor: "rgba(238, 255, 0, 0.2)",
        tension: 0.2,
        hidden: true
      },
      {
        label: "Pegel Kusel",
        data: createDataset(waterLevelKreisverwaltung),
        borderColor: "rgb(37, 190, 70)",
        backgroundColor: "rgba(37, 190, 70, 0.2)",
        tension: 0.2,
        hidden: true
      },
    ],
  };

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
            size: "16rem",
          },
        },
        position: "bottom",
        align: "start",
      },
    },
    scales: {
      x: {
        type: "timeseries",
        time: {
          unit: currentPeriod === "24h" ? "hour" : "day",
          displayFormats: {
            hour: "MMM d, HH:00",
            day: "MMM d",
          },
        },
        min: periodBoundary,
        max: Date.now(),
        grid: {
          color: "lightgrey",
        },
        ticks: {
          color: "lightgrey",
          maxTicksLimit: 4,
          font: {
            size: 14,
          },
          callback: function (label, index, labels) {
            const parsedDate = new Date(label);
            const formattedDate = format(parsedDate, "MMM d");
            const secondLine =
              currentPeriod === "24h"
                ? format(parsedDate, "HH:00")
                : format(parsedDate, "yyyy");
            return [formattedDate, secondLine];
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Wasserstand (cm)",
          color: "lightgrey",
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
          color: "lightgrey",
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="w-100 h-100">
      <Line 
        ref={chartRef} 
        data={chartData} 
        options={options} 
        plugins={[noDatasetPlugin]} 
      />
    </div>
  );
};

export default MultiLineChart;