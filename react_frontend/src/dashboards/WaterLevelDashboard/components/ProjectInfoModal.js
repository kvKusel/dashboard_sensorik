import React, { useState } from "react";

const ProjectInfoModal = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button className="custom-info-button" onClick={() => setShowModal(true)}>
        Projektinformationen
      </button>

      {/* Modal Overlay */}
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Modal Content */}
<div
  className="modal-content"
  style={{
    background: "linear-gradient(0deg, #1A2146 0%, #1F2C61 100%)",
    borderRadius: '1rem',
    padding: '2rem',
    width: '90%',
    maxWidth: '600px',
    color: 'white',
    position: 'relative',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    maxHeight: '90vh',           // 🔹 limit height to viewport
    overflowY: 'auto',           // 🔹 enable scroll if needed
        WebkitOverflowScrolling: 'touch', 

  }}
>

            {/* Close Button (Top Right) */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "0.1rem",
                right: "1rem",
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              ×
            </button>

            {/* Modal Content */}
            <h2 className="py-2" style={{ fontWeight: "bold" }}>Projektinformationen</h2>
    <p>
  Dieses Dashboard ist Teil unseres Sensorik-Projekts. Ziel ist der Aufbau eines
  ferngestützten Erfassungssystems, das interessierten Akteuren Informationen im Bereich
  Hochwassermonitoring bereitstellt.
</p>

<p>
  Unser System nutzt hauptsächlich NB-IoT-Sensoren, ergänzt durch einige LoRaWAN-Geräte,
  mit einer Datenübertragung alle 20 Minuten. Zusätzlich integrieren wir öffentlich
  verfügbare Pegelstandsdaten des{" "}
  <a
    href="https://wasserportal.rlp-umwelt.de/"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "#ffffff", textDecoration: "underline" }}
  >
    Landesamts für Umwelt Rheinland-Pfalz
  </a>{" "}
  für relevante Messstellen.
</p>

<p>
  Zur besseren Einschätzung von Zusammenhängen zwischen Niederschlag und Wasserstand
  verwenden wir zusätzlich API-Daten von Diensten wie{" "}
  <a
    href="https://www.rainviewer.com/"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "#ffffff", textDecoration: "underline" }}
  >
    RainViewer
  </a>{" "}
  und{" "}
  <a
    href="https://openweathermap.org/"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "#ffffff", textDecoration: "underline" }}
  >
    OpenWeather
  </a>
  , sowie eigene Wetterstationen auf NB-IoT-Basis, die in der Region installiert sind.
</p>


            {/* Confirm / Dismiss Button */}
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: "#E7844E",
                  border: "none",
                  padding: "0.75rem 2rem",
                  borderRadius: "0.5rem",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectInfoModal;
