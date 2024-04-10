import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import MarkerIcon from "./LeafletTreeIconSvg";

const MarkerComponent = ({ position, selectedTree, currentValueSoilMoisture, treeSenseHealth, popup, treeID }) => {

     

  // Check if the position matches the selected tree latitude and longitude - used to render the bigger sized and focused icon for the selected tree
  const isSelectedTreePosition = selectedTree && position[0] === selectedTree.latitude && position[1] === selectedTree.longitude;

    console.log(position)
    
    // Adjust the color of the left side of the leaflet icons based on the tree health data
    let colorLeft; // Default color
  
    if (treeSenseHealth === 0 && (treeID === 1 || treeID === 2 || treeID === 4 ) ) {
      colorLeft = "rgb(25, 135, 84)";
    } else if ((treeID === 3 )|| treeID === 5) {
      colorLeft = "white";
    }
  
    
  // Adjust the color of the right side of the leaflet icons based on the soil moisture data
  let colorRight; // Default color

  if (currentValueSoilMoisture < 10 && currentValueSoilMoisture) {
    colorRight = "red";
  } else if (currentValueSoilMoisture >= 10 && currentValueSoilMoisture < 20) {
    colorRight = "yellow";
  } else if (currentValueSoilMoisture >= 20) {
    colorRight = "green";
  } else if (currentValueSoilMoisture >= 20) {
    colorRight = "green";
  } else if (!currentValueSoilMoisture) {
    colorRight = "white";
  } 
  
  const icon = new L.divIcon({
    html: ReactDOMServer.renderToString(
      <MarkerIcon colorLeft={colorLeft} colorRight={colorRight} />
    ),
    className: isSelectedTreePosition || selectedTree.id == 7 ? "" : "blurred-icon", // makes the NOT chosen icons appear blurry
    iconSize: isSelectedTreePosition ? [53, 53] : [40, 40],
  });

  return (
    <Marker position={position} icon={icon}>
      <Popup>{popup}</Popup>
    </Marker>
  );
};

export default MarkerComponent;
