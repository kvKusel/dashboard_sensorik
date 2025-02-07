import React, { useState } from "react";
import { Link } from "react-router-dom";
import WeatherSubpage from "./elements/WeatherDashboard/WeatherSubpage";
import TreeMonitoringSubpage from "./elements/TreeMonitoringSubpage";
import WebcamSubpage from "./elements/WebcamSubpage";
import Logo from "../../assets/logo_landlieben.png";
import { Navbar, Nav, NavDropdown, Button, Dropdown } from 'react-bootstrap';
import HochbeetSubpage from "./elements/HochbeetDashboard/HochbeetSubpage";
import WaterLevelSubpage from "./elements/WaterLevelDashboard/WaterLevelSubpage";
import axios from "axios";
import EtschbergDashboard from "./elements/EtschbergTreeDashboard/EtschbergMainPage";

const API_URL = process.env.REACT_APP_API_URL; // This will switch based on the environment - dev env will point to local Django, prod env to the proper domain


const Dashboard = () => {
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
        case "Pegelmonitoring":
          alertText = "Das Wasserstandüberwachungs-Projekt nutzt die IoT-Technologie, um Wasserstände in Echtzeit zu überwachen. \
        Derzeit haben wir einen experimentellen Wasserstandssensor im Einsatz, der vor der Kreisverwaltung Kusel eingebaut wurde. \
        Weitere Sensoren sind bereits in Planung und werden bald installiert. \
        Diese Sensoren liefern wichtige Daten zur Vorhersage von Hochwasserereignissen und zur effizienten Wasserwirtschaft. \
        Mit diesen Informationen können wir potenzielle Überschwemmungen frühzeitig erkennen und entsprechende Maßnahmen ergreifen. \
        Dieses Projekt ist ein wichtiger Schritt zur Verbesserung des Hochwasserschutzes und zur Gewährleistung der Sicherheit unserer Gemeinden. \
        Es fördert zudem das Bewusstsein für Umweltschutz und die Bedeutung von nachhaltigem Wassermanagement. \
        Durch die Integration dieser Technologie schaffen wir eine sichere und zukunftsorientierte Infrastruktur für alle Bewohner.";
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

  
  const [activeTab, setActiveTab] = useState("Pegelmonitoring");

  const [navbarExpanded, setNavbarExpanded] = useState(false);

  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);
    setNavbarExpanded(false); // Collapse the navbar after selection
  };


  // function to download the selected asset's data
  const selectAssetToDownload = async (eventKey) => {
    if (eventKey === "Wetter") {
      try {
        const response = await axios.get(`${API_URL}api/export-weather-data/`, {
          responseType: 'blob',
        });
  
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `weather_data.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Error downloading CSV:', error);
        // Handle error (e.g., show an error message to the user)
      }    } else {
      try {
        const response = await axios.get(`${API_URL}api/export-asset-data/`, {
          params: { asset_name: eventKey },
          responseType: 'blob',
        });
  
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${eventKey}_data.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Error downloading CSV:', error);
        // Handle error (e.g., show an error message to the user)
      }
    }
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
          <div className="d-none d-xl-block"> {/* Hide on small screens, show on medium and larger */}
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
                      className="mt-2  rounded px-2 text-center custom-dropdown me-3  d-none d-xl-block"
                      style={{ backgroundColor: "rgb(220, 53, 69)" }}
                      onClick={() => handleInfoText()}
                    >
                      Mehr erfahren
                    </Button>


                    {activeTab === "Hochbeet" && (
  <div className="pt-2  d-none d-xl-block me-3">
    <Dropdown onSelect={selectAssetToDownload}>
      <Dropdown.Toggle variant="danger" id="dropdown-basic">
        Daten herunterladen
      </Dropdown.Toggle>

      <Dropdown.Menu>
      <div className='p-1 ps-3 fw-bold'>Hochbeete:</div>

      <Dropdown.Item eventKey="Wachstnix">Wachstnix</Dropdown.Item>
  <Dropdown.Item eventKey="Shoppingqueen">Shoppingqueen</Dropdown.Item>
  <Dropdown.Item eventKey="Kompostplatz 1">Kompostplatz 1</Dropdown.Item>
  <Dropdown.Item eventKey="Übersee">Übersee</Dropdown.Item>
  <Dropdown.Item eventKey="Beethoven">Beethoven</Dropdown.Item>
  <Dropdown.Item eventKey="Kohlarabi">Kohlarabi</Dropdown.Item>
        <hr />
        <Dropdown.Item eventKey="Wetter">Wetterstation</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>
)}



          <div className="pt-2  d-none d-xl-block">
  <Dropdown onSelect={handleSelect}>
    <Dropdown.Toggle variant="danger" id="dropdown-basic">
      Dashboard auswählen
    </Dropdown.Toggle>

    <Dropdown.Menu>
    <Dropdown.Item eventKey="Pegelmonitoring">Pegelmonitoring</Dropdown.Item>
      <Dropdown.Item eventKey="Baummonitoring">Baummonitoring</Dropdown.Item>
      <Dropdown.Item eventKey="Wetter">Wetter</Dropdown.Item>
      <Dropdown.Item eventKey="Hochbeet">Hochbeet-Projekt</Dropdown.Item>

    </Dropdown.Menu>
  </Dropdown>
</div>



<div className="d-xl-none  mt-1 d-flex w-100 justify-content-between"> {/* Hide on medium and larger screens, show only on small screens */}
  <Link to="/" className="text-decoration-none text-dark mt-md-3 mt-2 ">
    <img className="logo" src={Logo} alt="Logo" />
  </Link>

          {/* Hamburger menu for small screens */}
          <Navbar
              style={{ backgroundColor: "rgb(53, 79, 97)" }}
              expand="sm"
              className="d-xl-none  navbar-dark"
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

                    {activeTab === "Hochbeet" && (

                    <NavDropdown
                      title="Daten herunterladen"
                      id="basic-nav-dropdown"
                      className="mt-2 me-3 w-100 rounded p-0 text-center custom-dropdown"
                      style={{ backgroundColor: "rgb(220, 53, 69)" }}
                      onSelect={selectAssetToDownload}
                    >
                            <div className='p-1 ps-3 fw-bold'>Hochbeete:</div>

                      <NavDropdown.Item as="button" eventKey="Wachstnix">
                        Wachstnix
                      </NavDropdown.Item>
                      <NavDropdown.Item as="button" eventKey="Shoppingqueen">
                        Shoppingqueen
                      </NavDropdown.Item>
                      <NavDropdown.Item as="button" eventKey="Kompostplatz 1">
                        Kompostplatz 1
                      </NavDropdown.Item>
                      <NavDropdown.Item as="button" eventKey="Übersee">
                        Übersee
                      </NavDropdown.Item>
                      <NavDropdown.Item as="button" eventKey="Beethoven">
                        Beethoven
                      </NavDropdown.Item>
                      <NavDropdown.Item as="button" eventKey="Kohlarabi">
                        Kohlarabi
                      </NavDropdown.Item>
                      <hr/>
                      <NavDropdown.Item as="button" eventKey="Wetter">
                        Wetterstation
                      </NavDropdown.Item>
                    </NavDropdown>
                    )}

                    
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
                      <NavDropdown.Item as="button" eventKey="Pegelmonitoring">
                        Pegelmonitoring
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
              // <EtschbergDashboard
       
              // />
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
