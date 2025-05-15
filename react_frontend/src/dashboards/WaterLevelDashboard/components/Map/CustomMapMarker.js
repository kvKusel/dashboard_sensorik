import { Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";

const CustomMapMarkers = ({ markers, hoveredMarkerId, selectedMarkerId, onMarkerClick, onMarkerClick2, setHoveredMarkerId, setSelectedMarkerId }) => {
  return markers.map((marker) => {
    const isHovered = hoveredMarkerId === marker.id;


    const isSelected = selectedMarkerId === marker.id;
        // to prevent the marker from changing color to hovered when its already selected
    const isTrulyHovered = isHovered && !isSelected;
    const markerSize = isSelected || isHovered ? 34 : 24;

    return (
<Marker
  key={marker.id}
  position={marker.position}
  eventHandlers={{
  click: (e) => {
      onMarkerClick(marker.position);
      onMarkerClick2(marker.queryType);
                    setSelectedMarkerId(marker.id);
                        e.target.closeTooltip(); // closes tooltip manually


      
    },
    mouseover: () => {
              setHoveredMarkerId(marker.id);

    },
    mouseout: () => {
              setHoveredMarkerId(null);

    },
    
  }}

        icon={L.divIcon({
          className: "custom-marker",
          html: `<div style="background-image: url('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png');
                          background-size: contain;
                          background-repeat: no-repeat;
                          width: ${markerSize}px;
                          height: ${markerSize * 1.5}px;
filter: ${isSelected
  ? "hue-rotate(170deg) saturate(2) brightness(1.1)"
  : isTrulyHovered
    ? "hue-rotate(160deg) saturate(2) brightness(1.1)"
    : "hue-rotate(10deg) saturate(1) brightness(1.2)"
};"></div>`,
          iconSize: [markerSize, markerSize * 1.5],
          iconAnchor: [markerSize / 2, markerSize * 1.5],
        })}
      >
        <Tooltip
          direction="left"
          offset={[-10, -15]}
          opacity={1}
          permanent={false}
          className="custom-tooltip"
        >
          {marker.label}
        </Tooltip>
      </Marker>
    );
  });
};


export default CustomMapMarkers;
