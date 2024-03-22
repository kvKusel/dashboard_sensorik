import React, { useEffect, useRef } from "react";
import Chart, { plugins } from "chart.js/auto";
import { format } from 'date-fns';

const BarChart = ({ barChartConfig, barChartData }) => {

    // creates a timestamp thats 23 hours earlier than current time - used to set the min boundary of x-axis 
    const twentyFourHoursAgoTimestamp = Date.now() - (23 * 60 * 60 * 1000);

  //get the needed data from the props
  const { backgroundColor } = barChartConfig.datasets[0];
  const labels = barChartData.map(dataPoint => dataPoint.time);
  const dataPoints = barChartData.map(dataPoint => parseFloat(dataPoint.value));

  const barChartRef = useRef(null);

  useEffect(() => {
    if (!barChartRef.current || !barChartConfig || !barChartData) {
      return ;
    }

    const barChartConfiguration = {
      type: "bar",
      data: {
        labels: 
        
        barChartData.map(dataPoint => dataPoint.time),

        // barChartData.map((dataPoint) => {
        //   const date = new Date(dataPoint.time);
        //   const monthAndDay = date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
        //   let hours = date.getHours();
        //   if (hours === 24) {
        //     hours = '00';
        //   } else {
        //     hours = hours.toString().padStart(2, '0');
        //   }
        //   const minutes = date.getMinutes().toString().padStart(2, '0');
        //   return [monthAndDay, `${hours}:${minutes}`];
        // }) || [],



                datasets: [{
          data: dataPoints,
          backgroundColor: backgroundColor,
        }] || [],
      },
      options: {
        animations: false,
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            // left: 50, // Adjust as needed
            // right: 50, // Adjust as needed
            // top: 5, // Adjust as needed
            // bottom: 5, // Adjust as needed
          },
        },
        scales: {
          x: {
            type: 'time', 
            min:new Date(twentyFourHoursAgoTimestamp),
            grid: {
              offset: false,
            },

            // time: {
            //   displayFormats: {
            //     hour: 'MMM d, HH:00', // Customize the display format for hours
            //   },

            // },
            ticks: {
              stepSize: 1, // 6 hours in milliseconds

              callback: function(label, index, labels) {
                const parsedDate = new Date(label);
                const formattedDate = format(parsedDate, "MMM d, HH:00").split(", ");
                return [formattedDate[0], formattedDate[1]];
            },
              maxTicksLimit: 4,
              color: "black",
              font: {
                size: 14,
              },
              
            },
          },
          y: {
            max:20,
            ticks: {
              precision:0,      //display integers instead of floats
              maxTicksLimit: 4,
              color: "black",
              font: {
                size: 14,
              },
            },
          },
        },
        plugins: {
          title: {
            text: barChartConfig.plugins.title.text,
            display: "yes",
            color: "black",
            font: {
              size: "18rem",
            },
          },
          legend: {
            display: false,
            labels: {
              color: "black",
              font: {
                size: "18rem",
              },
            },
            position: "bottom",
          },
        },
      },
      plugins: [
          {
          beforeDraw: (chart, args, options) => {
            const {
              ctx,
              chartArea: { top, right, bottom, left, width, height },
              scales: { x, y },
            } = chart;

            // display the text 'kein Niederschlag im dargestellten Zeitraum' only if there is no precipitation to show (maxValue = 0)
            // const { datasets } = chart.options.data;
            console.log(barChartData)
            const maxValue = Math.max(...barChartData.map(dataPoint => dataPoint.value));
            console.log(maxValue)
     // Check if the maximum value is 0
     if (maxValue === 0) {
      ctx.save();

      const text =
        "kein Niederschlag im dargestellten Zeitraum!";
      const maxWidth = width - 20; // Adjust according to your needs
      const lineHeight = 20; // Adjust according to your needs
      const xCenter = left + (right - left) / 2;
      const yCenter = top + (bottom - top) / 2;

      ctx.font = "1rem Poppins, sans-serif";
      ctx.fillStyle = "black";
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

      // Call wrapText function
      wrapText(text, xCenter, yCenter, maxWidth, lineHeight);

      ctx.restore();
    }

   },
        },
      ],
    };

    const barChart = new Chart(barChartRef.current, barChartConfiguration);

    return () => {
      barChart.destroy();
    };
  }, [barChartConfig, barChartData, backgroundColor, labels, dataPoints]);

  return (
    <canvas
      ref={barChartRef}
      className="h-100 w-100"
      style={{ position: "relative",
              minHeight:"200px" }}
    ></canvas>
  );
};

export default BarChart;

