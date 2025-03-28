import Chart from "chart.js/auto";
import { format } from 'date-fns';
import React, { useEffect, useRef } from "react";

const BarChart = ({ barChartConfig, barChartData }) => {


  //const firstTimeValue = barChartData.length > 0 ? new Date(barChartData[1].time) : new Date();

    // creates a timestamp thats 23 hours earlier than current time - used to set the min boundary of x-axis 
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    const twentyFourHoursAgoTimestamp = Date.now() - (22 * 60 * 60 * 1000);


  const barChartRef = useRef(null);




  useEffect(() => {
    if (!barChartRef.current || !barChartConfig || !barChartData) {
      return ;
    }


      // Normalize the barChartData format
      const normalizedBarChartData = Array.isArray(barChartData[0])
      ? barChartData[0]
      : barChartData;

    // Extract and format labels
    const labels = normalizedBarChartData.map(dataPoint => {
      let date = new Date(dataPoint.time);
      return date;
  });


    // Extract datasets
    const datasets = Array.isArray(barChartData[0])
      ? barChartData.map((data, index) => ({
          label: barChartConfig.datasets[index].label,
          data: data.map(dataPoint => parseFloat(dataPoint.value)),
          borderColor: barChartConfig.datasets[index].borderColor,
          backgroundColor: barChartConfig.datasets[index].backgroundColor,
          fill: barChartConfig.datasets[index].fill,
        }))
      : [
          {
            label: barChartConfig.datasets[0].label,
            data: normalizedBarChartData.map(dataPoint => parseFloat(dataPoint.value)),
            borderColor: barChartConfig.datasets[0].borderColor,
            backgroundColor: barChartConfig.datasets[0].backgroundColor,
            fill: barChartConfig.datasets[0].fill,
          },
        ];


    const barChartConfiguration = {
      type: "bar",
      data: {
        labels: labels,
        datasets: datasets,
        barThickness: "flex",

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
            offset: false,
            type: 'timeseries', 
            min:twentyFourHoursAgoTimestamp,
            max: Date.now(),

            grid: {
              offset: false,
              color: "lightgrey"
            },

            // time: {
            //   displayFormats: {
            //     hour: 'MMM d, HH:00', // Customize the display format for hours
            //   },

            // },
            ticks: {
              autoSkip:false,
              stepSize: 1, 

              callback: function(label, index, labels) {
                const parsedDate = new Date(label);
                const formattedDate = format(parsedDate, "MMM d, HH:00").split(", ");
                return [formattedDate[0], formattedDate[1]];
            },
              maxTicksLimit: 4,
              color: "#6972A8",
              font: {
                size: 16,
              },
              
            },
          },
          y: {
            grid: {
              color: "lightgrey",
            },
            max:20,
            ticks: {
              precision:0,      //display integers instead of floats
              maxTicksLimit: 4,
              color: "#6972A8",
              font: {
                size: 16,
              },
            },
          },
        },
        plugins: {
          title: {
            text: barChartConfig.plugins.title.text,
            padding: {
              top:10,
              bottom:20},

            display: "yes",
            color: "#18204F",
            font: {
              size: "20",
            },
          },
          legend: {
            display: false,
            labels: {
              color: "lightgrey",
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
            const maxValue = Math.max(...barChartData.map(dataPoint => dataPoint.value));
     // Check if the maximum value is 0
     if (maxValue === 0) {
      ctx.save();

      const text =
        "kein Niederschlag im dargestellten Zeitraum";
      const maxWidth = width - 20; // Adjust according to your needs
      const lineHeight = 20; // Adjust according to your needs
      const xCenter = left + (right - left) / 2;
      const yCenter = top + (height / 2) - 8;
      const fontSize = window.innerWidth < 768 ? "1rem" : "1.2rem";

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

      // Call wrapText function
      wrapText(text, xCenter, yCenter, maxWidth, lineHeight);

      ctx.restore();
    }

   },
        },
      ],
    };

    // Add barThickness, maxBarThickness, and barPercentage properties to the datasets
barChartConfiguration.data.datasets.forEach(dataset => {
  dataset.barThickness = 20; // Fixed thickness for bars
  dataset.maxBarThickness = 50; // Maximum thickness for bars
  dataset.categoryPercentage = 0.8; // Percentage of the category width the bars should occupy
  dataset.barPercentage = 0.9; // Percentage of the available space the bars should occupy
});

    const barChart = new Chart(barChartRef.current, barChartConfiguration);

    return () => {
      barChart.destroy();
    };
  }, [barChartConfig, barChartData]);

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

