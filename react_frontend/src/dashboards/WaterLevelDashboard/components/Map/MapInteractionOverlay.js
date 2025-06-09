import React, { useState, useEffect } from "react";

const MapInteractionOverlay = ({ children }) => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  // Detect screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-show overlay only on small screens
  useEffect(() => {
    if (isSmallScreen) {
      setOverlayVisible(true);
    } else {
      setOverlayVisible(false);
    }
  }, [isSmallScreen]);

  const handleOverlayClick = () => {
    setOverlayVisible(false);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Your map */}
      <div style={{ width: "100%", height: "100%" }}>
        {children}
      </div>

      {/* Glass overlay - visible on small screens */}
      {isSmallScreen && overlayVisible && (
        <div
          onClick={handleOverlayClick}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "transparent",
            zIndex: 1000,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "#333",
              fontSize: "0.9rem",
              pointerEvents: "none",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "12px 20px",
              borderRadius: "25px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
 Zum Bewegen der Karte antippen
          </div>
        </div>
      )}
    </div>
  );
};

export default MapInteractionOverlay;