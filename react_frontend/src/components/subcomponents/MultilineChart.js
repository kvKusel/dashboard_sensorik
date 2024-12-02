import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Weight } from 'lucide-react';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

  // creates a timestamp thats 23 hours earlier than current time - used to set the min boundary of x-axis 
  const twentyFourHoursAgoTimestamp = Date.now() - (22 * 60 * 60 * 1000);






  const MultiLineChart = ({ waterLevelRutsweiler }) => {


    // Extract labels (timestamps) and data (values) from waterLevelRutsweiler
    const labels = waterLevelRutsweiler.map((item) => new Date(item.time));

    const rutsweilerData = waterLevelRutsweiler.map((item) => item.value);

 

    // Chart data configuration
    const chartData = {
      labels, // Use the timestamps as labels
      datasets: [
        {
          label: 'Pegel Rutsweiler a.d. Lauter', // Dataset for waterLevelRutsweiler
          data: rutsweilerData,
          borderColor: 'rgba(75, 192, 192, 1)', // Line color for Rutsweiler
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color for Rutsweiler
          yAxisID: 'y',
        },
        {
          label: 'Pegel Wolfstein', // Placeholder dataset
          data: [200, 500, 200, 100, 200, 100, 300], // Example data
          borderColor: 'rgba(255, 99, 132, 1)', // Line color for Wolfstein
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // Fill color for Wolfstein
          yAxisID: 'y',
        },
        {
          label: 'Pegel Kreimbach-Kaulbach', // Placeholder dataset
          data: [100, 200, 300, 400, 300, 200, 300], // Example data
          borderColor: 'rgba(54, 162, 235, 1)', // Line color for Kreimbach-Kaulbach
          backgroundColor: 'rgba(54, 162, 235, 0.2)', // Fill color for Kreimbach-Kaulbach
          yAxisID: 'y',
        },
      ],
    };


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

        type: "timeseries",
        offset: false,
        min: new Date(twentyFourHoursAgoTimestamp),
        max: Date.now(),
        ticks: {
          autoSkip: false,
          callback: function (label, index, labels) {
            const parsedDate = new Date(label);
            const formattedDate = format(parsedDate, "MMM d, HH:00").split(", ");
            return [formattedDate[0], formattedDate[1]];
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
          text: 'Wasserstand (cm)', // Y-axis title
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
        max: 300, // Dynamically calculated max
        //max: calculateMaxY(), // Dynamically calculated max
        display: true,
        position: 'left',
      },
      y1: {
        grid: {
          color: "lightgrey",
          drawOnChartArea: false,

        },
        type: 'linear',
        min: 0,
        max: calculateMaxY(), // Same max for secondary axis if needed
        display: false,
        position: 'left',

      },
    },
  };



  return (
    <div className='w-100 h-100'>
      <Line data={chartData} options={options} />

    </div>
  );
};

export default MultiLineChart;

