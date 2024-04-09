import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const HorizontalBarChart = () => {
  const chartRef = useRef(null);
  let horizontalBarChart = null;

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (horizontalBarChart) {
        horizontalBarChart.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      horizontalBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['January'],
          datasets: [
            {
            data: [80],
            backgroundColor: '#6499E9',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            barThickness: 'flex', // Adjust the thickness of the bars
            barPercentage: 0.5,
            categoryPercentage:1,
                
          },
          {
            data: [20],
            backgroundColor: '#DDF2FD',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 0,
            barThickness: 'flex', // Adjust the thickness of the bars
            barPercentage: 0.5,
            categoryPercentage:1,
          }]
        },
        options: {
          maxBarThickness:"30",
                  responsive: true,
        maintainAspectRatio: false,
          indexAxis: 'y',
          scales: {
            x: {
                stacked: true,
              beginAtZero: true,
              max: 100, // Set maximum value for the x-axis scale
              display: false // Hide x-axis

            },
            y: {
                stacked: true,

              display: false // Hide y-axis
            }
          },
          plugins: {
            legend: {
              display: false // Hide legend
            },
            title: {
              display: false, // Hide title
              text: 'Luftfeuchte',

            },
            subtitle: {
                display: false, // Hide title
                text: '80%',
                position: 'bottom',
  
              },
            tooltip: {
              enabled: false // Disable tooltip
            }
          },
          layout: {
            padding: 0 // Remove padding
          }
        }
      });
    }

    // Cleanup function to destroy chart instance
    return () => {
      if (horizontalBarChart) {
        horizontalBarChart.destroy();
      }
    };
  }, []);

  return (
    <div className='d-flex justify-content-center align-items-center p-2' style={{maxWidth: "80%"}}>
      <canvas  className=''  ref={chartRef}></canvas>
    </div>
  );
};

export default HorizontalBarChart;
