// TreeCard.js
import React from "react";
import { ReactComponent as TreeSVG } from "../../../assets/tree.svg";

const TreeCard = ({ selectedTreeName, selectedLastValue }) => {

  return (
    <div
      className="col-3 p-2 m-2 mb-3 mb-lg-2 mb-xl-0 rounded-3 d-flex flex-column"
      style={{
        flex: "1 1 auto",
        maxWidth: "100%",
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",
        borderRadius: "0px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "#FFFFFF",
        zIndex: "0", // Ensure controls of the map are underneath dropdown elements
      }}
    >
      <div
        className=""
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: "auto",
          overflow: "hidden",
        }}
      >
        <TreeSVG
          className="pt-5"
          style={{ width: "90%", height: "auto", maxWidth: "90%" }}
        />
      </div>
      <div
        className="d-flex flex-column"
        style={{
          width: "100%",
          height: "30%",
          justifyContent: "flex-end",
        }}
      >
        <p className="fs-3 fw-bold">Baum: {selectedTreeName}</p>
        <p className="fs-3 fw-bold">
  Bodenfeuchte: {selectedLastValue ? `${selectedLastValue.value} %` : "Loading..."}
</p>      </div>
    </div>
  );
};

export default TreeCard;
