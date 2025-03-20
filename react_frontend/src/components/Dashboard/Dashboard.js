import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures this runs only once when the component mounts

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
          alertText = "Wir haben mehrere Pegelmesstellen an strategisch relevanten Punkten im Landkreis installiert, um die Messpunkte dichter und effizienter zu gestalten. Diese neuen Sensoren verbessern unsere Vorbereitung auf Hochwasserereignisse erheblich und liefern wertvolle Daten für das Hochwasserschutzkonzept. Mit diesen Informationen sind wir in der Lage, potenzielle Überschwemmungen frühzeitig zu erkennen und gezielte Maßnahmen zur Gefahrenabwehr zu ergreifen. Das Projekt ist ein entscheidender Schritt zur Verbesserung des Hochwasserschutzes und zur Sicherheit unserer Gemeinden. Zusätzlich fördert es das Bewusstsein für Umweltschutz und die Notwendigkeit eines nachhaltigen Wassermanagements. Durch die Integration dieser fortschrittlichen Technologie schaffen wir eine sichere und zukunftsorientierte Infrastruktur für alle Bewohner.";
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
<>
<div className="d-flex  align-items-center justify-content-between py-2" style={{ backgroundImage: "linear-gradient(0deg, #1A2146 0%, #1F2C61 100%)", }}>
  <div className="container px-1 d-flex align-items-center justify-content-between">
          <div className=" pt-2" style={{ flexGrow: 1,  }}>
          <div className="d-none d-xl-block" > {/* Hide on small screens, show on medium and larger */}
          <h4 className="">
  <Link to="/" className="text-decoration-none text-white">
    
      SENSORNETZ LANDL(I)EBEN{" "}
      {/* <span style={{ whiteSpace: "nowrap" }}>
        L<img className="logo" src={Logo} alt="Logo" />
        EBEN
      </span> */}
    
  </Link>
  </h4>
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

{/* <h5
  className="mt-2 me-3 d-none d-xl-block text-white"
  style={{
    color: "inherit",
    fontWeight: "normal",
    cursor: "pointer",
    // textDecoration: "underline"
  }}
  onClick={() => handleInfoText()}
>
  Mehr erfahren
</h5> */}


                    {/* {activeTab === "Hochbeet" && (
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
)} */}

<div className="pt-2 d-none d-xl-block d-flex">
  <h5
    className={` nav-item `}
    style={{ 
      cursor: "pointer", 
      display: "inline-block",
      marginRight: "20px",

      fontWeight: "normal", 
      marginRight: "20px",
      textDecoration: activeTab === "Pegelmonitoring" ? "underline" : "none",
      color: activeTab === "Pegelmonitoring" ? "#AADB40" : "#fff"

    }}
    onClick={() => handleSelect("Pegelmonitoring")}
  >
    Pegelmonitoring
  </h5>
  <h5
    className={` nav-item `}
    style={{ 
      cursor: "pointer", 
      display: "inline-block",
      marginRight: "20px",
      fontWeight: "normal", 
      marginRight: "20px",
      textDecoration: activeTab === "Baummonitoring" ? "underline" : "none",
      color: activeTab === "Baummonitoring" ? "#AADB40" : "#fff"

    }}
    onClick={() => handleSelect("Baummonitoring")}
  >
    Baummonitoring
  </h5>
  <h5
    className={` nav-item `}
    style={{ 
      cursor: "pointer", 
      display: "inline-block",
      marginRight: "20px",
      fontWeight: "normal", 
      marginRight: "20px",
      textDecoration: activeTab === "Wetter" ? "underline" : "none",
      color: activeTab === "Wetter" ? "#AADB40" : "#fff"

    }}
    onClick={() => handleSelect("Wetter")}
  >
    Wetter
  </h5>
  <h5
    className={`nav-item `}
    style={{ 
      cursor: "pointer", 
      display: "inline-block",
      marginRight: "20px",
      fontWeight: "normal", 
      marginRight: "20px",
      textDecoration: activeTab === "Hochbeet" ? "underline" : "none",
      color: activeTab === "Hochbeet" ? "#AADB40" : "#fff"

    }}
    onClick={() => handleSelect("Hochbeet")}
  >
    Hochbeet-Projekt
  </h5>
</div>



<div className="d-xl-none   d-flex w-100 align-items-center justify-content-between"> {/* Hide on medium and larger screens, show only on small screens */}
<span className="">
  <Link to="/" className="text-decoration-none text-white">
    
      SENSORNETZ LANDL(I)EBEN{" "}
      {/* <span style={{ whiteSpace: "nowrap" }}>
        L<img className="logo" src={Logo} alt="Logo" />
        EBEN
      </span> */}
    
  </Link>
  </span>

          {/* Hamburger menu for small screens */}
          <div style={{ backgroundImage: "linear-gradient(0deg, #1A2146 0%, #1F2C61 100%)", 
    zIndex: 1050,         // Higher z-index to keep it on top
           }} className="d-xl-none">
  <div className="container-fluid p-0">
    <div className="d-flex justify-content-end">
      {/* Hamburger Menu Toggle Button */}
      <button 
        className="navbar-toggler custom-toggler p-2 m-2" 
        onClick={() => setNavbarExpanded(!navbarExpanded)}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '30px',
          height: '35px',
          padding: '0',
          zIndex: '10',
        }}
      >
        <div
                className="mb-1 pt-1"
                style={{
            width: '20px',
            height: '30px',
            backgroundColor: '#fff',
            borderRadius: '5px',
          }}
        ></div>
        <div
                className="mb-1 pt-1"

          style={{
            width: '20px',
            height: '30px',
            backgroundColor: '#fff',
            borderRadius: '5px',
          }}
        ></div>
        <div
                        className=" pt-1"

          style={{
            
            width: '20px',
            height: '30px',
            backgroundColor: '#fff',
            borderRadius: '5px',
          }}
        ></div>
      </button>
    </div>
    
    {/* Full width dropdown menu */}
    {navbarExpanded && (
  <div className="dropdown-menu-full-width py-2" style={{ width: "100%", background: "#1A2146" }}>
    <div className="container-fluid" style={{ textAlign: "right" }}>
      {/* <p
        onClick={() => {
          handleInfoText();
          setNavbarExpanded(false);
        }}
        style={{
          marginTop: "5px",
          marginBottom: "5px",
          padding: "5px 5px",
          color: "white",
          textAlign: "right",
          borderRadius: "5px", // Rounded corners like a button
          cursor: "pointer", // Pointer cursor to indicate it's clickable
          fontSize: "1.1em",
          display: "inline-block",
        }}
      >
        Mehr erfahren
      </p> */}

      

      <div>
        <div>
      <Link to="/" 
                  style={{
                    textDecoration: "none", // Correct way to remove underline
                    marginTop: "5px",
                    marginBottom: "5px",
                    padding: "5px 5px",
                    color: "white",
                    textAlign: "right",
                    borderRadius: "5px", // Rounded corners like a button
                    cursor: "pointer", // Pointer cursor to indicate it's clickable
                    fontSize: "1.1em",
                    display: "inline-block",
                    
                  }}
            className=" " 
            type="button" 
            id="" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            Startseite
          </Link>
          </div>

      <p 
                  style={{
                    marginTop: "5px",
                    marginBottom: "5px",
                    padding: "5px 5px",
                    color: "white",
                    textAlign: "right",
                    borderRadius: "5px", // Rounded corners like a button
                    cursor: "pointer", // Pointer cursor to indicate it's clickable
                    fontSize: "1.1em",
                    display: "inline-block",
                    textDecoration: activeTab === "Pegelmonitoring" ? "underline" : "none",
                    color: activeTab === "Pegelmonitoring" ? "#AADB40" : "#fff",
                
                  }}
                  onClick={() => handleSelect("Pegelmonitoring")}

            className=" " 
            type="button" 
            id="downloadDropdown" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            Pegelmonitoring
          </p>
          </div>
<div>
                <p 
                  style={{
                    marginTop: "5px",
                    marginBottom: "5px",
                    padding: "5px 5px",
                    color: "white",
                    textAlign: "right",
                    borderRadius: "5px", // Rounded corners like a button
                    cursor: "pointer", // Pointer cursor to indicate it's clickable
                    fontSize: "1.1em",
                    display: "inline-block",
                    textDecoration: activeTab === "Baummonitoring" ? "underline" : "none",
                    color: activeTab === "Baummonitoring" ? "#AADB40" : "#fff",
                  }}
                  onClick={() => handleSelect("Baummonitoring")}

            className=" " 
            type="button" 
            id="downloadDropdown" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            Baummonitoring
          </p>
          </div>
          <div>
                <p 
                  style={{
                    marginTop: "5px",
                    marginBottom: "5px",
                    padding: "5px 5px",
                    color: "white",
                    textAlign: "right",
                    borderRadius: "5px", // Rounded corners like a button
                    cursor: "pointer", // Pointer cursor to indicate it's clickable
                    fontSize: "1.1em",
                    display: "inline-block",
                    textDecoration: activeTab === "Wetter" ? "underline" : "none",
                    color: activeTab === "Wetter" ? "#AADB40" : "#fff",
                  }}
                  onClick={() => handleSelect("Wetter")}

            className=" " 
            type="button" 
            id="downloadDropdown" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            Wetter
          </p>
          </div>
          <div>
                <p 
                  style={{
                    marginTop: "5px",
                    marginBottom: "5px",
                    padding: "5px 5px",
                    color: "white",
                    textAlign: "right",
                    borderRadius: "5px", // Rounded corners like a button
                    cursor: "pointer", // Pointer cursor to indicate it's clickable
                    fontSize: "1.1em",
                    display: "inline-block",
                    textDecoration: activeTab === "Hochbeet" ? "underline" : "none",
                    color: activeTab === "Hochbeet" ? "#AADB40" : "#fff",
                  }}
                  onClick={() => handleSelect("Hochbeet")}

            className=" " 
            type="button" 
            id="downloadDropdown" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            Hochbeet-Projekt
          </p>
          </div>
          {/* {activeTab === "Hochbeet" && (
        <div className="dropdown mb-2">
          <p 
                  style={{
                    marginTop: "5px",
                    marginBottom: "5px",
                    padding: "5px 5px",
                    color: "white",
                    textAlign: "right",
                    borderRadius: "5px", // Rounded corners like a button
                    cursor: "pointer", // Pointer cursor to indicate it's clickable
                    fontSize: "1.1em",
                    display: "inline-block",
                  }}
            className=" dropdown-toggle" 
            type="button" 
            id="downloadDropdown" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            Daten herunterladen
          </p>
          <ul className="dropdown-menu w-100" aria-labelledby="downloadDropdown">
            <li><div className='p-1 ps-3 fw-bold'>Hochbeete:</div></li>
            <li><button className="dropdown-item" onClick={() => {selectAssetToDownload("Wachstnix"); setNavbarExpanded(false);}}>Wachstnix</button></li>
            <li><button className="dropdown-item" onClick={() => {selectAssetToDownload("Shoppingqueen"); setNavbarExpanded(false);}}>Shoppingqueen</button></li>
            <li><button className="dropdown-item" onClick={() => {selectAssetToDownload("Kompostplatz 1"); setNavbarExpanded(false);}}>Kompostplatz 1</button></li>
            <li><button className="dropdown-item" onClick={() => {selectAssetToDownload("Übersee"); setNavbarExpanded(false);}}>Übersee</button></li>
            <li><button className="dropdown-item" onClick={() => {selectAssetToDownload("Beethoven"); setNavbarExpanded(false);}}>Beethoven</button></li>
            <li><button className="dropdown-item" onClick={() => {selectAssetToDownload("Kohlarabi"); setNavbarExpanded(false);}}>Kohlarabi</button></li>
            <li><hr className="dropdown-divider"/></li>
            <li><button className="dropdown-item" onClick={() => {selectAssetToDownload("Wetter"); setNavbarExpanded(false);}}>Wetterstation</button></li>
          </ul>
        </div>
      )} */}
    </div>
  </div>
)}

  </div>
</div>
</div>



</div>

        </div>


        
    <div
      className="container-fluid d-flex flex-column justify-content-between" //container-fluid to make the page responsive?
      style={{
        background: "linear-gradient(180deg, #E2EBF7 86.43%, #FFF 100%)",
        minHeight: "100vh",
      }}
    >
      
      
      <div className="container">
        
      {/* create two columns, one for a side menu, the other for the main content */}

      <div className="row  mt-2 "  >
       
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
    </div>

<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="auto"  fill="none">
<path d="M-24.0981 93.347C-24.0981 93.347 27.3563 55.8054 87.3829 71.4753C147.414 87.1452 158.32 63.6411 207.322 45.3604C256.324 27.0796 275.301 59.8558 379.927 93.347C484.554 126.838 569.799 32.4347 674.422 61.9348C779.044 91.4366 829.418 81.848 906.918 26.5334C984.419 -28.7813 1081.29 10.3076 1176.23 81.1105C1271.16 151.913 1449.41 137.9 1507.54 75.9483C1565.66 13.9965 1598.6 52.245 1683.85 64.4654C1769.1 76.6857 1766.19 -61.3341 1946.37 64.4654L1946.37 875.664L-24.0981 875.664L-24.0981 93.347Z" fill="#05A550"/>
<path d="M-24.0981 93.347C-24.0981 93.347 27.3563 55.8054 87.3829 71.4753C147.414 87.1452 158.32 63.6411 207.322 45.3604C256.324 27.0796 275.301 59.8558 379.927 93.347C484.554 126.838 569.799 32.4347 674.422 61.9348C779.044 91.4366 829.418 81.848 906.918 26.5334C984.419 -28.7813 1081.29 10.3076 1176.23 81.1105C1271.16 151.913 1449.41 137.9 1507.54 75.9483C1565.66 13.9965 1598.6 52.245 1683.85 64.4654C1769.1 76.6857 1766.19 -61.3341 1946.37 64.4654L1946.37 875.664L-24.0981 875.664L-24.0981 93.347Z" fill="#A3D933"/>
</svg>

</>
  );
};

export default Dashboard;
