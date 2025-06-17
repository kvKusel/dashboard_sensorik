import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MultiLineChart = ({
  waterLevelKreisverwaltung,
  waterLevelRutsweiler,
  waterLevelKreimbach,
  waterLevelWolfstein,
  waterLevelLauterecken1,
  waterLevelKreimbach1,
  waterLevelKreimbach3,
  waterLevelLohnweiler1,
  waterLevelHinzweiler1,
  waterLevelUntersulzbach,
  waterLevelLohnweilerRLP,
  currentPeriod,
  activeDataset = null // This will be the dataset we want to show
}) => {
  // Create a ref to the chart instance
  const chartRef = React.useRef(null);
  
  // State to track which datasets are manually selected by clicking legend
  const [manuallySelected, setManuallySelected] = useState(new Set());
  // State to track the calculated Y-axis max
  const [yAxisMax, setYAxisMax] = useState(200);

  const [windowSize, setWindowSize] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth); // Change state on resize
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dataset configuration with colors and keys
  const datasetConfig = [
    
    {
      key: "lastValueHinzweiler1",
      label: "Pegel Hinzweiler",
      data: waterLevelHinzweiler1,
      color: "rgb(2, 102, 52)"
    },


    {
      key: "lastValueKreimbach1",
      label: "Pegel Kreimbach 1",
      data: waterLevelKreimbach1,
      color: "rgba(131, 201, 104, 1)"
    },
    {
      key: "lastValueKreimbach3",
      label: "Pegel Kreimbach 2",
      data: waterLevelKreimbach3,
      color: "rgba(209, 67, 91, 1)"
    },
    {
      key: "lastValueKreimbach4",
      label: "Pegel Kreimbach 3",
      data: waterLevelKreimbach,
      color: "rgba(78, 159, 188, 1)"
    },

    {
      key: "lastValueKreisverwaltung",
      label: "Pegel Kusel",
      data: waterLevelKreisverwaltung,
      color: "rgba(166, 109, 212, 1)"
    },
        {
      key: "lastValueLauterecken1",
      label: "Pegel Lauterecken",
      data: waterLevelLauterecken1,
      color: "rgba(74, 104, 212, 1)"
    },

        {
      key: "lastValueLohnweilerRLP",
      label: "Pegel Lohnweiler (Lauter)",
      data: waterLevelLohnweilerRLP,
      color: "rgba(209, 67, 91, 1)"
    },
    {
      key: "lastValueLohnweiler1",
      label: "Pegel Lohnweiler (Mausbach)",
      data: waterLevelLohnweiler1,
      color: "rgb(97, 3, 3)"
    },
        {
      key: "lastValueRutsweiler",
      label: "Pegel Rutsweiler a.d. Lauter",
      data: waterLevelRutsweiler,
      color: "rgba(236, 200, 91, 1)"
    },
    {
      key: "lastValueUntersulzbach",
      label: "Pegel Untersulzbach",
      data: waterLevelUntersulzbach,
      color: "rgba(131, 201, 104, 1)"
    },

        {
      key: "lastValueWolfstein",
      label: "Pegel Wolfstein",
      data: waterLevelWolfstein,
      color: "rgba(231, 132, 78, 1)"
    },

  ];

const formatDatasetLabel = (datasetKey) => {
  if (!datasetKey) return "";

  // Full key overrides
  const overrides = {
    lastValueKreimbach3: "Kreimbach 2",
    lastValueKreimbach4: "Kreimbach 3",
  };

  if (overrides[datasetKey]) {
    return overrides[datasetKey];
  }

  // Remove 'lastValue' prefix
  let name = datasetKey.replace(/^lastValue/, "");

  // Match location and optional number
  const match = name.match(/^([a-zA-Z]+)(\d*)$/);
  if (!match) return name;

  let [, location, number] = match;

  const corrections = {
    Rutsweiler: "Rutsweiler a.d Lauter",
    Kreisverwaltung: "Kusel (Kuselbach)",
    Lohnweiler: "Lohnweiler (Mausbach)",
    Lauterecken: "Lauterecken",
    Hinzweiler: "Hinzweiler",
      LohnweilerRLP: "Lohnweiler (Lauter)",

  };

  const corrected = corrections[location] || location;

  const ignoreNumber = Object.keys(corrections).includes(location);

  return ignoreNumber ? corrected : number ? `${corrected} ${number}` : corrected;
};

  // Define the noDatasetPlugin
  const noDatasetPlugin = {
    id: 'noDatasetMessage',
    afterDraw: (chart) => {
      const anyDatasetVisible = chart.data.datasets.some(
        (dataset, index) => chart.isDatasetVisible(index)
      );
      
      if (!anyDatasetVisible) {
        const fontSize = window.innerWidth < 768 ? "1rem" : "1.2rem";
        const { ctx, chartArea } = chart;
        if (chartArea) {
          const { top, left, width, height } = chartArea;
          
          ctx.save();
          const text = "Pegel aus der Tabelle oder Karte auswählen, um die Daten anzuzeigen";
          const maxWidth = width - 20;
          const lineHeight = 20;
          const xCenter = left + (width / 2);
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
          
          // Call wrapText function
          wrapText(text, xCenter, yCenter, maxWidth, lineHeight);
          ctx.restore();
        }
      }
    }
  };

  // Function to calculate max value from visible datasets
  const calculateYAxisMax = () => {
    let maxValue = 0;
    const visibleDatasets = new Set();
    
    // Add active dataset
    if (activeDataset) {
      visibleDatasets.add(activeDataset);
    }
    
    // Add manually selected datasets
    manuallySelected.forEach(datasetKey => {
      visibleDatasets.add(datasetKey);
    });
    
    // If no datasets are visible, return default
    if (visibleDatasets.size === 0) {
      return 200;
    }
    
    // Calculate period boundary to only consider data in current time period
    const periodBoundary = calculateTimePeriodBoundary(currentPeriod);
    
    // Find max value across all visible datasets
    visibleDatasets.forEach(datasetKey => {
      const config = datasetConfig.find(c => c.key === datasetKey);
      if (config && config.data) {
        const filteredData = config.data.filter(item => {
          const time = new Date(item.time).getTime();
          return time >= periodStart && time <= periodEnd;
        });

        
        filteredData.forEach(item => {
          if (item.value > maxValue) {
            maxValue = item.value;
          }
        });
      }
    });
    
    // Add 20cm buffer
    const valueWithBuffer = maxValue + 20;
    
    // Round up to the next 50cm increment
    const roundedMax = Math.ceil(valueWithBuffer / 50) * 50;
    
    // Ensure minimum of 50cm
    return Math.max(roundedMax, 50);
  };

  // Handle legend item click
  const handleLegendClick = (datasetKey) => {
    const newManuallySelected = new Set(manuallySelected);
    
    if (newManuallySelected.has(datasetKey)) {
      newManuallySelected.delete(datasetKey);
    } else {
      newManuallySelected.add(datasetKey);
    }
    
    setManuallySelected(newManuallySelected);
  };

  // Use effect to update dataset visibility and Y-axis when activeDataset or manuallySelected changes
  useEffect(() => {
    // Calculate new Y-axis max
    const newYAxisMax = calculateYAxisMax();
    setYAxisMax(newYAxisMax);
    
    if (chartRef.current) {
      const chart = chartRef.current;
      
      // Hide all datasets first
      chart.data.datasets.forEach((dataset, index) => {
        chart.setDatasetVisibility(index, false);
      });
      
      // Show active dataset if it exists
      if (activeDataset) {
        const activeIndex = datasetConfig.findIndex(config => config.key === activeDataset);
        if (activeIndex !== -1) {
          chart.setDatasetVisibility(activeIndex, true);
        }
      }
      
      // Show manually selected datasets
      manuallySelected.forEach(datasetKey => {
        const index = datasetConfig.findIndex(config => config.key === datasetKey);
        if (index !== -1) {
          chart.setDatasetVisibility(index, true);
        }
      });
      
      // Update Y-axis max
      chart.options.scales.y.max = newYAxisMax;
      
      chart.update();
    }
  }, [activeDataset, manuallySelected, currentPeriod]);

const calculateTimePeriodBoundary = (period) => {
  const now = new Date();
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999); // End of current day

  const startOfPeriod = new Date(endOfToday);
  switch (period) {
    case "24h":
      startOfPeriod.setDate(endOfToday.getDate() - 1);
      break;
    case "7d":
      startOfPeriod.setDate(endOfToday.getDate() - 7);
      break;
    case "30d":
      startOfPeriod.setDate(endOfToday.getDate() - 30);
      break;
    case "365d":
      startOfPeriod.setDate(endOfToday.getDate() - 365);
      break;
    default:
      startOfPeriod.setDate(endOfToday.getDate() - 1);
  }

  // Normalize start time to beginning of day
  startOfPeriod.setHours(0, 0, 0, 0);

  return { start: startOfPeriod.getTime(), end: endOfToday.getTime() };
};

const { start: periodStart, end: periodEnd } = calculateTimePeriodBoundary(currentPeriod);

  // Create datasets with actual timestamps AND filter datasets so that only every 10th data point is displayed
  const createDataset = (data) => {
    return data
      .filter((_, index) => index % 10 === 0)  // Filter every 10th data point
      .map((item) => ({
        x: new Date(item.time).getTime(),
        y: item.value,
      }));
  };

  const chartData = {
    datasets: datasetConfig.map(config => ({
      label: config.label,
      data: createDataset(config.data),
      borderColor: config.color,
      backgroundColor: config.color,
      tension: 0.2,
      hidden: true
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        padding: {
          top:10,
          bottom:20},       
      text: `Pegel ${formatDatasetLabel(activeDataset)} - Verlauf`,
        color: "#18204F",
        
        font: {
          size: "20",
          weight: "bolder",
        },
      },
      legend: {
        display: false,
        labels: {
          color: "#6972A8",
          font: {
            size: "16",
          },
        },
        position: "bottom",
        align: "start",
      },
    },
    scales: {
      x: {
        offset: false,

        type: "time",
        time: {
          unit: currentPeriod === "24h" ? "hour" : "day",
          displayFormats: {
            hour: "MMM d, HH:00",
            day: "MMM d",
          },
        },
  min: periodStart,
  max: periodEnd,
        grid: {
          minTicksLimit: 3, // Ensure at least 5 ticks on the axis
          
          lineWidth: 2,
          color: "#BFC2DA",
        },
        ticks: {
          callback: function(value, index) {
            return index % 10 === 0 ? this.getLabelForValue(value) : '';
          },
          color: "#6972A8",
          
          maxTicksLimit: 4,
          font: {
            size: 16,
          },
          callback: function (label, index, labels) {
            const parsedDate = new Date(label);
            const formattedDate = format(parsedDate, "MMM d");
            const secondLine =
              currentPeriod === "24h"
                ? format(parsedDate, "HH:00")
                : format(parsedDate, "yyyy");
            return [formattedDate, secondLine];
          },
        },
      },
      y: {
        min: 0,
        max: yAxisMax, // Use dynamic Y-axis max
        title: {
          display: true,
          text: "Wasserstand (cm)",
          color: "#6972A8",
          font: {
            size: 18,
          },
          padding: {
            top: 10,
          },
        },
        grid: {
          lineWidth: 2,
          color: "#BFC2DA",
        },
        ticks: {
          stepSize: yAxisMax <= 100 ? 25 : 50, // 25cm steps for scales ≤100cm, 50cm for larger scales
          maxTicksLimit: 8,
          color: "#6972A8",
          font: {
            size: 16,
          },
        },
      },

    },
  };

  return (
    <div className="w-100 h-100">
      <div style={{ height: 'calc(100% - 80px)' }}>
        <Line 
          ref={chartRef} 
          data={chartData} 
          options={options} 
          plugins={[noDatasetPlugin]} 
          key={windowSize}
        />
      </div>
      
      <PegelDropdown 
        datasetConfig={datasetConfig}
        activeDataset={activeDataset}
        manuallySelected={manuallySelected}
        onSelectionChange={handleLegendClick}
      />
    </div>
  );
};

// Separate dropdown component outside of chart context
const PegelDropdown = ({ datasetConfig, activeDataset, manuallySelected, onSelectionChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.pegel-dropdown-container')) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="mt-4 d-flex justify-content-left">
      <div className="position-relative pegel-dropdown-container" style={{ paddingLeft: '7px' }}>  
   <button
  className="btn btn-outline-primary p-2 position-relative justify-content-between"
  type="button"
  onClick={() => setDropdownOpen(!dropdownOpen)}
  style={{
    backgroundColor: 'white',
    borderColor: '#6972A8',
    color: '#6972A8',
    minWidth: '183px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.1rem',
  }}
>
  <span>Weitere Pegel</span>

  {/* Positioned arrow icon */}
          <svg 
              className="position-absolute"
  
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="currentColor"
            style={{
              transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
               right: '12px'
            }}
          >
            <path d="M2 4l4 4 4-4H2z"/>
          </svg>
</button>
        
        {dropdownOpen && (
          <div
            className="position-absolute bg-white border rounded shadow-lg"
            style={{
              top: 'calc(100% + 4px)',
              left: '0',
              width: '250px',
              zIndex: 1000,
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #dee2e6'
            }}
          >
            {datasetConfig.map((config, index) => {
              const isActive = activeDataset === config.key;
              const isManuallySelected = manuallySelected.has(config.key);
              const isVisible = isActive || isManuallySelected;
              
              return (
                <div
                  key={config.key}
                  className="d-flex align-items-center"
                  style={{
                    cursor: 'pointer',
                    padding: '8px 16px',
                    backgroundColor: isVisible ? 'rgba(105, 114, 168, 0.1)' : 'white',
                    borderBottom: index < datasetConfig.length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelectionChange(config.key);
                  }}
                >
                  <div className="me-3">
                    {isVisible ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="#28a745">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                      </svg>
                    ) : (
                      <div style={{ 
                        width: '16px', 
                        height: '16px', 
                        border: '1px solid #ccc', 
                        borderRadius: '2px',
                        backgroundColor: 'white'
                      }}></div>
                    )}
                  </div>
                  
                  <div
                    className="me-3"
                    style={{
                      width: '20px',
                      height: '3px',
                      backgroundColor: config.color,
                      borderRadius: '2px',
                      opacity: isVisible ? 1 : 0.5
                    }}
                  />
                  
                  <span
                    style={{
                      color: isVisible ? '#18204F' : '#999',
                      fontSize: '14px',
                      fontWeight: isActive ? 'bold' : 'normal',
                      flex: 1
                    }}
                  >
                    {config.label}
                    {isActive && (
                      <span 
                        className="ms-2"
                        style={{ 
                          fontSize: '10px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '10px'
                        }}
                      >
                        Aktiv
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiLineChart;