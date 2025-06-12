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
import "chartjs-adapter-date-fns";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import axios from "axios";

ChartJS.register(TimeScale, LinearScale, BarElement, Title, Tooltip, Legend);

const noPrecipitationPluginHistorical = {
  id: "noPrecipitationPluginHistorical",
  afterDraw: (chart) => {
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y },
    } = chart;

    if (!chart.data || !chart.data.datasets || !chart.data.datasets[0]) {
      return;
    }

    const maxValue = Math.max(...chart.data.datasets[0].data);

    if (maxValue === 0) {
      const fontSize = window.innerWidth < 768 ? "1rem" : "1.2rem";

      ctx.save();

      const text = "kein Niederschlag im dargestellten Zeitraum";
      const maxWidth = width - 20;
      const lineHeight = 20;
      const xCenter = left + (right - left) / 2;
      const yCenter = top + height / 2 - 8;

      ctx.font = `${fontSize} Poppins, sans-serif`;
      ctx.fillStyle = "#6972A8";
      ctx.textAlign = "center";

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

      wrapText(text, xCenter, yCenter, maxWidth, lineHeight);

      ctx.restore();
    }
  },
};

const WolfsteinHistoricalBarChart = ({
  currentPeriodHistoricalPrecipitation,
  historicalPrecipitationWolfstein,
  lohnweilerPrecipitation,
}) => {
  const [chartData, setChartData] = useState(null);
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const getPeriodTimeRange = (period) => {
    const now = new Date();
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);
    const startOfPeriod = new Date(endOfToday);

    switch (period) {
      case "24h": startOfPeriod.setDate(endOfToday.getDate() - 1); break;
      case "7d": startOfPeriod.setDate(endOfToday.getDate() - 7); break;
      case "30d": startOfPeriod.setDate(endOfToday.getDate() - 30); break;
      case "365d": startOfPeriod.setDate(endOfToday.getDate() - 365); break;
      default: startOfPeriod.setDate(endOfToday.getDate() - 1);
    }

    startOfPeriod.setHours(0, 0, 0, 0);
    return { start: startOfPeriod.getTime(), end: endOfToday.getTime() };
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (historicalPrecipitationWolfstein && lohnweilerPrecipitation) {
      setChartData({
        labels: historicalPrecipitationWolfstein.labels,
        datasets: [
          {
            label: "Lohnweiler Niederschlag (mm)",
            data: lohnweilerPrecipitation,
            backgroundColor: "rgba(90, 41, 182, 1)",
            borderColor: "rgb(90, 41, 182)",
            borderWidth: 1,
            barThickness: 15,
            maxBarThickness: 30,
          },
          {
            label: "Wolfstein Niederschlag (mm)",
            data: historicalPrecipitationWolfstein.precipitationValues,
            backgroundColor: "rgba(120, 179, 255, 1)",
            borderColor: "rgb(120, 179, 255)",
            borderWidth: 1,
            barThickness: 15,
            maxBarThickness: 30,
          },
        ],
      });
    }
  }, [historicalPrecipitationWolfstein, lohnweilerPrecipitation, currentPeriodHistoricalPrecipitation]);

  const { start: xMin, end: xMax } = getPeriodTimeRange(currentPeriodHistoricalPrecipitation);


  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        min: xMin,
        max: xMax,
        offset: false,
        time: {
          unit: currentPeriodHistoricalPrecipitation === "24h" ? "hour" : "day",
          tooltipFormat: "yyyy-MM-dd HH:mm",
          displayFormats: {
            hour: "MMM d, HH:00",
            day: "MMM d",
          },
          bounds: "ticks",
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
          font: { size: 16 },
          callback: function (label) {
            const parsedDate = new Date(label);
            const formattedDate = format(parsedDate, "MMM d");
            const secondLine = currentPeriodHistoricalPrecipitation === "24h"
              ? format(parsedDate, "HH:00")
              : format(parsedDate, "yyyy");
            return [formattedDate, secondLine];
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: { lineWidth: 2, color: "#BFC2DA" },
        ticks: {
          maxTicksLimit: 4,
          color: "#6972A8",
          font: { size: 16 },
        },
        title: {
          display: true,
          text: "Niederschlag (mm/h)",
          color: "#6972A8",
          font: { size: 18 },
          padding: { top: 10 },
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Niederschlag - Rückblick",
        padding: { bottom: 20 },
        color: "#18204F",
        font: { size: 20, weight: "bolder" },
      },
      legend: { display: true },
    },
  };

  if (!chartData) return null;

  return (
    <div className="w-100 h-100">
      <Bar
        data={chartData}
        options={options}
        key={windowSize}
        plugins={[noPrecipitationPluginHistorical]}
      />
    </div>
  );
};

export default WolfsteinHistoricalBarChart;
