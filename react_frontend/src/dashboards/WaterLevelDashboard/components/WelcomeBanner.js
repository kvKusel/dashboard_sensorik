import React, { useState } from 'react';

import ProjectInfoModal from './ProjectInfoModal';

const WelcomeBanner = () => {
  const [showBanner, setShowBanner] = useState(true);

  return showBanner ? (
    <div className="row mt-2" style={{ flex: "1 1 auto" }}>
      <div className="col-12 m-0 p-0">
        <div
          className="alert alert-info position-relative"
          style={{
            backgroundColor: "rgba(223, 245, 225, 0.5)",
            border: "1px solid rgba(8, 185, 23, 0.3)",
            color: "#1A2146",
            fontSize: "1.25rem",
            fontWeight: "500",
            borderRadius: "0.75rem",
            padding: "1rem",
          }}
        >
          {/* Close button */}
          {/* <button
            type="button"
            className="btn-close position-absolute"
            aria-label="Close"
            onClick={() => setShowBanner(false)}
            style={{ top: "0.75rem", right: "1rem" }}
          ></button> */}

          <p className="mb-0">
            <strong>Willkommen zum Pegel-Dashboard!</strong><br />
            Hier finden Sie aktuelle Wasserstandsdaten, interaktive Karten, historische Niederschlagsverläufe und eine Übersicht aller unserer Messstellen im Landkreis Kusel.
          </p>
          <p className="mt-2 mb-0" style={{ fontSize: "0.95rem", color: "#3D3D3D" }}>
            Beachten Sie bitte, dass sich das System in kontinuierlicher Weiterentwicklung befindet. Wir arbeiten stetig daran, die Qualität und Zuverlässigkeit unserer Dienste auf höchstem Niveau zu halten.
            Die Nutzung erfolgt jedoch auf eigene Verantwortung und schließt rechtliche Ansprüche aus.
          </p>

          {/* Info Buttons Section */}
          <div className="row mt-3">
            <div className="col-12 d-flex flex-column flex-sm-row gap-3">
<ProjectInfoModal />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default WelcomeBanner;
