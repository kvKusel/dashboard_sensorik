// src/components/Navbar/LargeNavbar.js

import React from "react";
import { Link } from "react-router-dom";

const LargeNavbar = ({ activeTab, handleSelect }) => {
  return (
    <div className="pt-2 d-none d-xl-block d-flex">
               <h5
                 className={` nav-item `}
                 style={{
                   cursor: "pointer",
                   display: "inline-block",
                   marginRight: "20px",
   
                   fontWeight: "normal",
                   marginRight: "20px",
                   textDecoration:
                     activeTab === "Pegelmonitoring" ? "underline" : "none",
                   color: activeTab === "Pegelmonitoring" ? "#AADB40" : "#fff",
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
                   textDecoration:
                     activeTab === "Baummonitoring" ? "underline" : "none",
                   color: activeTab === "Baummonitoring" ? "#AADB40" : "#fff",
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
                   textDecoration: activeTab === "Wetter" ? "underline" : "none",
                   color: activeTab === "Wetter" ? "#AADB40" : "#fff",
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
