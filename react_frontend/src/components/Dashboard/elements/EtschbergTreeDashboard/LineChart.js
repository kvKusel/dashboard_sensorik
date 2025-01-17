import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChartEtschberg = () => {
  // Sample data for the line chart
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May'], // X-axis labels
    datasets: [
      {
        label: 'Sample Data', // Dataset label
        data: [65, 59, 80, 81, 56], // Y-axis data
        fill: false, // Don't fill the area under the line
        borderColor: 'rgb(75, 192, 192)', // Line color
        tension: 0.1, // Line smoothness
      },
    ],
  };

  // Chart options (optional customization)
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: 'Sample Line Chart',
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '80%', height: '400px', margin: 'auto' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChartEtschberg;
