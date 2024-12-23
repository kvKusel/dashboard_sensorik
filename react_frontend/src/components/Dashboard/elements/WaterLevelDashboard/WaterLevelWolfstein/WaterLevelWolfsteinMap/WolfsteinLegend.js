import React, { useState, useEffect } from "react";

const RainIntensityLegend = () => {


    const now = new Date();
  
    // Format the date
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  
    // Floor the time to the nearest 10 minutes
    const flooredMinutes = Math.floor(now.getMinutes() / 10) * 10;
    const flooredTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      flooredMinutes
    );
  
    const formattedTime = flooredTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });


  const rainColors = [
    { dBZ: -32, color: "#00000000" },
    { dBZ: -20, color: "#efffffff" },
    { dBZ: -10, color: "#353535ff" },
    { dBZ: -9, color: "#757575ff" },
    { dBZ: -1, color: "#005a00ff" },
    { dBZ: 0, color: "#007e00ff" },
    { dBZ: 4, color: "#087fdbff" },
    { dBZ: 5, color: "#1c47e8ff" },
    { dBZ: 9, color: "#6e0dc6ff" },
    { dBZ: 10, color: "#c80f86ff" },
    { dBZ: 14, color: "#c06487ff" },
    { dBZ: 15, color: "#d2883bff" },
    { dBZ: 19, color: "#fac431ff" },
    { dBZ: 20, color: "#fefb02ff" },
    { dBZ: 24, color: "#fe9a58ff" },
    { dBZ: 25, color: "#fe5f05ff" },
    { dBZ: 29, color: "#fd341cff" },
    { dBZ: 30, color: "#bebebeff" }
  ];

  const [bottomPosition, setBottomPosition] = useState(20); // Default bottom position for larger screens

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setBottomPosition(40); // For small screens, set bottom to 40px
      } else {
        setBottomPosition(20); // For larger screens, set bottom to 20px
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (

    <>
    <div
      className="px-2 pt-3 d-flex flex-column"
      style={{
        fontFamily: "Poppins, Arial, sans-serif",
        position: "absolute",
        right: "0px",
        bottom: `${bottomPosition}px`, // Dynamic bottom positioning
        background: "white",
        borderRadius: "0px",
        zIndex: "1000",
        backgroundColor: "rgba(255, 255, 255, 0.8)"
      }}
    >
      <p className="h6">Niederschlagsintensität</p>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "300px",
            height: "10px",
            background: `linear-gradient(to right, ${rainColors
              .map(
                (color, index) =>
                  `${color.color} ${index * (100 / (rainColors.length - 1))}%`
              )
              .join(", ")})`
          }}
        ></div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "5px"
          }}
        >
          <p className="">leicht</p>
          <p className="">stark</p>
        </div>
      </div>
    </div>

{/* Control Panel to set the time for the precipitation shown on the map */}

<div
  className="px-2 pt-3 d-flex flex-column"
  style={{
    fontFamily: "Poppins, Arial, sans-serif",
    position: "absolute",
    right: "0px",
    top: "0px",
    background: "white",
    borderRadius: "0px",
    zIndex: "1000",
    backgroundColor: "rgba(255, 255, 255, 0.8)"
  }}
>
  <div className="d-flex align-items-center justify-content-between">
  <div 
      style={{ cursor: "pointer", paddingRight: "15px" }} 
      onClick={() => console.log("Arrow clicked!")} // Replace with your logic
    >
    <span className="fs-1 fw-bold">{`<`}</span>

  </div>
    <div className="d-flex justify-content-center align-items-center flex-column">
      <p className="h6">{formattedDate}</p>
      <p className="h6">{formattedTime}</p>
    </div>
    <div 
      style={{ cursor: "pointer", paddingLeft: "15px" }} 
      onClick={() => console.log("Arrow clicked!")} // Replace with your logic
    >
    <span className="fs-1 fw-bold">{`>`}</span>

  </div>
  </div>
</div>

</>
  );
};

export default RainIntensityLegend;
