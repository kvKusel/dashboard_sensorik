import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import soilSensor from '../assets/soil_sensor_transparent.webp';


const ProjectDescription = () => {
  return (
    <Container>
      <Row className="mt-5 mb-5">
        <Col>
          <h1 className="text-center">Über das Projekt</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col lg={6} md={12} sm={12} xl={4} xs={12} className="m-5">
          <div className="text-black" style={{ lineHeight: "250%" }}>
            <strong>Zur Experimentierfläche</strong>
            <p>
              Die Streuobstwiese befindet sich in direkter Nähe zur Burg Lichtenberg in Thallichtenberg
              und umfasst 15 Äpfel- und Birnenbäume sowie 2 Insektennistkästen und eine Liegebank.
              Die Experimentierfläche liegt direkt an mehreren (Premium-)Wanderwegen.
              Im Rahmen von LAND L(i)EBEN werden die Experimentierfläche und das umliegende Gelände nun
              mithilfe von Messtechnik ausgestattet, um verschiedenste Umweltwerte zu überwachen.
            </p>
          </div>
        </Col>
        <Col lg={6} md={12} sm={12} xl={4} xs={12} className="m-5">
      <div>
        <img src={soilSensor} alt="Soil Sensor" style={{ width: '100%', height: 'auto' }} />
      </div>
    </Col>
      </Row>
    </Container>
  );
};

export default ProjectDescription;
