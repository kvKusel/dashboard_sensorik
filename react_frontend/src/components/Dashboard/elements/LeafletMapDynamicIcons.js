import React from "react";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import MarkerIcon from "./LeafletTreeIconSvg";

const TreeIconMap = ({ colorLeft, colorRight, isChosen }) => {
  const iconSize = isChosen ? [53, 53] : [40, 40];
  const className = isChosen ? "chosen-tree-icon" : "blurred-icon";

  return new L.divIcon({
    html: ReactDOMServer.renderToString(
      <MarkerIcon colorLeft={colorLeft} colorRight={colorRight} />
    ),
    className: className,
    iconSize: iconSize,
  });
};

export default TreeIconMap;
