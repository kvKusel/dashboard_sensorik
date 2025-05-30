import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, TimeScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import axios from 'axios'; 


// Register the necessary components
ChartJS.register(TimeScale, LinearScale, BarElement, Title, Tooltip, Legend);


const API_URL = process.env.REACT_APP_API_URL.endsWith('/')
  ? process.env.REACT_APP_API_URL
  : `${process.env.REACT_APP_API_URL}/`;

 

// Define the custom plugin before registering it
const noPrecipitationPluginHistorical = {
    id: 'noPrecipitationPluginHistorical',
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


// Register the plugin using the new method
// ChartJS.register(noPrecipitationPluginHistorical);



const WolfsteinHistoricalBarChart = ({ currentPeriodHistoricalPrecipitation, historicalPrecipitationWolfstein }) => {
    const [chartData, setChartData] = useState(null);

        const [windowSize, setWindowSize] = useState(window.innerWidth);
      
      useEffect(() => {
        const handleResize = () => {
          setWindowSize(window.innerWidth); // Change state on resize
        };
      
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    useEffect(() => {
        if (historicalPrecipitationWolfstein) {
            setChartData({
                labels: historicalPrecipitationWolfstein.labels,
                datasets: [
                    {
                        label: 'Niederschlag (mm)',
                        data: historicalPrecipitationWolfstein.precipitationValues,
                        backgroundColor: 'rgba(90, 41, 182, 1)',
                        borderColor: 'rgb(90, 41, 182)',
                        borderWidth: 1,
                        barThickness: 15, // Set your desired minimum thickness here
                        maxBarThickness: 30, // Optional: set a maximum thickness

                    },
                ],
            },);
        ;

        }
    }, [historicalPrecipitationWolfstein, currentPeriodHistoricalPrecipitation]);

    const options = {
        maintainAspectRatio: false,
        scales: {
   // Replace your x-axis configuration in the options object with this:
// Replace your x-axis configuration with this simplified version (matching forecast):
x: {
    type: 'time',
    time: {
        unit: currentPeriodHistoricalPrecipitation === '24h' ? 'hour' : 'day',
        tooltipFormat: 'yyyy-MM-dd HH:mm',
        displayFormats: {
            hour: 'MMM d, HH:00',
            day: 'MMM d'
        },
    },
    grid: {
        offset: false,
        color: '#BFC2DA',
        borderColor: '#6972A8',
        borderWidth: 1,
        lineWidth: 2,
        drawOnChartArea: true,
        drawTicks: true,
        tickMarkLength: 5,
        offsetGridLines: false,
    },
    ticks: {
        maxTicksLimit: 5, // Brought back as requested
        minTicksLimit: 5,
        
        // 45 degree rotation only for small screens
        maxRotation: windowSize < 768 ? 45 : 0,
        minRotation: windowSize < 768 ? 45 : 0,
        
        color: '#6972A8',
        font: {
            size: 16,
        },
        callback: function (label, index, labels) {
            const parsedDate = new Date(label);
            const formattedDate = format(parsedDate, "MMM d");
            const secondLine = currentPeriodHistoricalPrecipitation === "24h" 
                ? format(parsedDate, "HH:00") 
                : format(parsedDate, "yyyy");
            
            // For rotated labels, you might want to combine into single line
            // or keep separate lines - test what looks better
            return currentPeriodHistoricalPrecipitation === "24h" 
                ? [formattedDate, secondLine]  // Keep two lines for hourly
                : `${formattedDate} ${secondLine}`;  // Single line for daily
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
                    text: 'Niederschlag (mm/h)',
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
                text: 'Niederschlag - Rückblick',
                padding: {bottom:20},

                color: '#18204F',
                font: {
                    size: 20,
                    weight: 'bolder',
                },
            },
            legend: {
                display: false,
            },
            // noPrecipitationPluginHistorical  // Enable the custom plugin

        },
    };
    if (!chartData) return null; // Avoid rendering the chart until data is ready

    return (
        <div className="w-100 h-100">
            <Bar data={chartData} options={options}         key={windowSize}
 plugins={[noPrecipitationPluginHistorical]} />
        </div>
    );
};

export default WolfsteinHistoricalBarChart;
