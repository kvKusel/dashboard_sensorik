import React, { useState } from 'react';
import LeafletMap from "./LeafletMap";
import Gauge from "./DoughnutChart";
import DropdownButton from './DropDown';
import { treeHealthConfig, soilMoistureGaugeChartConfig } from '../../../chartsConfig/chartsConfig';
import MapLegend from './MapLegend';

const TreeInfoContainer = ({ trees, selectedTree, handleTreeSelection, soilMoistureData, treeSenseGeneralHealthData, lastValuesSoilMoisture }) => {


  // set up for the needles of the  gauge charts 
  const currentValue = soilMoistureData? soilMoistureData[soilMoistureData.length - 1].value : 0

  const healthStateRaw = treeSenseGeneralHealthData[0].health_state;


  const treeSenseCoxOrangenrenetteHealth = (healthStateRaw) => {
    if (healthStateRaw === 0) {
      return 92
    }
    // make sure that there is no error if there are serverside problems (so no data)
    else {
      return 0
    }
  }

  const healthState = treeSenseCoxOrangenrenetteHealth(healthStateRaw);


  // end of set up for the needles of the  gauge charts 


  return (
    <div className="row" style={{ flex: "1 1 auto" }}>
      
      <div className="col-md-4 p-2 d-flex flex-column " >
        <div>
        <div
          className="col-12 d-flex flex-column mb-3 order-1" 
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
          className="col-12 d-flex flex-column mb-3 order-2" 
          style={{
            backgroundColor: "white",

            borderRadius: "0px",
            flex: "0 1 10%",
            justifyContent: 'center',
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: 'silver'

          }}
        >
      
            <div className=" text-center p-2 d-flex align-items-center lead fw-bold" style={{ display: "flex", alignItems: "center", justifyContent: 'center'}}>
              {selectedTree && selectedTree.id !== 6 ? selectedTree.name : "Projektareal"}
              
            </div>

            
   
        </div>
        

</div>

        <div className='order-5 col-12 d-flex tree-gauge-container-md-and-larger'
        style={{
      justifyContent: "space-between"}}
        >

        <div
          className="col-sm-6 col-md-12 d-flex   order-5 tree-gauge-child-md-and-larger" 
          style={{
            backgroundColor: "white",
            borderRadius: "0px",
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: 'silver',
          }}
        >




               <div className="col-12  d-flex flex-column align-items-center justify-content-center pt-3 pt-md-5 pb-md-4  pb-xl-0 pt-xl-1  " >
               {/* it's a "special chart" because the gauge's needle will be resting at 0 if undefined */}
            <Gauge  classAsProp="gaugeChartsTrees" currentValue={healthState} config={treeHealthConfig} selectedTree={selectedTree} id={"specialChartGeneral"}/> 
            <p className="d-flex flex-column align-items-center justify-content-center text-center px-2" style={{flex: "1 1 auto"}}>
  Allgemeiner Baumzustand:<br />
  <strong>
    {!selectedTree || selectedTree.id === 6 || selectedTree.id === 7 ? '-' : (
      selectedTree.id === 3 || selectedTree.id === 5 ? 'Sensor nicht vorhanden' : (
        healthStateRaw === 0 ? 'Kein Trockenstress' : (
          healthStateRaw === 1 ? 'Leichter Trockenstress' : (
            healthStateRaw === 2 ? 'Trockenstress' : (
              healthStateRaw === 3 || !healthStateRaw ? 'Keine Daten' : 'Frost'
            )
          )
        )
      )
    )}
  </strong>
</p>

               </div>

               
        </div>
        
          
        <div
          className="col-sm-6 col-md-12 d-flex  order-5  tree-gauge-child-md-and-larger" 
          style={{
            backgroundColor: "white",
            borderRadius: "0px",
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: 'silver',


          }}
        >

               <div className="col-12 d-flex flex-column align-items-center justify-content-center pt-3 pt-md-5 pb-md-4 pb-xl-0 pt-xl-1 mt-xl-2" >
               {/* it's a "special chart" because it will be grayed out if undefined */}
               
            <Gauge classAsProp="gaugeChartsTrees" currentValue={currentValue} config={soilMoistureGaugeChartConfig} selectedTree={selectedTree} id={"specialChartSoilMoisture"} /> 
            <p className="d-flex flex-column align-items-center justify-content-center text-center px-2" style={{flex: "1 1 auto"}}>
  Bodenfeuchte:<br />
  <strong>
    {!selectedTree || selectedTree.id === 6 || selectedTree.id === 7 ? '-' : (
      !currentValue ? 'Keine Daten' : (
        currentValue < 10 ? 'trocken' : (
          currentValue < 20 ? 'mäßig' : 'feucht'
        )
      )
    )}
  </strong>
</p>
               </div>

               
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
                    {/* {soilMoistureData && ( */}

          <LeafletMap selectedTree={selectedTree} currentValueSoilMoisture={lastValuesSoilMoisture} treeSenseHealth={healthStateRaw}/>
                    
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
          className="col-12 p-2 "
          style={{
            flex: "1 1 80%",

            backgroundColor: "white",
            borderRadius: "0px",
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: 'silver'
          }}
        >
          <LeafletMap selectedTree={selectedTree} currentValueSoilMoisture={lastValuesSoilMoisture} treeSenseHealth={healthStateRaw}/>
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
