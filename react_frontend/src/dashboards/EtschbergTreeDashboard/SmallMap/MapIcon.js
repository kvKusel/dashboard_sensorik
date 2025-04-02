import React from "react";
import { ReactComponent as TreeGreen } from "../../../assets/green_tree.svg";
import { ReactComponent as TreeYellow } from "../../../assets/yellow_tree.svg";
import { ReactComponent as TreeRed } from "../../../assets/red_tree.svg";

const MapIcon = ({ left, top, treeNumber, treePosition, setSelectedTree, moistureValue }) => {
  const handleClick = () => {
    // When icon is clicked, update the selected tree in the parent component
    setSelectedTree(treeNumber);
  };

  // Determine which icon to display based on moisture value
  const TreeIcon = () => {
    if (moistureValue === null || moistureValue === undefined) {
      // Default icon if no data is available
      return <TreeYellow style={{ width: "56px", height: "56px" }} />;
    }
    
    if (moistureValue.value > 20) {
      return <TreeGreen style={{ width: "56px", height: "56px" }} />;
    } else if (moistureValue.value >= 10 && moistureValue.value <= 20) {
      return <TreeYellow style={{ width: "56px", height: "56px" }} />;
    } else if (moistureValue.value < 10) {
      return <TreeRed style={{ width: "56px", height: "56px" }} />;
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "absolute",
        left: `${left}%`,
        top: `${top}%`,
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TreeIcon />
      <div 
        style={{
          fontSize: "12px",
          fontWeight: "bold",
          marginTop: "2px",
          backgroundColor: "rgba(255,255,255,0.7)",
          padding: "1px 4px",
          borderRadius: "3px",
        }}
      >
        {treePosition}
      </div>
    </div>
  );
};

export default MapIcon;