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



const WolfsteinForecastBarChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

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
                            backgroundColor: 'rgba(75, 192, 192, 1)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
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
            time: {
                unit: 'day', // Show each day on the x-axis
                tooltipFormat: 'yyyy-MM-dd HH:mm', // Tooltip format
                displayFormats: {
                    day: 'yyyy-MM-dd', // Format for x-axis labels
                },
            },
            grid: {
              offset: false,
                color: 'lightgrey',
                borderColor: 'lightgrey', // Color of the border gridline
                borderWidth: 1,
                lineWidth: 1, // Grid line width
                drawOnChartArea: true, // Ensure grid lines are drawn within the chart area
                drawTicks: true, // Ensure grid lines are drawn for ticks
                tickMarkLength: 5, // Adjust grid line length for ticks
                offsetGridLines: false, // Don't offset grid lines
            },
            ticks: {

              stepSize: 1, // Ensure one tick per day

                maxTicksLimit: 5, // Limit the number of ticks (days in this case)
                color: 'lightgrey',
                font: {
                    size: 14,
                },
            },
        },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'lightgrey',
                },
                ticks: {
                    maxTicksLimit: 4,
                    color: 'lightgrey',
                    font: {
                        size: 14,
                    },
                },
                title: {
                    display: true,
                    text: 'Niederschlag (mm / 3h)',
                    color: 'lightgrey',
                    font: {
                        size: 16,
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
                text: 'Niederschlagsvorhersage (5 Tage)',
                color: 'lightgrey',
                font: {
                    size: 18,
                    weight: 'bolder',
                },
            },
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className="w-100 h-100">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default WolfsteinForecastBarChart;
