import React, { useState } from "react";

const LargeNavbar = ({ activeTab, handleSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="pt-2 d-none d-xl-block d-flex">
      <h5
        className="nav-item"
        style={{
          cursor: "pointer",
          display: "inline-block",
          marginRight: "20px",
          fontWeight: "normal",
          textDecoration: activeTab === "Pegelmonitoring" ? "underline" : "none",
          color: activeTab === "Pegelmonitoring" ? "#AADB40" : "#fff",
        }}
        onClick={() => handleSelect("Pegelmonitoring")}
      >
        Pegelmonitoring
      </h5>

      <div
        className="nav-item position-relative"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
        style={{ display: "inline-block", marginRight: "20px", cursor: "pointer" }}
      >
        <h5
          style={{
            fontWeight: "normal",
            textDecoration: activeTab.startsWith("Baummonitoring") ? "underline" : "none",
            color: activeTab.startsWith("Baummonitoring") ? "#AADB40" : "#fff",
          }}
        >
          Baummonitoring ▾
        </h5>

        {isDropdownOpen && (
          <div
            className="position-absolute bg-white rounded shadow "
            style={{ top: "100%", left: 0, minWidth: "160px",  zIndex: "9999" }}
          >
            <div className="custom-dropdown-item rounded-top">
            <h6
              className="dropdown-item  px-2 py-1 "
              style={{ cursor: "pointer", color: "black",  zIndex: "999" }}
              onClick={() => {
                handleSelect("BaummonitoringBurgLichtenberg");
                setIsDropdownOpen(false);
              }}
            >
              Burg Lichtenberg
            </h6>
            </div>
            {/* <hr style={{  borderColor: "#ddd" }} /> */}
            <div className="custom-dropdown-item rounded-bottom ">

            <h6
              className="dropdown-item px-2 py-1 custom-dropdown-item"
              style={{ cursor: "pointer", color: "black",  zIndex: "999" }}
              // onClick={() => {
              //   handleSelect("BaummonitoringEtschberg");
              //   setIsDropdownOpen(false);
              // }}
            >
              Etschberg
            </h6>
            </div>
          </div>
        )}
      </div>

      <h5
        className="nav-item"
        style={{
          cursor: "pointer",
          display: "inline-block",
          marginRight: "20px",
          fontWeight: "normal",
          textDecoration: activeTab === "Wetter" ? "underline" : "none",
          color: activeTab === "Wetter" ? "#AADB40" : "#fff",
        }}
        onClick={() => handleSelect("Wetter")}
      >
        Wetter
      </h5>

      <h5
        className="nav-item"
        style={{
          cursor: "pointer",
          display: "inline-block",
          marginRight: "20px",
          fontWeight: "normal",
          textDecoration: activeTab === "Hochbeet" ? "underline" : "none",
          color: activeTab === "Hochbeet" ? "#AADB40" : "#fff",
        }}
        onClick={() => handleSelect("Hochbeet")}
      >
        Hochbeet-Projekt
      </h5>
    </div>
  );
};

export default LargeNavbar;
