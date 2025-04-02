import React from "react";
import iconSrc from "../../../assets/yellow_tree.svg"; // Adjust the path as needed

const MapIcon = ({ left, top }) => {
  return (
    <img
      src={iconSrc}
      alt="Icon"
      style={{
        position: "absolute",
        left: `${left}%`,
        top: `${top}%`,
        transform: "translate(-50%, -50%)",
        width: "56px",
        height: "56px",
        pointerEvents: "none",
      }}
    />
  );
};

export default MapIcon;
