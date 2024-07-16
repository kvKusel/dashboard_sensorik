import React, { useState } from "react";
import { Link } from "react-router-dom";
import WeatherSubpage from "./elements/WeatherSubpage";
import TreeMonitoringSubpage from "./elements/TreeMonitoringSubpage";
import WebcamSubpage from "./elements/WebcamSubpage";
import Logo from "../../assets/logo_landlieben.png";
import Dropdown from 'react-bootstrap/Dropdown';


const Dashboard = () => {
  const [runTutorial, setRunTutorial] = useState(false);

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

  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);
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

      <div className="row mx-xl-5 ">
        <div className="d-flex  align-items-center justify-content-between">
          <div className=" pt-2" style={{ flexGrow: 1 }}>
          <div className="d-none d-sm-block"> {/* Hide on small screens, show on medium and larger */}
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

<div className="d-sm-none"> {/* Hide on medium and larger screens, show only on small screens */}
  <Link to="/" className="text-decoration-none text-dark">
    <img className="logo" src={Logo} alt="Logo" />
  </Link>
</div>

          </div>{" "}
          <div className="pt-2 mx-3 ">
          <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle variant="danger" id="dropdown-basic">
        Thema auswählen
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item eventKey="Baummonitoring">Baummonitoring</Dropdown.Item>
        <Dropdown.Item eventKey="Wetter">Wetter</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
          </div>

          <div className="pt-2 ">
            <div
              className="btn btn-danger  text-decoration-none"
              onClick={() => setRunTutorial(true)}
            >
              <p className=" m-0 px-3">Hilfe</p>{" "}
              {/* m-0 removes default margin from <p> */}
            </div>
          </div>
        </div>
        {/*MAIN CONTENT  */}
        <div className="col-lg-12 ">
          {/* charts and content generated dynamically */}
          <div className="ms-lg-2">
            {activeTab === "Baummonitoring" ? (
              <TreeMonitoringSubpage
                run={runTutorial}
                setRun={setRunTutorial}
                steps={steps}
              />
            ) : activeTab === "Wetter" ? (
              <WeatherSubpage />
            ) : (
              <WebcamSubpage />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
