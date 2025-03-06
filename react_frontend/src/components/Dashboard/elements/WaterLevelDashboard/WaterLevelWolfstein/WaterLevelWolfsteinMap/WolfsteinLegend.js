import React, { useState, useEffect } from "react";

const RainIntensityLegend = ({ timeType, setTimeType, frameIndex, setFrameIndex }) => {

  const [bottomPosition, setBottomPosition] = useState(20); // Default bottom position for larger screens
 
  // define the rain colors for the legend
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


  // Get the current time and floor the minutes to the nearest 10
const now = new Date();
const flooredMinutes = Math.floor(now.getMinutes() / 10) * 10;
const flooredTime = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  now.getHours(),
  flooredMinutes
);

// Manage time as state with the floored initial value
const [currentTime, setCurrentTime] = useState(flooredTime);

// Format the date
const formattedDate = currentTime.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

// Format the time
const formattedTime = currentTime.toLocaleTimeString("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

// Handle time adjustment with flooring
const adjustTime = (minutes) => {
  setCurrentTime((prevTime) => {
    const adjustedTime = new Date(prevTime.getTime() + minutes * 60000);

    // Floor the minutes to the nearest 10
    const flooredMinutes = Math.floor(adjustedTime.getMinutes() / 10) * 10;
    return new Date(
      adjustedTime.getFullYear(),
      adjustedTime.getMonth(),
      adjustedTime.getDate(),
      adjustedTime.getHours(),
      flooredMinutes
    );
  });
};

const handleNextFrame = () => {
  if (timeType === "past" && frameIndex < 8) {
    setFrameIndex((prev) => prev + 1);
    adjustTime(10); 
  } else if (timeType === "past" && frameIndex === 8) {
    setTimeType("nowcast");
    setFrameIndex(0);
    adjustTime(10); 
  } else if (timeType === "nowcast" && frameIndex < 2) {
    setFrameIndex((prev) => prev + 1);
    adjustTime(10); 
  }
};

const handlePreviousFrame = () => {
  if (timeType === "past" && frameIndex > 0) {
    setFrameIndex((prev) => prev - 1);
    adjustTime(-10); 
  } else if (timeType === "nowcast" && frameIndex > 0) {
    setFrameIndex((prev) => prev - 1);
    adjustTime(-10); 
  } else if (timeType === "nowcast" && frameIndex === 0) {
    setTimeType("past");
    setFrameIndex(8);
    adjustTime(-10); 
  }
};

  


  useEffect(() => {
    const handleResize = () => {
      setBottomPosition(window.innerWidth <= 400 ? 35 : window.innerWidth <= 768 ? 25 : 20);
    };
    

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
  }, [frameIndex]);

  return (
    <>
      {/* Rain Intensity Legend */}
      <div
        className="px-2 pt-2 d-flex flex-column"
        style={{
          fontFamily: "Poppins, Arial, sans-serif",
          position: "absolute",
          right: "0px",
          bottom: `${bottomPosition}px`,
          background: "white",
          borderRadius: "0px",
          zIndex: "1000",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <p className="h6 text-center fs-5 fw-medium">Niederschlagsintensität</p>
        {/* Add rain gradient */}

        <div
        className="px-2  d-flex flex-column"
        style={{
          fontFamily: "Poppins, Arial, sans-serif",
          // position: "absolute",
          // left: "0px",
          // top: "0px",
          // background: "white",
          borderRadius: "0px",
          zIndex: "1000",
          // backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <div className="d-flex align-items-center justify-content-between">
        <div
  style={{
    cursor: timeType === "past" && frameIndex === 0 ? "not-allowed" : "pointer",
    paddingRight: "15px",
  }}
  onClick={() => {
    if (!(timeType === "past" && frameIndex === 0)) {
      handlePreviousFrame(); // Call the previous frame handler only if the button is not disabled
    }
  }}
  className={timeType === "past" && frameIndex === 0 ? "disabled" : ""}
>
  <span
    className="fs-1 fw-bold"
    style={{
      color: timeType === "past" && frameIndex === 0 ? "darkgray" : "inherit",
    }}
  >
    {`<`}
  </span>
</div>
          <div className="d-flex justify-content-center align-items-center flex-column">
            <p className="h6">{formattedDate}</p>
            <p className="h6">{formattedTime}</p>
          </div>
          <div
  style={{
    cursor: timeType === "nowcast" && frameIndex === 2 ? "not-allowed" : "pointer",
    paddingLeft: "15px",
  }}
  onClick={() => {
    if (!(timeType === "nowcast" && frameIndex === 2)) {
      handleNextFrame(); // Call the next frame handler only if the button is not disabled
    }
  }}
  className={timeType === "nowcast" && frameIndex === 2 ? "disabled" : ""}
>
  <span
    className="fs-1 fw-bold"
    style={{
      color: timeType === "nowcast" && frameIndex === 2 ? "darkgray" : "inherit",
    }}
  >
    {`>`}
  </span>
</div>

        </div>
      </div>

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

     
    </>
  );
};

export default RainIntensityLegend;
