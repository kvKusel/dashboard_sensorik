// WelcomePopup.js
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const WelcomePopup = ({ activeTab }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("seenWelcomePopup");
    if (activeTab === "Pegelmonitoring" && !hasSeenPopup) {
      setShow(true);
      sessionStorage.setItem("seenWelcomePopup", "true");
    }
  }, [activeTab]);

  const handleClose = () => setShow(false);

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered> {/* Add centered prop here */}
      <Modal.Header closeButton>
        <Modal.Title>Willkommen zum Pegel-Dashboard!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Hier finden Sie aktuelle Wasserstandsdaten, interaktive Karten, historische
          Niederschlagsverläufe und eine Übersicht aller unserer Messstellen im Landkreis Kusel.
        </p>
        <p>
Die angezeigten Daten können unvollständig und fehlerhaft sein. Die Nutzung der Daten erfolgt daher auf eigene Verantwortung und schließt rechtliche Ansprüche aus.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Verstanden
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WelcomePopup;