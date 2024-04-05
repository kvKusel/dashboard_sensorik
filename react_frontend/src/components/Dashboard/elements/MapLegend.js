import React from "react";
import { ReactComponent as GreenTreeImage } from "../../../assets/green_tree.svg";
import { ReactComponent as YellowTreeImage } from "../../../assets/yellow_tree.svg";
import { ReactComponent as NoSensor } from "../../../assets/icon_kein_sensor.svg";
import IconTree from "./LeafletTreeIconForLegend";

const MapLegend = () => {
  return (
    <>
      <div className="w-100 h-100">
        <div className="row  d-flex  ">
          <div className="col-12">
          <div>
      <div>
      </div>
    </div>
            <h5 className="fw-bold">Legende:</h5>
          </div>
        </div>
        <div className="row  d-flex ">
        <div className="col-md-5 col-6 d-flex flex-column ">
        <div className="fw-bold">Zustand allgemein:</div>

        
                    {/*             kein Trockenstress icon */}

                    <div className=" d-flex  ">
                    <div className="d-flex align-items-center legend-icons">
              <IconTree color={"green-left"}/>
            </div>
            <div className="d-flex align-items-center ps-1">
            kein Trockenstress
            </div>
          </div>
        

                    {/*             mäßiger Trockenstress icon */}

                    <div className=" d-flex  ">
                    <div className="d-flex align-items-center legend-icons">
              <IconTree color={"yellow-left"}/>
            </div>
            <div className="d-flex align-items-center ps-1">
            leichter T.
            </div>
          </div>


                    {/*             hoher Trockenstress icon */}

                              <div className=" d-flex  ">
                              <div className="d-flex align-items-center legend-icons">
              <IconTree color={"red-left"}/>
            </div>
            <div className="d-flex align-items-center ps-1">
            hoher T.
            </div>
          </div>

                    {/*             Frost icon */}

                    <div className=" d-flex  ">
                    <div className="d-flex align-items-center legend-icons">
              <IconTree color={"blue"}/>
                          </div>
            <div className="d-flex align-items-center ps-1">
            Frost
            </div>
          </div>


                              {/*             "kein Sensor eingebaut" icon */}

                              <div className=" d-flex  ">
            <div className="d-flex align-items-center legend-icons">
              <IconTree color={"transparent"}/>
            </div>
            <div className="d-flex align-items-center ps-1">
            kein Sensor
            </div>
          </div>







        </div>

        <div className="col-md-3 col-6 d-flex flex-column ">
        <div className="fw-bold">Bodenfeuchte:</div>
        

        
                    {/* feucht Icon */}

                    <div className="d-flex  ">
                    <div className="d-flex align-items-center legend-icons">
              <IconTree color={"green-right"}/>
            </div>
            <div className="d-flex align-items-center ps-1">
feucht</div>
          </div>
        

                    {/* mäßig Icon */}

                    <div className="d-flex  ">
                    <div className="d-flex align-items-center legend-icons">
              <IconTree color={"yellow-right"}/>
            </div>
            <div className="d-flex align-items-center ps-1">
mäßig            </div>
          </div>


                              {/* trocken Icon   */}

                              <div className=" d-flex  ">
                              <div className="d-flex align-items-center legend-icons">
              <IconTree color={"red-right"}/>
            </div>
            <div className="d-flex align-items-center ps-1">
trocken
            </div>
          </div>




        </div>

        <div className="col-md-4 col-sm-6 d-flex  flex-column">
        <div className="fw-bold">Andere:</div>

            

                                {/* icon Burg Lichtenberg */}
                                <div className=" d-flex ">
            <div className="d-flex align-items-center ps-1">
            <svg width="27" height="19">

  <rect width="100" height="15" rx="0" ry="0" fill="red" fillOpacity="0.7" />
</svg>
    
                   </div>
            <div className="d-flex align-items-center ps-1 ps-xl-3">
              Burg Lichtenberg
            </div>
          </div>

            {/* icon Streuobstwiese */}

          <div className=" d-flex ">
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
    </>
  );
};

export default MapLegend;
