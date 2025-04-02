import { React, useState } from "react";
import { Link } from "react-router-dom";

const SmallNavbar = ({ activeTab, handleSelect, navbarExpanded, setNavbarExpanded }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  return (
    <div
    style={{
      backgroundImage:
        "linear-gradient(0deg, #1A2146 0%, #1F2C61 100%)",
      zIndex: 1050, // Higher z-index to keep it on top
    }}
    className="d-xl-none"
  >
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-end">
        {/* Hamburger Menu Toggle Button */}
        <button
          className="navbar-toggler custom-toggler p-2 m-2"
          onClick={() => setNavbarExpanded(!navbarExpanded)}
          style={{
            background: "none",
            border: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            width: "30px",
            height: "35px",
            padding: "0",
            zIndex: "10",
          }}
        >
          <div
            className="mb-1 pt-1"
            style={{
              width: "20px",
              height: "30px",
              backgroundColor: "#fff",
              borderRadius: "5px",
            }}
          ></div>
          <div
            className="mb-1 pt-1"
            style={{
              width: "20px",
              height: "30px",
              backgroundColor: "#fff",
              borderRadius: "5px",
            }}
          ></div>
          <div
            className=" pt-1"
            style={{
              width: "20px",
              height: "30px",
              backgroundColor: "#fff",
              borderRadius: "5px",
            }}
          ></div>
        </button>
      </div>

      {/* Full width dropdown menu */}
      {navbarExpanded && (
        <div
          className="dropdown-menu-full-width py-2"
          style={{ width: "100%", background: "#1A2146" }}
        >
          <div
            className="container-fluid"
            style={{ textAlign: "right" }}
          >
            <div>
              <div>
                <Link
                  to="/"
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
                  textAlign: "right",
                  borderRadius: "5px", // Rounded corners like a button
                  cursor: "pointer", // Pointer cursor to indicate it's clickable
                  fontSize: "1.1em",
                  display: "inline-block",
                  textDecoration:
                    activeTab === "Pegelmonitoring"
                      ? "underline"
                      : "none",
                  color:
                    activeTab === "Pegelmonitoring"
                      ? "#AADB40"
                      : "#fff",
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
   
            <div
        className="nav-item position-relative"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
        style={{
          
         
          textAlign: "right",
          borderRadius: "5px", // Rounded corners like a button
          cursor: "pointer", // Pointer cursor to indicate it's clickable
          
          display: "inline-block",
          textDecoration:
            activeTab === "Baummonitoring"
              ? "underline"
              : "none",
          color:
            activeTab === "Baummonitoring"
              ? "#AADB40"
              : "#fff",
        }}      >
        <p
         className="nav-item position-relative"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
        style={{
          marginTop: "5px",
          marginBottom: "5px",
          padding: "5px 5px",
          textAlign: "right",
          borderRadius: "5px", // Rounded corners like a button
          cursor: "pointer", // Pointer cursor to indicate it's clickable
          fontSize: "1.1em",
          display: "inline-block",
          textDecoration:
            activeTab === "Baummonitoring"
              ? "underline"
              : "none",
          color:
            activeTab === "Baummonitoring"
              ? "#AADB40"
              : "#fff",
        }}      
        >
          Baummonitoring ▾
        </p>

        {isDropdownOpen && (
          <div
            className="position-absolute bg-white rounded shadow "
            style={{ top: "100%", left: 0, minWidth: "160px",  zIndex: "9999" }}
          >
            <div className="custom-dropdown-item rounded-top">
            <p
              className="dropdown-item  px-2 py-1 "
              style={{ cursor: "pointer", color: "black",  zIndex: "999" }}
              onClick={() => {
                handleSelect("BaummonitoringBurgLichtenberg");
                setIsDropdownOpen(false);
              }}
            >
              Burg Lichtenberg
            </p>
            </div>
            {/* <hr style={{  borderColor: "#ddd" }} /> */}
            <div className="custom-dropdown-item rounded-bottom ">

            <p
              className="dropdown-item px-2 py-1 custom-dropdown-item"
              style={{ cursor: "pointer", color: "black",  zIndex: "999" }}
              onClick={() => {
                handleSelect("BaummonitoringEtschberg");
                setIsDropdownOpen(false);
              }}
            >
              Etschberg
            </p>
            </div>
          </div>
        )}
      </div>

            <div>
              <p
                style={{
                  marginTop: "5px",
                  marginBottom: "5px",
                  padding: "5px 5px",
                  textAlign: "right",
                  borderRadius: "5px", // Rounded corners like a button
                  cursor: "pointer", // Pointer cursor to indicate it's clickable
                  fontSize: "1.1em",
                  display: "inline-block",
                  textDecoration:
                    activeTab === "Wetter" ? "underline" : "none",
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
                  textAlign: "right",
                  borderRadius: "5px", // Rounded corners like a button
                  cursor: "pointer", // Pointer cursor to indicate it's clickable
                  fontSize: "1.1em",
                  display: "inline-block",
                  textDecoration:
                    activeTab === "Hochbeet" ? "underline" : "none",
                  color:
                    activeTab === "Hochbeet" ? "#AADB40" : "#fff",
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
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default SmallNavbar;
