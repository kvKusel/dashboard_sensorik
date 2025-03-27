import React from 'react';
import { soilMoistureGaugeChartConfig, treeHealthConfig } from '../../chartsConfig/chartsConfig';
import Gauge from '../../components/DoughnutChart';
import DropdownButton from '../../components/DropDown';
import LeafletMap from "./LeafletMap";
import MapLegend from './MapLegend';

const TreeInfoContainer = ({ trees, selectedTree, handleTreeSelection, soilMoistureData, treeSenseGeneralHealthData, lastValuesSoilMoisture, run, setRun, steps }) => {


  // set up for the needles of the  gauge charts 
  const currentValue = soilMoistureData? soilMoistureData[soilMoistureData.length - 1].value : 0

  const healthStateRaw = treeSenseGeneralHealthData;


  const treeSenseGeneralHealth = (healthStatesRaw) => {
    return healthStatesRaw.map(healthStateRaw => {
      if (healthStateRaw === 0) {
        return 92;
      } else if (healthStateRaw === 1) {
        return 60;
      } else if (healthStateRaw === 2) {
        return 35;
      } else if (healthStateRaw === 4) {
        return 15;
      } else {
        return 0;
      }
    });
  }
  

  const healthStateNeedleValues = treeSenseGeneralHealth(healthStateRaw);




  // end of set up for the needles of the  gauge charts 


  return (
    <div className="row mt-md-2" style={{ flex: "1 1 auto" }}>
      
      <div className="col-md-3 p-2 d-flex flex-column " >
        <div>
        <div
          className="col-12 d-flex flex-column mb-3 order-1" 
          style={{
            borderRadius: "0px",
            flex: "1 1 auto",
            justifyContent: 'center',
            borderWidth:'1px',
            boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",


          }}
        >
          

              <DropdownButton trees={trees} onSelectTree={handleTreeSelection}/>
       
        </div>
          
        <div
          className="col-12 d-flex flex-column mb-3 order-2 rounded-3" 
          style={{
            backgroundColor: "white",

            borderRadius: "0px",
            flex: "0 1 10%",
            justifyContent: 'center',
            boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",


          }}
        >
      
            <div className=" text-center p-2 d-flex align-items-center lead fw-bolder" style={{ display: "flex", alignItems: "center", justifyContent: 'center'}}>
              {selectedTree  ? selectedTree.name : "Obstwiese"}
              
            </div>

            
   
        </div>
        

</div>

        <div className='order-5 col-12 d-flex tree-gauge-container-md-and-larger'
        style={{
      justifyContent: "space-between"}}
        >

        <div
          className="col-sm-6 col-md-12 d-flex   order-5 tree-gauge-child-md-and-larger rounded-3" 
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "0px",
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: '#FFFFFF',
            boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

          }}
        >




               <div className="col-12  d-flex flex-column align-items-center justify-content-center pt-5 pb-3 mb-2 rounded-3" >
               {/* it's a "special chart" because the gauge's needle will be resting at 0 if undefined */}
            <Gauge  classAsProp="gaugeChartsTrees" currentValue={healthStateNeedleValues} config={treeHealthConfig} selectedTree={selectedTree} id={"specialChartGeneral"}/> 
            <p className="d-flex flex-column align-items-center justify-content-center text-center px-2 " style={{flex: "1 1 auto", color: "#18204F"}}>
  Wasserbilanz Baum:<br />
  <strong>
  {!selectedTree || selectedTree.id === 6 || selectedTree.id === 7 ? '-' : (
  selectedTree.id === 3 || selectedTree.id === 5 ? 'Sensor nicht vorhanden' : (
    selectedTree.id === 4 && healthStateRaw[0] === 0 ? 'Kein Trockenstress' : (
      selectedTree.id === 4 && healthStateRaw[0] === 1 ? 'Leichter Trockenstress' : (
        selectedTree.id === 4 && healthStateRaw[0] === 2 ? 'Trockenstress' : (
          selectedTree.id === 4 && healthStateRaw[0] === 3 || !healthStateRaw ? 'Keine Daten' : (
            selectedTree.id === 1 && healthStateRaw[1] === 0 ? 'Kein Trockenstress' : (
              selectedTree.id === 1 && healthStateRaw[1] === 1 ? 'Leichter Trockenstress' : (
                selectedTree.id === 1 && healthStateRaw[1] === 2 ? 'Trockenstress' : (
                  selectedTree.id === 1 && healthStateRaw[1] === 3 || !healthStateRaw ? 'Keine Daten' : (
                    selectedTree.id === 2 && healthStateRaw[2] === 0 ? 'Kein Trockenstress' : (
                      selectedTree.id === 2 && healthStateRaw[2] === 1 ? 'Leichter Trockenstress' : (
                        selectedTree.id === 2 && healthStateRaw[2] === 2 ? 'Trockenstress' : (
                          selectedTree.id === 2 && healthStateRaw[2] === 3 || !healthStateRaw ? 'Keine Daten' : 'Frost'
                        )
                      )
                    )
                  )
                )
              )
            )
          )
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
          className="col-sm-6 col-md-12 d-flex  order-5 tree-gauge-child-md-and-larger rounded-3 " 
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "0px",
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: '#FFFFFF',
            boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",


          }}
        >

               <div className="col-12 d-flex flex-column align-items-center justify-content-center pt-5 pb-3" >
               {/* it's a "special chart" because it will be grayed out if undefined */}
               
            <Gauge classAsProp="gaugeChartsTrees" currentValue={currentValue} config={soilMoistureGaugeChartConfig} selectedTree={selectedTree} id={"specialChartSoilMoisture"} /> 
            <p className="d-flex flex-column align-items-center justify-content-center text-center px-2" style={{flex: "1 1 auto", color: "#18204F"}}>
  Bodenfeuchte:<br />
  <strong>
    {!selectedTree || selectedTree.id === 6 || selectedTree.id === 7 ? '-' : (
      !currentValue ? 'Keine Daten' : (
        currentValue < 10 ? 'trocken' : (
          currentValue < 20 ? 'mäßig feucht' : 'feucht'
        )
      )
    )}
  </strong>
</p>
               </div>

               
        </div>

        </div>
        

        <div
          className="col-12 p-2 mb-3 order-3 mobile-only second-step rounded-3"
          style={{
            flex: "1 1 auto",

            backgroundColor: "#FFFFFF",
            boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

            borderRadius: "0px",
            borderStyle: '#FFFFFF',
            borderWidth:'1px',
            borderColor: '#5D7280',
            zIndex: '0', //add this to make sure the controls of the map are underneath the dropdown elements (Dropdown is directly above the map)
          }}
        >
                    {/* {soilMoistureData && ( */}

          <LeafletMap selectedTree={selectedTree} currentValueSoilMoisture={lastValuesSoilMoisture} treeSenseHealth={healthStateRaw}/>
        </div>

        <div
          className="col-12 p-2 mb-3 order-4 mobile-only rounded-3 "
          style={{
                          flex: "1 1 auto",
            maxHeight:"70%",
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

            borderRadius: "0px",
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: '#FFFFFF',
            zIndex: '0', //add this to make sure the controls of the map are underneath the dropdown elements (Dropdown is directly above the map)

            
          }}
        >
          <MapLegend />
        </div>

        
      </div>
          
      <div className="col-md-9 p-2 medium-and-larger-screens-only rounded-3" >
        
        <div
          className="col-12 p-2 third-step rounded-3"
          style={{
            flex: "1 1 80%",

            backgroundColor: "#FFFFFF",
            boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

            borderRadius: "0px",
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: '#FFFFFF'
          }}
        >
          <LeafletMap selectedTree={selectedTree} currentValueSoilMoisture={lastValuesSoilMoisture} treeSenseHealth={healthStateRaw}/>
        </div>
          
        <div
          className="col-12 p-2 mt-3 rounded-3 "
          style={{
                          flex: "1 1 20%",
            // maxHeight:"90%",
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 4px 24px 0px rgba(40, 53, 131, 0.10)",

            borderRadius: "0px",
            borderStyle: 'solid',
            borderWidth:'1px',
            borderColor: '#FFFFFF'
          }}
        >
          <MapLegend />
        </div>

      </div>


    </div>
    
  );
};

export default TreeInfoContainer;
