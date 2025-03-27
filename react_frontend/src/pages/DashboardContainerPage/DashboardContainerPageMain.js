import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import HochbeetSubpage from "../../dashboards/HochbeetDashboard/HochbeetSubpage";
import TreeMonitoringSubpage from "../../dashboards/BurgLichtenbergTreeDashboard/TreeMonitoringSubpage";
import WaterLevelDashboard from "../../dashboards/WaterLevelDashboard/WaterLevelMainPage";
import WeatherSubpage from "../../dashboards/WeatherDashboard/WeatherSubpage";
import LargeNavbar from "./NavbarLarge";
import SmallNavbar from "./NavbarSmall";

const API_URL = process.env.REACT_APP_API_URL; // This will switch based on the environment - dev env will point to local Django, prod env to the proper domain

const Dashboard = () => {
  useEffect(() => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const [navbarExpanded, setNavbarExpanded] = useState(false);

  // function to handle the selection of the tab, switches to the selected dashboard

  const [activeTab, setActiveTab] = useState("Pegelmonitoring");

  const handleSelect = (eventKey) => {
    setActiveTab(eventKey);
    setNavbarExpanded(false); // Collapse the navbar after selection
  };

  // function to download the selected asset's data
  const selectAssetToDownload = async (eventKey) => {
    if (eventKey === "Wetter") {
      try {
        const response = await axios.get(`${API_URL}api/export-weather-data/`, {
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `weather_data.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error downloading CSV:", error);
        // Handle error (e.g., show an error message to the user)
      }
    } else {
      try {
        const response = await axios.get(`${API_URL}api/export-asset-data/`, {
          params: { asset_name: eventKey },
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${eventKey}_data.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error downloading CSV:", error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  };

  return (
    /* main container */
    <>
      <div
        className="d-flex  align-items-center justify-content-between py-2"
        style={{
          backgroundImage: "linear-gradient(0deg, #1A2146 0%, #1F2C61 100%)",
        }}
      >
        <div className="container px-1 d-flex align-items-center justify-content-between">
          <div className=" pt-2" style={{ flexGrow: 1 }}>
            <div className="d-none d-xl-block">
              {" "}
              {/* Hide on small screens, show on medium and larger */}
              <h4 className="">
                <Link to="/" className="text-decoration-none text-white">
                  SENSORNETZ LANDL(I)EBEN{" "}
                </Link>
              </h4>
            </div>
          </div>{" "}
          <LargeNavbar activeTab={activeTab} handleSelect={handleSelect} />
          {/* Hide on medium and larger screens, show only on small screens */}
          <div className="d-xl-none   d-flex w-100 align-items-center justify-content-between">
            {" "}
            <span className="">
              <Link to="/" className="text-decoration-none text-white">
                SENSORNETZ LANDL(I)EBEN{" "}
              </Link>
            </span>
            {/* Hamburger menu for small screens */}
            <SmallNavbar
              activeTab={activeTab}
              handleSelect={handleSelect}
              navbarExpanded={navbarExpanded}
              setNavbarExpanded={setNavbarExpanded}
            />
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

          <div className="row  mt-2 ">
            {/*MAIN CONTENT  */}
            <div className="col-lg-12 ">
              {/* charts and content generated dynamically */}
              <div className="ms-lg-2">
                {activeTab === "Baummonitoring" ? (
                  <TreeMonitoringSubpage />
                ) : // <EtschbergDashboard

                // />
                activeTab === "Wetter" ? (
                  <WeatherSubpage />
                ) : activeTab === "Hochbeet" ? (
                  <HochbeetSubpage />
                ) : (
                  <WaterLevelDashboard />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="auto"
        fill="none"
      >
        <path
          d="M-24.0981 93.347C-24.0981 93.347 27.3563 55.8054 87.3829 71.4753C147.414 87.1452 158.32 63.6411 207.322 45.3604C256.324 27.0796 275.301 59.8558 379.927 93.347C484.554 126.838 569.799 32.4347 674.422 61.9348C779.044 91.4366 829.418 81.848 906.918 26.5334C984.419 -28.7813 1081.29 10.3076 1176.23 81.1105C1271.16 151.913 1449.41 137.9 1507.54 75.9483C1565.66 13.9965 1598.6 52.245 1683.85 64.4654C1769.1 76.6857 1766.19 -61.3341 1946.37 64.4654L1946.37 875.664L-24.0981 875.664L-24.0981 93.347Z"
          fill="#05A550"
        />
        <path
          d="M-24.0981 93.347C-24.0981 93.347 27.3563 55.8054 87.3829 71.4753C147.414 87.1452 158.32 63.6411 207.322 45.3604C256.324 27.0796 275.301 59.8558 379.927 93.347C484.554 126.838 569.799 32.4347 674.422 61.9348C779.044 91.4366 829.418 81.848 906.918 26.5334C984.419 -28.7813 1081.29 10.3076 1176.23 81.1105C1271.16 151.913 1449.41 137.9 1507.54 75.9483C1565.66 13.9965 1598.6 52.245 1683.85 64.4654C1769.1 76.6857 1766.19 -61.3341 1946.37 64.4654L1946.37 875.664L-24.0981 875.664L-24.0981 93.347Z"
          fill="#A3D933"
        />
      </svg>
    </>
  );
};

export default Dashboard;
