import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Import only Chart, not plugins
import { format } from 'date-fns';


const LineChart = ({ lineChartConfig, lineData, selectedTree, id }) => {

  const lineChartRef = useRef(null);

  // creates a timestamp thats 23 hours earlier than current time - used to set the min boundary of x-axis 
  const twentyFourHoursAgoTimestamp = Date.now() - (23 * 60 * 60 * 1000);


  useEffect(() => {
    if (!lineChartRef.current || !lineChartConfig || !lineData) {
      return;
    }

    console.log(        lineData.map(dataPoint => dataPoint.time),
    )

    const lineChartConfigurationStandard = {
      type: "line",
      data: {
        labels: 
          lineData.map(dataPoint => dataPoint.time),

        // lineData.map((dataPoint) => {
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
        
              datasets: [
          {
            data: lineData.map((dataPoint) => parseFloat(dataPoint.value)),
            borderColor: lineChartConfig.datasets[0].borderColor,
            fill: lineChartConfig.datasets[0].fill,
            hidden: false,
            backgroundColor: lineChartConfig.datasets[0].backgroundColor,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          // padding: {
          //   left: 50,
          //   right: 50,
          //   top: 5,
          //   bottom: 5,
          // },
        },
        scales: {
          x: {
            type: "time",
            // time: {
            //   displayFormats: {
            //     hour: "MMM d, HH:00",
            //   },
              
            // },
            min:new Date(twentyFourHoursAgoTimestamp),
            
            ticks: {
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
            ticks: {

              precision:0,
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
            text: lineChartConfig.plugins.title.text,
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
    };

    let lineChartConfiguration;

    if ((!selectedTree || selectedTree.id === 6) && id !== 'temperatureChart') {
      lineChartConfiguration = {
        type: "line",
        data: {
          labels: [],
          datasets: [],
        },

        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            // padding: {
            //   left: 50,
            //   right: 50,
            //   top: 5,
            //   bottom: 5,
            // },
          },
          scales: {
            x: {
              type: "timeseries",
              time: {
                unit: "day",
                displayFormats: {
                  hour: "MMM d, HH:00",
                },
              },
              ticks: {
                
                maxTicksLimit: 3,
                // minTicksLimit: 5, // Set a minimum number of ticks
                // stepSize: 150,
                // autoSkip: false,
                color: "black",
                font: {
                  size: 14,
                },
              },
            },
            y: {
              min: 0,
              max: 60,
              ticks: {
                precision:0,
                maxTicksLimit: 4,
                // stepSize: 25, // Adjust the step size as needed
                color: "black",
                font: {
                  size: 14,
                },
              },
            },
          },

          plugins: {
            title: {
              text: lineChartConfig.plugins.title.text,
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
          // {
          //   beforeDraw: (chart, args, options) => {
          //     const {
          //       ctx,
          //       chartArea: { top, right, bottom, left, width, height },
          //       scales: { x, y },
          //     } = chart;
          //     ctx.save();
          //     ctx.strokeStyle = "green";
          //     ctx.strokeRect(left, y.getPixelForValue(45), width, 0);
          //     ctx.restore();
          //   },
          // },
          // {
          //   beforeDraw: (chart, args, options) => {
          //     const {
          //       ctx,
          //       chartArea: { top, right, bottom, left, width, height },
          //       scales: { x, y },
          //     } = chart;
          //     ctx.save();
          //     ctx.strokeStyle = "green";
          //     ctx.strokeRect(left, y.getPixelForValue(40), width, 0);
          //     ctx.restore();
          //   },
          // },
          {
            beforeDraw: (chart, args, options) => {
              const {
                ctx,
                chartArea: { top, right, bottom, left, width, height },
                scales: { x, y },
              } = chart;
              ctx.save();

              const text =
                "Bitte einen Baum auswählen, um die Daten anzuzeigen";
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
            },
          },
        ],
      };
    } else {
      // Use the regular lineChartConfig when selectedTree is defined
      lineChartConfiguration = lineChartConfigurationStandard;
    }

    console.log(lineChartConfiguration);

    const lineChart = new Chart(lineChartRef.current, lineChartConfiguration);

    return () => {
      lineChart.destroy();
    };
  }, [lineChartConfig, lineData, selectedTree, id]);

  return (
    <canvas
      ref={lineChartRef}
      className="h-100 w-100"
      style={{ position: "relative",
                minHeight:"200px"}}
    ></canvas>
  );
};

export default LineChart;