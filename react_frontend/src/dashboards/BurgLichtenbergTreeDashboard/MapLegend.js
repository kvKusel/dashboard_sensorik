import React, { useState } from "react";
import IconTree from "./LeafletTreeIconForLegend";
import { ChevronLeft, ChevronRight } from "lucide-react";


const MapLegend = () => {

    // State to track the current section being viewed
    const [currentSection, setCurrentSection] = useState(0);

    // Array of section titles for navigation
    const sections = ["", ""];
  
    // Function to handle the left arrow click
    const handleLeftArrowClick = () => {
      setCurrentSection((prevSection) =>
        prevSection === 0 ? sections.length - 1 : prevSection - 1
      );
    };
  
    // Function to handle the right arrow click
    const handleRightArrowClick = () => {
      setCurrentSection((prevSection) =>
        prevSection === sections.length - 1 ? 0 : prevSection + 1
      );
    };



    const renderSection = () => {

      switch (currentSection) {
        case 0:
          return (
            <>
            
              {/* <div className="fw-bold">Legende - Wasserbilanz Baum:</div> */}
              <div className="row d-flex">
              <div className="fw-bold">Wasserbilanz Bäume:</div>

                <div className="col-12 d-flex flex-column">
                  <div className="row d-flex  align-items-center ps-1">
                  {/*             kein Trockenstress icon */}

                  <div className=" d-flex col-12 col-md-6 ">
                    <div className="d-flex align-items-center legend-icons">
              <IconTree color={"green-left"}/>
            </div>
            <div className="d-flex align-items-center ps-1">
            kein Trockenstress
            </div>
          </div>
        

                    {/*             mäßiger Trockenstress icon */}

                    <div className=" d-flex col-12 col-md-6 ">
                    <div className="d-flex align-items-center legend-icons">
              <IconTree color={"yellow-left"}/>
            </div>
            <div className="d-flex align-items-center ps-1">
            leichter Trockenstress
            </div>
          </div>


                    {/*             hoher Trockenstress icon */}

                    <div className=" d-flex col-12 col-md-6 ">
                              <div className="d-flex align-items-center legend-icons">
              <IconTree color={"red-left"}/>
            </div>
            <div className="d-flex align-items-center ps-1">
            hoher Trockenstress
            </div>
          </div>

                    {/*             Frost icon */}

                    <div className=" d-flex col-12 col-md-6 ">
                    <div className="d-flex align-items-center legend-icons">
              <IconTree color={"blue"}/>
                          </div>
            <div className="d-flex align-items-center ps-1">
            Frost
            </div>
          </div>

                                                 {/*             "keine Daten" icon */}

                                                 <div className=" d-flex col-12 col-md-6 ">
                                                 <div className="d-flex align-items-center legend-icons">
              <IconTree color={"gray"}/>
            </div>
            <div className="d-flex align-items-center ps-1">
            keine Daten
            </div>
          </div>


                              {/*             "kein Sensor eingebaut" icon */}

                              <div className=" d-flex col-12 col-md-6 ">
                              <div className="d-flex align-items-center legend-icons">
              <IconTree color={"white"}/>
            </div>
            <div className="d-flex align-items-center ps-1">
            kein Sensor
            </div>
          </div>
          
                  </div>
                </div>
              </div>
            </>
          );
          case 1:
            return (
              <div className="row">
                <div className="col-6">
                  <div className="fw-bold">Bodenfeuchte:</div>
                  <div className="d-flex flex-column">
                    <div className="d-flex">
                      <div className="d-flex align-items-center legend-icons">
                        <IconTree color={"green-right"}/>
                      </div>
                      <div className="d-flex align-items-center ps-1">
                        feucht
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="d-flex align-items-center legend-icons">
                        <IconTree color={"yellow-right"}/>
                      </div>
                      <div className="d-flex align-items-center ps-1">
                        mäßig feucht
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="d-flex align-items-center legend-icons">
                        <IconTree color={"red-right"}/>
                      </div>
                      <div className="d-flex align-items-center ps-1">
                        trocken
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="fw-bold">Andere:</div>
                  <div className="d-flex flex-column">
                    <div className="d-flex">
                      <div className="d-flex align-items-center ps-1">
                        <svg width="27" height="19">
                          <rect width="100" height="15" rx="0" ry="0" fill="red" fillOpacity="0.7" />
                        </svg>
                      </div>
                      <div className="d-flex align-items-center ps-1 ps-xl-3">
                        Burg Lichtenberg
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="d-flex align-items-center ps-1">
                        <svg width="27" height="19">
                          <rect width="100" height="15" rx="0" ry="0" fill="blue" fillOpacity="0.6" />
                        </svg>
                      </div>
                      <div className="d-flex align-items-center ps-1 ps-xl-3">
                        Projektfläche
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
        case 2:
          return (
            <>
              {/* Add other legend items here */}
            </>
          );
        default:
          return null;
      }
    };
  
    return (
      <div className="w-100 h-100" style={{ color: "#18204F" }}>
                <h5 className="fw-bold mb-2">Legende</h5>

        <div className="fw-bold ">{sections[currentSection]}</div>
        <div className="d-flex align-items-stretch">
          <div className="d-flex align-items-center pe-1">
            <ChevronLeft
              className="cursor-pointer"
              onClick={handleLeftArrowClick}
              size={24}
            />
          </div>
          <div className="flex-grow-1">
            {renderSection()}
          </div>
          <div className="d-flex align-items-center ps-1">
            <ChevronRight
              className="cursor-pointer"
              onClick={handleRightArrowClick}
              size={24}
            />
          </div>
        </div>
      </div>
    );
  };
  


export default MapLegend;