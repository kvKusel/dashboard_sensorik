import React from "react";
import { ReactComponent as GreenTreeImage } from "../../../assets/green_tree.svg";
import { ReactComponent as YellowTreeImage } from "../../../assets/yellow_tree.svg";

const MapLegend = () => {
  return (
    <>
      <div className="w-100 h-100">
        <div className="row h-25 d-flex pb-2 pb-lg-4">
          <div className="col-12">
            <h5>Legende:</h5>
          </div>
        </div>
        <div className="row h-75  d-flex">

                      {/* icon Burg Lichtenberg */}
                      <div className="col-xl-4 col-sm-6 d-flex ">
            <div className="d-flex align-items-center ps-1">
            <svg width="19" height="19">

  <rect width="100" height="15" rx="0" ry="0" fill="red" fillOpacity="0.7" />
</svg>
    
                   </div>
            <div className="d-flex align-items-center ps-1 ps-xl-3">
              Burg Lichtenberg
            </div>
          </div>

            {/* icon Streuobstwiese */}

          <div className="col-xl-4 col-sm-6 d-flex ">
            <div className="d-flex align-items-center ps-1">
            <svg width="19" height="19">
                <rect width="100" height="15" rx="0" ry="0" fill="blue" fillOpacity="0.6" />
              </svg>       
                   </div>
            <div className="d-flex align-items-center ps-1 ps-xl-3">
              Projektfläche
            </div>
          </div>

          

                    {/* this will be a yellow (activated) tree  */}

        <div className="col-xl-4 col-sm-6 d-flex  ">
            <div className="d-flex align-items-center">
              <YellowTreeImage className="legend-icons" />
            </div>
            <div className="d-flex align-items-center ps-1">
            ausgewählter Baum
            </div>
          </div>
          
          {/* this will be a normal tree with a sensor  */}
          <div className="col-xl-4 col-sm-6 d-flex ">
            <div className="d-flex align-items-center">
              <GreenTreeImage className="legend-icons" />
            </div>
            <div className="d-flex align-items-center ps-1">
              Baum mit Sensor
            </div>
          </div>

                    {/* this will be a tree without a sensor  */}
                    <div className="col-xl-4 col-sm-6 d-flex ">
            <div className="d-flex align-items-center">
              <GreenTreeImage className="legend-icons" />
            </div>
            <div className="d-flex align-items-center ps-1">
              Baum ohne Sensor
            </div>
          </div>





        </div>
      </div>
    </>
  );
};

export default MapLegend;
