import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Import only Chart, not plugins
import { format } from 'date-fns';


const LineChart = ({ lineChartConfig, lineData, selectedTree, id, activeTab }) => {
  


  
  const lineChartRef = useRef(null);

  let lineChartConfiguration;

  

  // creates a timestamp thats 23 hours earlier than current time - used to set the min boundary of x-axis 
  const twentyFourHoursAgoTimestamp = Date.now() - (22 * 60 * 60 * 1000);


  useEffect(() => {
    if (!lineChartRef.current || !lineChartConfig || !lineData) {
      return ;
    }

    const labels = Array.isArray(lineData[0])
      ? lineData[0].map(dataPoint => {
          const timeValue = new Date(dataPoint.time);
          return timeValue;
        })
      : lineData.map(dataPoint => {
          const timeValue = new Date(dataPoint.time);
          return timeValue;
        });


        
    const datasets = Array.isArray(lineData[0])
      ? lineData.map((data, index) => ({
          data: data.map((dataPoint) => parseFloat(dataPoint.value)),
          borderColor: lineChartConfig.datasets[index].borderColor,
          fill: lineChartConfig.datasets[index].fill,
          hidden: false,
          backgroundColor: lineChartConfig.datasets[index].backgroundColor,
          spanGaps: true,

        }))
      : [
          {
            data: lineData.map((dataPoint) => parseFloat(dataPoint.value)),
            borderColor: lineChartConfig.datasets[0].borderColor,
            fill: lineChartConfig.datasets[0].fill,
            hidden: false,
            backgroundColor: lineChartConfig.datasets[0].backgroundColor,
            spanGaps: true,
          },
        ];


    
  const lineChartConfigurationStandard = {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      spanGaps: true,
      maintainAspectRatio: false,
      layout: {},
      scales: {
        x: {
          grid: {
            color: "lightgrey",
          },
          type: "timeseries",
          offset: false,
          min: new Date(twentyFourHoursAgoTimestamp),
          max: Date.now(),
          ticks: {
            autoSkip: false,
            callback: function (label, index, labels) {
              const parsedDate = new Date(label);
              const formattedDate = format(parsedDate, "MMM d, HH:00").split(", ");
              return [formattedDate[0], formattedDate[1]];
            },
            maxTicksLimit: 4,
            color: "lightgrey",
            font: {
              size: 14,
            },
          },
        },
        y: {
          grid: {
            color: "lightgrey",
          },
          
          ticks: {
            precision: 0,
            maxTicksLimit: 4,
            color: "lightgrey",
            font: {
              size: 14,
            },
            callback: function (value) {
              return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "");
            },
          },
        },
      },
      plugins: {
        title: {
          text: lineChartConfig.plugins.title.text,
          display: "yes",
          color: "lightgrey",
          font: {
            size: "18rem",
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
  };



  const lineChartConfigurationWaterLevel = {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      spanGaps: true,
      maintainAspectRatio: false,
      layout: {},
      scales: {
        x: {
          grid: {
            color: "lightgrey",
          },
          type: "timeseries",
          offset: false,
          min: new Date(twentyFourHoursAgoTimestamp),
          max: Date.now(),
          ticks: {
            autoSkip: false,
            callback: function (label, index, labels) {
              const parsedDate = new Date(label);
              const formattedDate = format(parsedDate, "MMM d, HH:00").split(", ");
              return [formattedDate[0], formattedDate[1]];
            },
            maxTicksLimit: 4,
            color: "lightgrey",
            font: {
              size: 14,
            },
          },
        },
        y: {
          reverse: true,
          grid: {
            color: "lightgrey",
          },
          
          ticks: {
            precision: 0,
            maxTicksLimit: 4,
            color: "lightgrey",
            font: {
              size: 14,
            },
            callback: function (value) {
              return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "");
            },
          },
        },
      },
      plugins: {
        title: {
          text: lineChartConfig.plugins.title.text,
          display: "yes",
          color: "lightgrey",
          font: {
            size: "18rem",
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
  };
  

    if ((!selectedTree || selectedTree.id === 6 || selectedTree.id === 7) && id !== 'temperatureChart' && activeTab !== "hochbeet" && activeTab !== "Wetter" && activeTab !== "Pegelmonitoring") {
      lineChartConfiguration = {
        type: "line",
        data: {
          labels: [],
          datasets: [],
        },

        options: {
          responsive: true,
          spanGaps: true,

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
              grid: {
                color: "lightgrey",
              },
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
                color: "lightgrey",
                font: {
                  size: 14,
                },
              },
            },
            y: {
              grid: {
                color: "lightgrey",
              },
              min: 0,
              max: 60,
              ticks: {
                precision:0,
                maxTicksLimit: 4,
                // stepSize: 25, // Adjust the step size as needed
                color: "lightgrey",
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
              color: "lightgrey",
              font: {
                size: "18rem",
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
              ctx.save();

              const text =
                "Bitte einen Datensatz auswählen, um die Daten anzuzeigen";
              const maxWidth = width - 20; // Adjust according to your needs
              const lineHeight = 20; // Adjust according to your needs
              const xCenter = left + (right - left) / 2;
              const yCenter = top + (bottom - top) / 2;

              ctx.font = "1rem Poppins, sans-serif";
              ctx.fillStyle = "lightgrey";
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
    } 



    //configuration for trees that don't have the TreeSense sensors
    else if ((selectedTree && (selectedTree.id === 5 || selectedTree.id === 3)) && id === 'treesense') {
      lineChartConfiguration = {
        type: "line",
        data: {
          labels: [],
          datasets: [],
        },

        options: {
          responsive: true,
          spanGaps: true,

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
              grid: {
                color: "lightgrey",
              },
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
                color: "lightgrey",
                font: {
                  size: 14,
                },
              },
            },
            y: {
              grid: {
                color: "lightgrey",
              },
              min: 0,
              max: 60,
              ticks: {
                precision:0,
                maxTicksLimit: 4,
                // stepSize: 25, // Adjust the step size as needed
                color: "lightgrey",
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
              color: "lightgrey",
              font: {
                size: "18rem",
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
              ctx.save();

              const text =
                "Sensor nicht vorhanden";
              const maxWidth = width - 20; // Adjust according to your needs
              const lineHeight = 20; // Adjust according to your needs
              const xCenter = left + (right - left) / 2;
              const yCenter = top + (bottom - top) / 2;

              ctx.font = "1rem Poppins, sans-serif";
              ctx.fillStyle = "lightgrey";
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
    } 






    
    else if ( lineData.length === 0 && (activeTab == "hochbeet" || activeTab == "Wetter")) {
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
              grid: {
                color: "lightgrey",
              },
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
                color: "lightgrey",
                font: {
                  size: 14,
                },
              },
            },
            y: {
              grid: {
                color: "lightgrey",
              },
              min: 0,
              max: 60,
              ticks: {
                precision:0,
                maxTicksLimit: 4,
                // stepSize: 25, // Adjust the step size as needed
                color: "lightgrey",
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
              color: "lightgrey",
              font: {
                size: "18rem",
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
              ctx.save();

              const text =
                "Bitte einen Datensatz auswählen, um die Daten anzuzeigen";
              const maxWidth = width - 20; // Adjust according to your needs
              const lineHeight = 20; // Adjust according to your needs
              const xCenter = left + (right - left) / 2;
              const yCenter = top + (bottom - top) / 2;

              ctx.font = "1rem Poppins, sans-serif";
              ctx.fillStyle = "lightgrey";
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
    }


    else if ( id == "Pegelmonitoring") {
      lineChartConfiguration = lineChartConfigurationWaterLevel;

    }


        else if ( lineData.length == 0 && activeTab == "hochbeet") {
      lineChartConfiguration = {
        type: "line",
        data: {
          labels: [],
          datasets: [],
        },

        options: {
          responsive: true,
          spanGaps: true,

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
              grid: {
                color: "lightgrey",
              },
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
                color: "lightgrey",
                font: {
                  size: 14,
                },
              },
            },
            y: {
              grid: {
                color: "lightgrey",
              },
              min: 0,
              max: 60,
              ticks: {
                precision:0,
                maxTicksLimit: 4,
                // stepSize: 25, // Adjust the step size as needed
                color: "lightgrey",
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
              color: "lightgrey",
              font: {
                size: "18rem",
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
              ctx.save();

              const text =
                "Bitte einen Datensatz auswählen, um die Daten anzuzeigen";
              const maxWidth = width - 20; // Adjust according to your needs
              const lineHeight = 20; // Adjust according to your needs
              const xCenter = left + (right - left) / 2;
              const yCenter = top + (bottom - top) / 2;

              ctx.font = "1rem Poppins, sans-serif";
              ctx.fillStyle = "lightgrey";
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
    }


    
    else {
      // Use the regular lineChartConfig when selectedTree is defined
      lineChartConfiguration = lineChartConfigurationStandard;
    }


    const lineChart = new Chart(lineChartRef.current, lineChartConfiguration);

    return () => {
      lineChart.destroy();
    };
  }, [lineChartConfig, lineData, selectedTree, id]);

  if (!lineData) {
    return (
      <div style={{ textAlign: "center", paddingTop: "20px", color: "lightgray" }}>
        <p>Daten momentan nicht verfügbar. Wir arbeiten bereits an ihrer Wiederherstellung...</p>
      </div>
    );
  }

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