import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Weight } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Utility functions for generating random data and colors
const Utils = {
  numbers: ({ count, min, max }) => Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min),
  months: ({ count }) => ['January', 'February', 'March', 'April', 'May', 'June', 'July'].slice(0, count),
  CHART_COLORS: { red: 'rgb(255, 99, 132)', blue: 'rgb(54, 162, 235)', green: 'rgb(140, 253, 48)' },
  transparentize: (color, opacity) => color.replace('rgb', 'rgba').replace(')', `, ${opacity})`)
};

const MultiLineChart = () => {
  // Initial labels and data
  const labels = Utils.months({ count: 7 });
  const NUMBER_CFG = { count: 7, min: 0, max: 20 };
  const initialData = {
    labels,
    datasets: [
      {
        label: 'Pegel Wolfstein',
        data: Utils.numbers(NUMBER_CFG),
        borderColor: Utils.CHART_COLORS.red,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
        yAxisID: 'y',
      },
      {
        label: 'Pegel Rutsweiler a.d. Lauter',
        data: Utils.numbers(NUMBER_CFG),
        borderColor: Utils.CHART_COLORS.blue,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
        yAxisID: 'y1',
      },
      {
        label: 'Pegel Kreimbach-Kaulbach',
        data: Utils.numbers(NUMBER_CFG),
        borderColor: Utils.CHART_COLORS.green,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.green, 0.5),
        yAxisID: 'y1',
      }
    ],
  };

  const [chartData, setChartData] = useState(initialData);

  // Calculate the maximum y value dynamically
  const calculateMaxY = () => {
    const allData = chartData.datasets.flatMap(dataset => dataset.data);
    return Math.max(...allData) + 10; // Add buffer of 10
  };

  // Chart configuration options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Pegelstände - zeitlicher Verlauf',
        color: "lightgrey",
        font: {
          size: "18rem",
          weight: 'bolder'
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
        align: "start"
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: 'Zeitstempel', // X-axis title
          color: 'lightgrey',
          font: {
            size: 16,
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
      y: {
        title: {
          display: true,
          text: 'Wasserstand (m)', // Y-axis title
          color: 'lightgrey',
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
        type: 'linear',
        min: 0,
        max: calculateMaxY(), // Dynamically calculated max
        display: true,
        position: 'left',
      },
      y1: {
        grid: {
          color: "lightgrey",
        },
        type: 'linear',
        min: 0,
        max: calculateMaxY(), // Same max for secondary axis if needed
        display: false,
        position: 'left',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Action to randomize data
  const randomizeData = () => {
    const newData = {
      ...chartData,
      datasets: chartData.datasets.map(dataset => ({
        ...dataset,
        data: Utils.numbers(NUMBER_CFG),
      })),
    };
    setChartData(newData);
  };

  return (
    <div className='w-100 h-100'>
      <Line data={chartData} options={options} />
      {/* Uncomment to randomize data */}
      {/* <button onClick={randomizeData} style={{ marginTop: '20px' }}>
        Randomize
      </button> */}
    </div>
  );
};

export default MultiLineChart;

