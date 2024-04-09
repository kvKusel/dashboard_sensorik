import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const WindDirectionChart = () => {
  const chartRef = useRef(null);
  let windDirectionChart = null;

  // Placeholder data for wind direction (one value)
  const directionPlaceholder = [0, 0, 0, 0, 100, 0, 0, 0]; // 100 represents the direction (S, South)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      windDirectionChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
          datasets: [{
            label: 'Wind Direction',
            data: directionPlaceholder,
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              '#6499E9',              'rgba(255, 159, 64, 0.5)',
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              '#6499E9', 
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          aspectRatio: 2,
          responsive: true,
          maintainAspectRatio: false,
                    scales: {
            r: {
              angleLines: {
                display: true,
                color: 'black'
              },
              grid: {
                circular: false,
                display: true,
                color: 'black'
              },

              ticks: {
                display: false,
                stepSize: 50
              },
              pointLabels: {
                display: false,
                centerPointLabels: false,
                font: {
                  size: 18
                }
              }
            }
          },
          plugins: {
            legend: {
              position: 'top',
              display:false,
            },
            title: {
              display: false,
              text: 'Chart.js Polar Area Chart With Centered Point Labels'
            }
          }
        },
      });
    }

    // Cleanup function to destroy chart instance
    return () => {
      if (windDirectionChart) {
        windDirectionChart.destroy();
      }
    };
  }, []);

  return (
    <div>
      <canvas ref={chartRef}
      ></canvas>
    </div>
  );
};

export default WindDirectionChart;
