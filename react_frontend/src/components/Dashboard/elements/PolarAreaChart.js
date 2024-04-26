import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const WindDirectionChart = ({windDirection}) => {
  const chartRef = useRef(null);
  let windDirectionChart = null;


  const calculateDirectionData = (windDirection) => {
    const index = Math.floor(windDirection / 45) % 8;
    return Array(8).fill(0).map((_, idx) => idx === index ? 100 : 0);
};


useEffect(() => {
  if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const directionData = calculateDirectionData(windDirection);

      if (windDirectionChart) {
          windDirectionChart.destroy();
      }

      windDirectionChart = new Chart(ctx, {
          type: 'polarArea',
          data: {
              labels: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
              datasets: [{
                  label: 'Wind Direction',
                  data: directionData,
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(75, 192, 192, 0.2)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          circular: false,
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
