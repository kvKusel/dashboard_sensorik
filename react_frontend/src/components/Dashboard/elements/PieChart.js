// components/Dashboard/PieChart.js
import React, { useEffect, useRef } from 'react';
import { Paper, Typography } from '@mui/material';
import Chart from 'chart.js/auto';

const PieChart = () => {
  const pieChartRef = useRef(null);

  useEffect(() => {
    const pieChartData = {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          label: 'My Pie Dataset',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const pieChartConfig = {
      type: 'pie',
      data: pieChartData,
      options: {
        plugins: {
          legend: {
            position: 'right',
          },
        },
        responsive: true, // Enable responsiveness
        maintainAspectRatio: false, // Do not maintain aspect ratio
      },
    };

    // Create the pie chart
    const pieChart = new Chart(pieChartRef.current, pieChartConfig);

    // Clean up the chart on component unmount
    return () => {
      pieChart.destroy();
    };
  }, []);

  return (
    <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Pie Chart
      </Typography>
      <div style={{ height: '200px', width: '100%' }}>
        <canvas ref={pieChartRef}></canvas>
      </div>
      <Typography>Some Pie Chart Data...</Typography>
    </Paper>
  );
};

export default PieChart;
