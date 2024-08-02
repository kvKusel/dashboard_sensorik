import React, { useState } from "react";
import { Link } from "react-router-dom";
import WeatherSubpage from "./elements/WeatherDashboard/WeatherSubpage";
import TreeMonitoringSubpage from "./elements/TreeMonitoringSubpage";
import WebcamSubpage from "./elements/WebcamSubpage";
import Logo from "../../assets/logo_landlieben.png";
import { Navbar, Nav, NavDropdown, Button, Dropdown } from 'react-bootstrap';
import HochbeetSubpage from "./elements/HochbeetDashboard/HochbeetSubpage";
import WaterLevelSubpage from "./elements/WaterLevelDashboard/WaterLevelSubpage";

const Dashboard = () => {
  const [runTutorial, setRunTutorial] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");


  const handleInfoText = () => {
    let alertText = "";
    switch (activeTab) {
      case "Baummonitoring":
        alertText = "Unser Baummonitoringsystem nutzt Bodenfeuchte- und Feuchtigkeitssensoren, die den Feuchtigkeitsgehalt im Bauminneren messen, um die Gesundheit der Bäume in Echtzeit zu überwachen. Eine nahegelegene Wetterstation erfasst zusätzlich Temperatur, Niederschlag und andere Wetterdaten, um Korrelationen herzustellen und ein umfassenderes Bild der Umgebungsbedingungen zu erhalten.";
        break;
      case "Wetter":
        alertText = "Unser Wettersystem verwendet eine Vielzahl von LoRaWAN-Sensoren, um präzise Messungen von Temperatur, Luftdruck, Windgeschwindigkeit und -richtung, sowie Niederschlagsmengen zu erfassen. Diese Daten helfen dabei, lokale Wetterbedingungen in Echtzeit zu überwachen und langfristige Wettertrends zu analysieren.";
        break;
      case "Hochbeet":
        alertText = "Das Hochbeet-Projekt nutzt LoRaWAN-Technologie, um Bodenfeuchtigkeit und pH-Werte in Echtzeit zu überwachen.\
         Diese Sensoren liefern essentielle Daten zur Optimierung der Wachstumsbedingungen und ermöglichen eine effiziente Wasserwirtschaft.\
           Dieses  Projekt haben wir in Zusammenarbeit mit dem Siebenpfeiffer-Gymnasium in Kusel ins Leben gerufen. \
Die Schülerinnen und Schüler übernahmen den Bau der Hochbeete, während wir für die Integration der Sensortechnik verantwortlich waren. \
Dank dieser Kombination können die Jugendlichen nun die Entwicklung ihrer Pflanzen live verfolgen und bei Bedarf gezielt eingreifen. \
 Diese praxisnahe Anwendung von Technologie im Gartenbau fördert nicht nur das Verständnis für nachhaltige Anbaumethoden, sondern weckt auch das Interesse \
 der Schüler an MINT-Fächern.";
        break;
        default:
          alertText = "No selection made.";
      }
      setPopupText(alertText);
      setShowPopup(true); // Show the custom popup
    };
  
    const handleClosePopup = () => {
      setShowPopup(false); // Hide the custom popup
    };

  

  //define steps for onboarding process
  const steps = [
    {
      target: ".first-step",
      content:
        "Willkommen zu unserem Dashboard! In den nächsten 60 Sekunden zeigen wir Dir welche Informationen die Seite für Dich bereithält.",
      placement: "center",
    },
    {
      target: ".second-step",
      content: "Die Karte stellt den aktuell ausgewählten Ansicht dar.",
      placement: "bottom",
    },
    {
      target: ".third-step",
      content: "Die Karte stellt den aktuell ausgewählten Ansicht dar.",
      placement: "bottom",
    },
    {
      target: ".step-4",
      content: "Hier wird die Bodenfeuchte des ausgewählten Bäumes in den letzten 24h angezeigt.",
      placement: "bottom",
    },
    {
      target: ".step-5",
      content: "Hier wird die Bodenfeuchte des ausgewählten Bäumes in den letzten 24h angezeigt.",
      placement: "bottom",
    },
    // Define more steps as needed
  ];

  const [activeTab, setActiveTab] = useState("Baummonitoring");

  const [navbarExpanded, setNavbarExpanded] = useState(false);

  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);
    setNavbarExpanded(false); // Collapse the navbar after selection
  };

  return (
    /* main container */

    <div
      className="container-fluid d-flex flex-column justify-content-between"
      style={{
        background: "#354F61",
        // "linear-gradient(to right, #232D3F, #4D4C7D, #4D4C7D, #4D4C7D, #232D3F)",
        minHeight: "100vh",
      }}
    >
      {/* create two columns, one for a side menu, the other for the main content */}

      <div className="row mx-xl-5 mt-2 ">
        <div className="d-flex  align-items-center justify-content-between">
          <div className=" pt-2" style={{ flexGrow: 1 }}>
          <div className="d-none d-lg-block"> {/* Hide on small screens, show on medium and larger */}
          <h2>
  <Link to="/" className="text-decoration-none text-white">
    
      SENSORNETZ LAND{" "}
      <span style={{ whiteSpace: "nowrap" }}>
        L<img className="logo" src={Logo} alt="Logo" />
        EBEN
      </span>
    
  </Link>
  </h2>
</div>


          </div>{" "}

          {/* <div className="pt-2 d-none d-sm-block me-3">
  <div
    className="btn btn-danger text-decoration-none"
    onClick={() => setRunTutorial(true)}
  >
    <p className="m-0 px-3">Mehr</p>
  </div>
</div> */}

<Button
                      variant="danger"
                      className="mt-2  rounded px-2 text-center custom-dropdown me-3  d-none d-lg-block"
                      style={{ backgroundColor: "rgb(220, 53, 69)" }}
                      onClick={() => handleInfoText()}
                    >
                      Mehr erfahren
                    </Button>


          <div className="pt-2  d-none d-lg-block">
  <Dropdown onSelect={handleSelect}>
    <Dropdown.Toggle variant="danger" id="dropdown-basic">
      Dashboard auswählen
    </Dropdown.Toggle>

    <Dropdown.Menu>
      <Dropdown.Item eventKey="Baummonitoring">Baummonitoring</Dropdown.Item>
      <Dropdown.Item eventKey="Wetter">Wetter</Dropdown.Item>
      <Dropdown.Item eventKey="Hochbeet">Hochbeet-Projekt</Dropdown.Item>
      <Dropdown.Item eventKey="Pegelmonitoring">Pegelmonitoring</Dropdown.Item>

    </Dropdown.Menu>
  </Dropdown>
</div>



<div className="d-lg-none  mt-1 d-flex w-100 justify-content-between"> {/* Hide on medium and larger screens, show only on small screens */}
  <Link to="/" className="text-decoration-none text-dark mt-md-3 mt-2 ">
    <img className="logo" src={Logo} alt="Logo" />
  </Link>

          {/* Hamburger menu for small screens */}
          <Navbar
              style={{ backgroundColor: "rgb(53, 79, 97)" }}
              expand="sm"
              className="d-lg-none  navbar-dark"
              expanded={navbarExpanded}
              onToggle={() => setNavbarExpanded(!navbarExpanded)}
            >

 

              <div className="container-fluid p-0">



                <Navbar.Brand className="invisible">Placeholder</Navbar.Brand>

                <Navbar.Toggle
                  aria-controls="basic-navbar-nav"
                  className="custom-toggler"
                  onClick={() => setNavbarExpanded(!navbarExpanded)}
                />
                <Navbar.Collapse id="basic-navbar-nav">
                  
                  <Nav className="w-100">
                  <Button
                      variant="danger"
                      className="mt-2 w-100 rounded px-2 text-center custom-dropdown me-3"
                      style={{ backgroundColor: "rgb(220, 53, 69)" }}
                      onClick={() => handleInfoText()}
                    >
                      Mehr erfahren
                    </Button>

                    
                    <NavDropdown
                      title="Dashboard auswählen"
                      id="basic-nav-dropdown"
                      className="mt-2 w-100 rounded p-0 text-center custom-dropdown"
                      style={{ backgroundColor: "rgb(220, 53, 69)" }}
                      onSelect={handleSelect}
                    >
                      <NavDropdown.Item as="button" eventKey="Baummonitoring">
                        Baummonitoring
                      </NavDropdown.Item>
                      <NavDropdown.Item as="button" eventKey="Wetter">
                        Wetter
                      </NavDropdown.Item>
                      <NavDropdown.Item as="button" eventKey="Hochbeet">
                        Hochbeet-Projekt
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </Navbar.Collapse>
              </div>
            </Navbar>
</div>




        </div>
        {/*MAIN CONTENT  */}
        <div className="col-lg-12 ">
          {/* charts and content generated dynamically */}
          <div className="ms-lg-2">
            {activeTab === "Baummonitoring" ? (
              <TreeMonitoringSubpage
       
              />
            ) : activeTab === "Wetter" ? (
              <WeatherSubpage  /> ) : activeTab === "Hochbeet" ? (
                <HochbeetSubpage  />
            ) : (
              <WaterLevelSubpage />
            )}
          </div>
        </div>
      </div>

      {/* Custom Popup */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#003065",
            borderRadius: "0px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "lightgray",
            padding: "20px",
            zIndex: "1000", // Ensure the popup is above other elements
            color: "white",
            textAlign: "center",
            lineHeight: "1.7",
            fontSize: "1.2rem",
            minWidth: "80%",
            maxWidth: "90%",
            maxHeight: "80%",
            overflowY: "auto", // Make content scrollable
          }}
        >
          <p>{popupText}</p>
          <Button variant="secondary" onClick={handleClosePopup}>
            Schließen
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
