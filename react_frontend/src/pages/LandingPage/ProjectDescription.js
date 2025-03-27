import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import soilSensor from "../../assets/soil_sensor_transparent.webp";
import { Link } from "react-router-dom";

const ProjectDescription = () => {
  return (
    <Container>
      <Row className="mt-5 ">
        <Col>
          <h1 className="text-center">Über das Projekt</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col lg={6} md={12} sm={12} xl={4} xs={12} className="m-5">
          <div className="text-black" style={{ lineHeight: "250%" }}>
            <p>
              Im Rahmen des Förderprojektes „Smart Cities“ des
              Bundesministeriums für Wohnen, Stadtentwicklung und Bauwesen in
              Kooperation mit der KfW wurde der Landkreis Kusel unter dem Motto
              „LAND L(i)EBEN – digital.gemeinsam.vorOrt“ als Modellprojekt
              ausgewählt. Ein zentraler Auftrag von LAND L(i)EBEN ist der Aufbau
              von grundlegenden technischen Infrastrukturen im Landkreis Kusel.
              Dabei spielt der Einsatz von Sensoren eine entscheidende Rolle.
              <br />
              <br />
              <strong>DIE SENSOREN</strong>
              <br />
              Mit unseren Sensoren erfassen wir Echtzeitdaten, die über ein
              leistungsfähiges Dashboard visualisiert werden. Diese Daten
              unterstützen die Entwicklung vom Landkreis Kusel, indem sie
              wertvolle Einblicke in verschiedene Aspekte des alltäglichen
              Lebens liefern, wie Umweltüberwachung oder Energieeffizienz. Durch
              die Implementierung dieser Technologien wird Kusel zu einem
              zukunftsorientierten und nachhaltigen Landkreis, der die
              Lebensqualität seiner Bürger erheblich verbessert.
              <br />
              <br />
              <strong>DAS DASHBOARD</strong>
              <br />
              <Link to="/dashboard" className="text-decoration-none text-blue">
                Unser Dashboard
              </Link>{" "}
              bietet eine benutzerfreundliche Oberfläche zur Überwachung und
              Analyse der gesammelten Sensordaten. Es ermöglicht Entscheidern,
              fundierte Entscheidungen zu treffen und die Stadtverwaltung
              effizienter zu gestalten. Mit dem Ausbau des LoRaWAN-Netzwerks
              schaffen wir eine robuste und skalierbare Infrastruktur, die den
              Weg für weitere Smart City-Initiativen in Kusel ebnet.
            </p>
          </div>
        </Col>
        <Col lg={6} md={12} sm={12} xl={4} xs={12} className="m-5">
          <div className="mt-lg-5">
            <img
              className="mt-lg-5"
              src={soilSensor}
              alt="Soil Sensor"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectDescription;
