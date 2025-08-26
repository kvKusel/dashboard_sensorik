import { Marker, Tooltip, useMapEvents } from "react-leaflet";
import L from "leaflet";

function ClearHoverOnMove({ clear }) {
  useMapEvents({
    movestart: clear,
    zoomstart: clear,
  });
  return null;
}

function createIcon(markerSize, isSelected, isTrulyHovered) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-image: url('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png');
      background-size: contain;
      background-repeat: no-repeat;
      width: ${markerSize}px;
      height: ${markerSize * 1.5}px;
      filter: ${
        isSelected
          ? "hue-rotate(170deg) saturate(2) brightness(1.1)"
          : isTrulyHovered
          ? "hue-rotate(160deg) saturate(2) brightness(1.1)"
          : "hue-rotate(10deg) saturate(1) brightness(1.2)"
      };
    "></div>`,
    iconSize: [markerSize, markerSize * 1.5],
    iconAnchor: [markerSize / 2, markerSize * 1.5],
  });
}

const CustomMapMarkers = ({
  markers,
  hoveredMarkerId,
  selectedMarkerId,
  onMarkerClick,
  onMarkerClick2,
  setHoveredMarkerId,
  setSelectedMarkerId,
}) => {
  return (
    <>
      {/* clear hover when map is moved/zoomed */}
      <ClearHoverOnMove clear={() => setHoveredMarkerId(null)} />

      {markers.map((marker) => {
        const isHovered = hoveredMarkerId === marker.id;
        const isSelected = selectedMarkerId === marker.id;
        const isTrulyHovered = isHovered && !isSelected;
        const markerSize = isSelected || isHovered ? 34 : 24;

        return (
          <Marker
            key={marker.id}
            position={marker.position}
            bubblingMouseEvents={false}
            icon={createIcon(markerSize, isSelected, isTrulyHovered)}
            eventHandlers={{
              click: (e) => {
                onMarkerClick(marker.position);
                onMarkerClick2(marker.queryType);
                setSelectedMarkerId(marker.id);
                e.target.closeTooltip?.();
              },
              mouseover: () => setHoveredMarkerId(marker.id),
              mouseout: () => setHoveredMarkerId(null),
            }}
          >
            {(isTrulyHovered || isSelected) && (
              <Tooltip
                direction="left"
                offset={[-10, -15]}
                opacity={1}
                permanent={false}
                interactive={false}
                className="custom-tooltip"
              >
                {marker.label}
              </Tooltip>
            )}
          </Marker>
        );
      })}
    </>
  );
};

export default CustomMapMarkers;
