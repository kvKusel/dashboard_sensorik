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
  waterLevelLohnweiler1,
  waterLevelHinzweiler1,
  currentPeriod,
  activeDataset = null // This will be the dataset we want to show
}) => {
  // Create a ref to the chart instance
  const chartRef = React.useRef(null);

    const [windowSize, setWindowSize] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth); // Change state on resize
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define the noDatasetPlugin
  const noDatasetPlugin = {
    id: 'noDatasetMessage',
    afterDraw: (chart) => {
      const anyDatasetVisible = chart.data.datasets.some(
        (dataset, index) => chart.isDatasetVisible(index)
      );
      
      if (!anyDatasetVisible) {
        const fontSize = window.innerWidth < 768 ? "1rem" : "1.2rem";
        const { ctx, chartArea } = chart;
        if (chartArea) {
          const { top, left, width, height } = chartArea;
          
          ctx.save();
          const text = "Pegel aus Tabelle oder Legende auswählen, um die Daten anzuzeigen";
          const maxWidth = width - 20;
          const lineHeight = 20;
          const xCenter = left + (width / 2);
          const yCenter = top + (height / 2) - 8;
          
          ctx.font = `${fontSize} Poppins, sans-serif`;
          ctx.fillStyle = "#6972A8";
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
        lastValueKreisverwaltung: 6,
        lastValueLohnweiler1: 7,
        lastValueHinzweiler1: 8,
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

  // Create datasets with actual timestamps AND filter datasets so that only every 10th data point is displayed
  const createDataset = (data) => {
    return data
      .filter((_, index) => index % 10 === 0)  // Filter every 10th data point
      .map((item) => ({
        x: new Date(item.time).getTime(),
        y: item.value,
      }));
  };



  const chartData = {
    datasets: [
      {
        label: "Pegel Wolfstein",
        data: createDataset(waterLevelWolfstein),
        borderColor: "rgba(231, 132, 78, 1)",
        backgroundColor: "rgba(231, 132, 78, 1)",
        tension: 0.2,
        hidden: true
      },
      {
        label: "Pegel Rutsweiler a.d. Lauter",
        data: createDataset(waterLevelRutsweiler),
        borderColor: "rgba(236, 200, 91, 1)",
        backgroundColor: "rgba(236, 200, 91, 1)",
        tension: 0.2,
        hidden: true
      },
      {
        label: "Pegel Kreimbach 1",
        data: createDataset(waterLevelKreimbach1),
        borderColor: "rgba(131, 201, 104, 1)",
        backgroundColor: "rgba(131, 201, 104, 1)",
        tension: 0.2,
        hidden: true
      },
      {
        label: "Pegel Kreimbach 3",
        data: createDataset(waterLevelKreimbach3),
        borderColor: "rgba(209, 67, 91, 1)",
        backgroundColor: "rgba(209, 67, 91, 1)",
        tension: 0.2,
        hidden: true
      },
      {
        label: "Pegel Kreimbach 4",
        data: createDataset(waterLevelKreimbach),
        borderColor: "rgba(78, 159, 188, 1)",
        backgroundColor: "rgba(78, 159, 188, 1)",
        tension: 0.2,
        hidden: true
      },
      {
        label: "Pegel Lauterecken 1",
        data: createDataset(waterLevelLauterecken1),
        borderColor: "rgba(74, 104, 212, 1)",
        backgroundColor: "rgba(74, 104, 212, 1)",
        tension: 0.2,
        hidden: true
      },
      {
        label: "Pegel Kusel",
        data: createDataset(waterLevelKreisverwaltung),
        borderColor: "	rgba(166, 109, 212, 1)",
        backgroundColor: "	rgba(166, 109, 212, 1)",
        tension: 0.2,
        hidden: true
      },
      {
        label: "Pegel Lohnweiler",
        data: createDataset(waterLevelLohnweiler1),
        borderColor: "	rgb(97, 3, 3)",
        backgroundColor: "	rgb(97, 3, 3)",
        tension: 0.2,
        hidden: true
      },
      {
        label: "Pegel Hinzweiler",
        data: createDataset(waterLevelHinzweiler1),
        borderColor: "	rgb(2, 102, 52)",
        backgroundColor: "	rgb(2, 102, 52)",
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
        padding: {
          top:10,
          bottom:20},        text: "Pegelstände - zeitlicher Verlauf",
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
          font: {
            size: "16",
          },
        },
        position: "bottom",
        align: "start",
      },
    },
    scales: {
      x: {
        offset: false,

        type: "time",
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
          minTicksLimit: 5, // Ensure at least 5 ticks on the axis
          
          lineWidth: 2,
          color: "#BFC2DA",
        },
        ticks: {
          callback: function(value, index) {
            return index % 10 === 0 ? this.getLabelForValue(value) : '';
          },
          color: "#6972A8",
          
          maxTicksLimit: 5,
          font: {
            size: 16,
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
          color: "#6972A8",
          font: {
            size: 18,
          },
          padding: {
            top: 10,
          },
        },
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
        key={windowSize}
      />
    </div>
  );
};

export default MultiLineChart;