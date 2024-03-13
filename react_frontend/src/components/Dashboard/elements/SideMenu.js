import React from 'react';
import { useMediaQuery } from 'react-responsive';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';


const SideMenu = ({ onTabChange }) => {
  const handleTabClick = (tab) => {
    onTabChange(tab);
  };

  return (
    <div
      className="btn-group-vertical w-100"
      
      role="group"
      aria-label="Navigation menu"
    >
      <button
        type="button"
        className="btn btn-transparent text-dark text-start text-break bg-light"
        style={{
          background:
            "linear-gradient(45deg, #97FFF4, #97FFF4, #97FFF4, #97FFF4)",
        }}
      >
        Navigation
      </button>
      <button
        type="button"
        className="btn btn-transparent  text-start text-break"
        onClick={() => window.location.href = "/"}
        >
        Startseite
      </button>
      <button
        type="button"
        className="btn btn-transparent  text-start text-break"
        onClick={() => handleTabClick("Baummonitoring")}

      >
        Baummonitoring
      </button>
      <button
        type="button"
        className="btn btn-transparent  text-start"
        onClick={() => handleTabClick("Wetter")}

      >
        Wetter / Webcam
      </button>
      {/* <button
        type="button"
        className="btn btn-transparent  text-start"
                onClick={() => handleTabClick("Webcam")}

      >
        Webcam Potzberg
      </button> */}
      <button
        type="button"
        className="btn btn-transparent text-dark text-start bg-light text-break"
        style={{
          background:
            "linear-gradient(45deg, #97FFF4, #97FFF4, #97FFF4, #97FFF4)",
        }}
      >
        Verfügbare Aktionen
      </button>
      {/* <button
        type="button"
        className="btn btn-transparent  text-start text-break"
      >
        Baum wählen
      </button> */}
      <button
        type="button"
        className="btn btn-transparent  text-start"
      >
        Zeitraum wählen
      </button>
      <button
        type="button"
        className="btn btn-transparent  text-start"
      >
        Dateien herunterladen
      </button>
      <button
        type="button"
        className="btn btn-transparent  text-start"
      >
        KI-gestuetzte Hilfe
      </button>
      <button
        type="button"
        className="btn btn-transparent  text-start"
      >
        API-Doku
      </button>
    </div>
  );
}

export default SideMenu;
