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



const WolfsteinHistoricalBarChart = ({ currentPeriodHistoricalPrecipitation, historicalPrecipitationWolfstein }) => {
    const [chartData, setChartData] = useState(null);

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
                    },
                ],
            },);
        ;

        }
    }, [historicalPrecipitationWolfstein, currentPeriodHistoricalPrecipitation]);

    const options = {
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time', // Use time scale
                time: {
                    unit: currentPeriodHistoricalPrecipitation === '24h' ? 'hour' : 'day',
                    tooltipFormat: 'yyyy-MM-dd HH:mm', // Tooltip format
                    displayFormats: {
                        displayFormats: {
                            hour: 'MMM d, HH:00',
                            day: 'MMM d'
                          },
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
              minTicksLimit: 5, // Ensure at least 5 ticks on the axis

                maxTicksLimit: 5, // Limit the number of ticks (days in this case)
                color: 'lightgrey',
                font: {
                    size: 14,
                },
                          callback: function (label, index, labels) {
                            const parsedDate = new Date(label);
                            const formattedDate = format(parsedDate, "MMM d");
                            const secondLine =
                              currentPeriodHistoricalPrecipitation === "24h" ? format(parsedDate, "HH:00") : format(parsedDate, "yyyy");
                            return [formattedDate, secondLine];
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
                    text: 'Niederschlag (mm)',
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
                text: 'Niederschlag - Rückblick',
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
    if (!chartData) return null; // Avoid rendering the chart until data is ready

    return (
        <div className="w-100 h-100">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default WolfsteinHistoricalBarChart;
