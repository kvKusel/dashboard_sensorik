import React, { useState } from 'react';
import { ReactComponent as GreenTreeImage } from "../../../assets/green_tree.svg";
import LeafletMap from "./LeafletMap";
import BarChart from "./BarChart";
import Gauge from "./DoughnutChart";
import DropdownButton from './DropDown';
import { treeHealthConfig, soilMoistureGaugeChartConfig } from '../../../chartsConfig/chartsConfig';
import MapLegend from './MapLegend';

const TreeInfoContainer = ({ trees, selectedTree, handleTreeSelection }) => {

  // set up for the gauge 
  const currentValue = 80;


  return (
    <div className="row" style={{ flex: "1 1 auto" }}>
      
      <div className="col-md-4 p-2 d-flex flex-column" >
        <div
          className="col-12 d-flex flex-column mb-3 h-25 order-1" 
          style={{
            borderRadius: "0px",
            flex: "1 1 auto",
            justifyContent: 'center',
            borderWidth:'1px',

          }}
        >
          

              <DropdownButton trees={trees} onSelectTree={handleTreeSelection}/>
       
        </div>
          
        <div
          className="col-12 d-flex flex-column mb-3 h-75 order-2" 
          style={{
            // backgroundColor: "white",
            backgroundColor: "#DDF2FD",

            borderRadius: "0px",
            flex: "0 1 10%",
            justifyContent: 'center',
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: 'silver'

          }}
        >
      
            <div className=" text-center p-2 d-flex align-items-center lead" style={{ display: "flex", alignItems: "center", justifyContent: 'center'}}>
              {selectedTree && selectedTree.id !== 6 ? selectedTree.name : "(Baum auswählen, um fortzufahren)"}
              
            </div>

            
   
        </div>
        



        <div
          className="col-12 d-flex flex-column justify-content-between order-5 mb-3" 
          style={{
            backgroundColor: "white",
            borderRadius: "0px",
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: 'silver'

          }}
        >

               <div className="col-12 d-flex flex-column align-items-center justify-content-center pt-2" >
               {/* it's a "special chart" because the gauge's needle will be resting at 0 if undefined */}
            <Gauge  currentValue={currentValue} config={treeHealthConfig} selectedTree={selectedTree} id={"specialChart"}/> 
            <p className="text-center px-2">
    Allgemeiner Baumzustand: <strong>{!selectedTree || selectedTree.id === 6 ? '-' : 'Gut'}</strong>
  </p>
               </div>

               
        </div>
        
          
        <div
          className="col-12 d-flex flex-column justify-content-between order-5  " 
          style={{
            backgroundColor: "white",
            borderRadius: "0px",
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: 'silver'

          }}
        >

               <div className="col-12 d-flex flex-column align-items-center justify-content-center pt-2" >
               {/* it's a "special chart" because it will be grayed out if undefined */}
            <Gauge  currentValue={currentValue} config={soilMoistureGaugeChartConfig} selectedTree={selectedTree} id={"specialChart"}/> 
            <p className="text-center px-2">
    Bodenfeuchte: <strong>{!selectedTree || selectedTree.id === 6 ? '-' : 'Gut'}</strong>
  </p>
               </div>

               
        </div>
        

        <div
          className="col-12 p-2 mb-3 order-3 mobile-only"
          style={{
            flex: "1 1 auto",

            backgroundColor: "white",
            borderRadius: "0px",
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: 'silver',
            zIndex: '0', //add this to make sure the controls of the map are underneath the dropdown elements (Dropdown is directly above the map)
          }}
        >
          <LeafletMap selectedTree={selectedTree}/>
        </div>

        <div
          className="col-12 p-2 mb-3 order-4 mobile-only "
          style={{
                          flex: "1 1 auto",
            maxHeight:"70%",
            backgroundColor: "white",
            borderRadius: "0px",
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: 'silver',
            zIndex: '0', //add this to make sure the controls of the map are underneath the dropdown elements (Dropdown is directly above the map)

            
          }}
        >
          <MapLegend />
        </div>

        
      </div>
          
      <div className="col-md-8 p-2 medium-and-larger-screens-only " >
        
        <div
          className="col-12 p-2"
          style={{
            flex: "1 1 80%",

            backgroundColor: "white",
            borderRadius: "0px",
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: 'silver'
          }}
        >
          <LeafletMap selectedTree={selectedTree}/>
        </div>
          
        <div
          className="col-12 p-2 mt-3 "
          style={{
                          flex: "1 1 20%",
            // maxHeight:"90%",
            backgroundColor: "white",
            borderRadius: "0px",
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: 'silver'
          }}
        >
          <MapLegend />
        </div>

      </div>

      
    </div>
  );
};

export default TreeInfoContainer;
