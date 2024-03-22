import React, { useState } from "react";
import { Link } from 'react-router-dom';
import WeatherSubpage from "./elements/WeatherSubpage";
import TreeMonitoringSubpage from "./elements/TreeMonitoringSubpage";
import WebcamSubpage from "./elements/WebcamSubpage";
import Logo from '../../assets/logo_landlieben.png';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Baummonitoring");

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  return (
    /* main container */

    <div
      className="container-fluid d-flex flex-column justify-content-between"
      style={{
        background:
        "#F6F1E9",
          // "linear-gradient(to right, #232D3F, #4D4C7D, #4D4C7D, #4D4C7D, #232D3F)",
        minHeight: "100vh",
      }}
    >
      {/* create two columns, one for a side menu, the other for the main content */}

      <div className="row mx-xl-5 ">
        <div className="d-flex justify-content-start pb-2 pt-2">
        <Link to="/" className="text-decoration-none text-dark">
        <h2 >SENSORNETZ LAND <span style={{whiteSpace: "nowrap"}}>L<img className="logo" src={Logo} alt="Logo" />EBEN</span></h2>
        </Link>
        </div>
        {/* SIDE MENU  */}

        {/* <div
          className="col-lg-2 mt-2 mb-2  px-0 "
          style={{
            backgroundColor: "white",
            borderRadius: "5px",
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: 'silver'
          }}
        >

<SideMenu onTabChange={handleTabChange} />
        </div> */}

        {/*MAIN CONTENT  */}
        <div className="col-lg-12 ">
   {/* charts and content generated dynamically */}
   <div className="ms-lg-2">       
          {activeTab === "Baummonitoring" ? (
            <TreeMonitoringSubpage />
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
