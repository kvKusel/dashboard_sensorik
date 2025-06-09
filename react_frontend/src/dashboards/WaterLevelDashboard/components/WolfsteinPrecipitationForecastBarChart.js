import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, TimeScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import axios from 'axios'; 



const API_URL = process.env.REACT_APP_API_URL.endsWith('/')
  ? process.env.REACT_APP_API_URL
  : `${process.env.REACT_APP_API_URL}/`;


// Define the custom plugin before registering it
const noPrecipitationPlugin = {
    id: 'noPrecipitationPlugin',
    afterDraw: (chart) => {
        const {
            ctx,
            chartArea: { top, right, bottom, left, width, height },
            scales: { x, y },
        } = chart;

        // Ensure chart.data is defined
        if (!chart.data || !chart.data.datasets || !chart.data.datasets[0]) {
            return;  // Early exit if data is not ready
        }

        const maxValue = Math.max(...chart.data.datasets[0].data);

        // Check if the maximum value is 0
        if (maxValue === 0) {
            const fontSize = window.innerWidth < 768 ? "1rem" : "1.2rem";

            ctx.save();

            const text = "kein Niederschlag im dargestellten Zeitraum";
            const maxWidth = width - 20;
            const lineHeight = 20;
            const xCenter = left + (right - left) / 2;
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

            // Call wrapText function to draw the text
            wrapText(text, xCenter, yCenter, maxWidth, lineHeight);

            ctx.restore();
        }
    },
};

// Now register the necessary components
ChartJS.register(TimeScale, LinearScale, BarElement, Title, Tooltip, Legend);




const WolfsteinForecastBarChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

        const [windowSize, setWindowSize] = useState(window.innerWidth);
      
      useEffect(() => {
        const handleResize = () => {
          setWindowSize(window.innerWidth); // Change state on resize
        };
      
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    useEffect(() => {
        const fetchForecastData = async () => {
            try {
                const response = await axios.get(`${API_URL}api/forecast-data-wolfstein/`); // Update with your API endpoint
                const data = response.data; // Axios automatically parses JSON

                // Convert UNIX timestamps to CET dates and format them
                const timeZone = 'Europe/Berlin'; // CET timezone
                const labels = data.map(entry =>
                    format(toZonedTime(new Date(entry.timestamp * 1000), timeZone), 'yyyy-MM-dd HH:mm')
                );
                const precipitationValues = data.map(entry => entry.precipitation);

                // Update chart data
                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Niederschlag (mm)',
                            data: precipitationValues,
                            backgroundColor: '#AADB40',
                            borderColor: '#AADB40',
                            borderWidth: 1,
                            barThickness: 15, // Set your desired minimum thickness here
                            maxBarThickness: 30, // Optional: set a maximum thickness
                            
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching forecast data:', error);
            }
        };

        fetchForecastData();
    }, []);

    const options = {
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time', // Use time scale
                    offset: false, // This removes padding/offset
 min: new Date().setHours(0, 0, 0, 0), // Today at midnight
  max: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).setHours(23, 59, 59, 999), // 5 days from now at end of day
            time: {
                unit: 'day', // Show each day on the x-axis
                tooltipFormat: 'yyyy-MM-dd HH:mm', // Tooltip format
                displayFormats: {
                    day: 'MMM d'                },
            },
            grid: {
              offset: false,
                color: '#BFC2DA',
                borderColor: '#6972A8', // Color of the border gridline
                borderWidth: 1,
                lineWidth: 2,
                drawOnChartArea: true, // Ensure grid lines are drawn within the chart area
                drawTicks: true, // Ensure grid lines are drawn for ticks
                tickMarkLength: 5, // Adjust grid line length for ticks
                offsetGridLines: false, // Don't offset grid lines
            },
            
            ticks: {

              stepSize: 1, // Ensure one tick per day
              minTicksLimit: 4, // Limit the number of ticks (days in this case)

                maxTicksLimit: 4, // Limit the number of ticks (days in this case)
                color: '#6972A8',
                font: {
                    size: 16,
                },
                          callback: function (label, index, labels) {
                            const parsedDate = new Date(label);
                            const formattedDate = format(parsedDate, "MMM d");
                            const secondLine = format(parsedDate, "yyyy");
                            return [formattedDate, secondLine];
                          },
            },
        },
            y: {
                beginAtZero: true,
                grid: {
                    lineWidth: 2,

                    color: '#BFC2DA',
                    
                },
                ticks: {
                    maxTicksLimit: 4,
                    color: '#6972A8',
                    font: {
                        size: 16,
                    },
                },
                title: {
                    display: true,
                    text: 'Niederschlag (mm / 3h)',
                    color: '#6972A8',
                    font: {
                        size: 18,
                    },
                    padding: {
                        top: 10,
                    },
                },
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Niederschlagsvorhersage (5 Tage, Wolfstein)',
                color: '#18204F',
    padding: {
      bottom: window.innerWidth <= 576 ? 40 : 20 // 576px is Bootstrap's sm breakpoint
    },
                font: {
                    size: 20,
                    weight: 'bolder',
                },
            },
            legend: {
                display: false,
            },
            // noPrecipitationPlugin

        },
    };

    return (
        <div className="w-100 h-100">
            <Bar data={chartData} options={options}             key={windowSize}
            plugins={[noPrecipitationPlugin]} // <-- Pass the plugin object in an array HERE
            />
        </div>
    );
};

export default WolfsteinForecastBarChart;
