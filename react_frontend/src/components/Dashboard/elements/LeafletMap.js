import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import ReactDOMServer from 'react-dom/server';
import MapLegend from './MapLegend';
import { ReactComponent as GreenTreeImage } from "../../../assets/green_tree.svg";
import { ReactComponent as YellowTreeImage } from "../../../assets/yellow_tree.svg";

const LeafletMap = ({ selectedTree }) => {


  const [mapCenter, setMapCenter] = useState([49.55660,7.35830]);
  const [mapZoom, setMapZoom] = useState(16);

  const geojsonDataBurgLichtenberg = {
    "type": "FeatureCollection",
    "name": "burg",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
      {
        "type": "Feature",
        "properties": { "id": null },
        "geometry": {
          "type": "MultiPolygon",
          "coordinates": [
            [ [ [ 7.357670094954278, 49.55642917378281 ], [ 7.357675798826545, 49.556414637692164 ], [ 7.357667243018152, 49.556388208425339 ], [ 7.357649316562481, 49.556367329294424 ], [ 7.357624871395652, 49.556356493286259 ], [ 7.357709207221211, 49.556156687436442 ], [ 7.357730800451909, 49.556177038069642 ], [ 7.357827358860884, 49.556127879382736 ], [ 7.357775209171652, 49.556081627884794 ], [ 7.357773579493863, 49.556055198437754 ], [ 7.357874619516758, 49.555945251784529 ], [ 7.357802913694059, 49.555900850181338 ], [ 7.357518534919945, 49.555797774875415 ], [ 7.35748227458915, 49.555787070888918 ], [ 7.357461088777898, 49.55577967060055 ], [ 7.357443162322217, 49.555772402459048 ], [ 7.357428902641568, 49.555758923357502 ], [ 7.35740282779695, 49.555757866172911 ], [ 7.357386531019064, 49.555762094911145 ], [ 7.357388160696852, 49.555744122771131 ], [ 7.357303417451845, 49.555699720985068 ], [ 7.357275712929439, 49.555718750326889 ], [ 7.356923702527097, 49.555591887908022 ], [ 7.356573321802546, 49.555531628143633 ], [ 7.356592877936009, 49.555507312779042 ], [ 7.356299535934057, 49.555458682013551 ], [ 7.356291387545116, 49.555471368304872 ], [ 7.356245756567033, 49.555461853586678 ], [ 7.356229459789148, 49.555478768639944 ], [ 7.356180569455489, 49.55547348268643 ], [ 7.356165902355393, 49.555519999057729 ], [ 7.356151235255295, 49.555514713108664 ], [ 7.35478067623507, 49.555175353982186 ], [ 7.35433414452099, 49.555073862944248 ], [ 7.354119027052891, 49.555030517749202 ], [ 7.353677384372177, 49.554981886508948 ], [ 7.352922843556049, 49.55490153913636 ], [ 7.352820173855365, 49.555117208100832 ], [ 7.35321455588021, 49.55520706988829 ], [ 7.353486712070907, 49.555257815295214 ], [ 7.354360219365606, 49.555411108391766 ], [ 7.35485890076892, 49.555572858516761 ], [ 7.355212540849051, 49.555770552386505 ], [ 7.35547899316749, 49.555879442251083 ], [ 7.355450473806189, 49.555909571927998 ], [ 7.355910857781472, 49.556079249235147 ], [ 7.355952414565085, 49.556100524930706 ], [ 7.355934080689962, 49.556115325409081 ], [ 7.355931228753832, 49.556137526118228 ], [ 7.355938154884434, 49.556152326585391 ], [ 7.355951599726191, 49.55616527699047 ], [ 7.355973192956888, 49.556172148632591 ], [ 7.356003749415425, 49.556177170216607 ], [ 7.356033083615618, 49.556174395130739 ], [ 7.35605589910466, 49.556159198229331 ], [ 7.356066492010286, 49.556147040704779 ], [ 7.35606567717139, 49.556138451147525 ], [ 7.356099900404949, 49.556145851381515 ], [ 7.356166717194283, 49.556143737029068 ], [ 7.356466577907389, 49.556224082358092 ], [ 7.356691473442218, 49.556355700407508 ], [ 7.356677621181015, 49.556363629194337 ], [ 7.356686584408853, 49.556401687353194 ], [ 7.356732215386933, 49.556422830761981 ], [ 7.35677866120391, 49.556419130666093 ], [ 7.356799032176268, 49.556403273109176 ], [ 7.356912294782577, 49.556395872914173 ], [ 7.357199932912263, 49.556308127659484 ], [ 7.35740527231363, 49.556397987255707 ], [ 7.357398753602475, 49.556410673303034 ], [ 7.357426458124881, 49.556424416517252 ], [ 7.357489200719744, 49.556454017273204 ], [ 7.357524238792198, 49.556469874813658 ], [ 7.35756824009249, 49.556476217828383 ], [ 7.357610611714995, 49.556473046321123 ], [ 7.357646464626345, 49.556457717366435 ], [ 7.357670094954278, 49.55642917378281 ] ] ] ]
        }
      }
    ]
  };

  const geojsonDataStreuobstwiese = {
    "type": "FeatureCollection",
    "name": "burg",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [
      {
        "type": "Feature",
        "properties": { "id": null },
        "geometry": {
          "type": "MultiPolygon",
          "coordinates": [
            [ [ [ 7.360572958515263, 49.557130204655842 ], [ 7.360579477226415, 49.557235920031196 ], [ 7.360592514648726, 49.557307806355709 ], [ 7.360631626915652, 49.557413521346611 ], [ 7.360700073382773, 49.557489635998351 ], [ 7.360775038561052, 49.55755940765826 ], [ 7.360850003739326, 49.557631293506596 ], [ 7.360960821828953, 49.557732779230022 ], [ 7.361087936696463, 49.557840607580069 ], [ 7.361231348341862, 49.557931521494126 ], [ 7.361394316120724, 49.558022435238946 ], [ 7.361567061966316, 49.558119691615794 ], [ 7.361700695544983, 49.558161976936603 ], [ 7.361837588479227, 49.55820003369405 ], [ 7.36191581301308, 49.558208490747226 ], [ 7.362052705947325, 49.558216947798947 ], [ 7.362173302103682, 49.558197919430533 ], [ 7.362258045348691, 49.558157748406188 ], [ 7.362293898260038, 49.558104891744847 ], [ 7.362310195037926, 49.558045692216247 ], [ 7.362310195037926, 49.557973806977891 ], [ 7.362241748570802, 49.557904035910056 ], [ 7.362173302103682, 49.55784483613796 ], [ 7.362065743369633, 49.557768722039825 ], [ 7.361919072368658, 49.557679922108726 ], [ 7.361818032345765, 49.557618607776341 ], [ 7.361677880055943, 49.557544607617508 ], [ 7.361547505832854, 49.557479064526042 ], [ 7.36141061289861, 49.557405064155766 ], [ 7.361254163830904, 49.557343749478285 ], [ 7.361028453457182, 49.55725587378263 ], [ 7.36085244825601, 49.557209887641264 ], [ 7.360732666938548, 49.557177115881913 ], [ 7.360661775954743, 49.557154915645341 ], [ 7.36060636690993, 49.557138001172603 ], [ 7.360572958515263, 49.557130204655842 ] ] ]]        }
      }
    ]
  };

  const polygonStyleBurgLichtenberg = {
    fillColor: 'red',
    weight: 2,
    opacity: 1,
    color: 'red',
    fillOpacity: 0.3,
  };

  const polygonStyleStreuobstwiese = {
    fillColor: 'blue',
    weight: 2,
    opacity: 1,
    color: 'blue',
    fillOpacity: 0.2,
  };


  const tileLayerUrl =
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const markerPosition = [49.55765051953722, 7.361306116493143];

  const ChosenTreeIcon = new L.divIcon({
    className: 'custom-icon',
    html: ReactDOMServer.renderToString(<YellowTreeImage />),
    iconSize: [40, 40] 

  });

  const TreeWithSensorIcon = new L.divIcon({
    className: 'custom-icon',
    html: ReactDOMServer.renderToString(<GreenTreeImage />),
    iconSize: [40, 40] 

  });

  useEffect(() => {
    if (selectedTree) {
      if (selectedTree.id === 6) {
        setMapCenter([49.55660, 7.35830]);
        setMapZoom(16);
      } else {
        setMapCenter([49.55771,7.36140]);
        setMapZoom(18);
      }
    }
  }, [selectedTree]);
  
  

  return (
    <MapContainer   key={`${mapCenter.toString()}-${mapZoom}`}
     center={mapCenter} zoom={mapZoom} scrollWheelZoom={false} className='' style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <TileLayer
        className='map-tiles'
        attribution='Map data: &copy; <a href="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">dl-de/by-2-0</a>'
        url={tileLayerUrl}

      />
            <GeoJSON data={geojsonDataBurgLichtenberg} style={polygonStyleBurgLichtenberg} />

            <GeoJSON data={geojsonDataStreuobstwiese} style={polygonStyleStreuobstwiese} />


      {selectedTree && selectedTree.id !== 6 && ( // Conditionally render the Marker when a tree is selected - use later to highlight the selected tree by changing the icon background
      <>

                  {/* render all 15 trees on the Streuobstwiese */}
                  <Marker position={[49.55740,7.36071]} icon={TreeWithSensorIcon}>
                  <Popup>
                    A sample popup. <br /> This can contain any HTML.
                  </Popup>
                </Marker>

                  <Marker position={[49.55759,7.36093]} icon={TreeWithSensorIcon}>
                  <Popup>
                    A sample popup. <br /> This can contain any HTML.
                  </Popup>
                </Marker>

                <Marker position={[49.55775,7.36120]} icon={TreeWithSensorIcon}>
                  <Popup>
                    A sample popup. <br /> This can contain any HTML.
                  </Popup>
                </Marker>

                <Marker position={[49.55794,7.36147]} icon={TreeWithSensorIcon}>
                  <Popup>
                    A sample popup. <br /> This can contain any HTML.
                  </Popup>
                </Marker>

                <Marker position={[49.55811,7.36188]} icon={TreeWithSensorIcon}>
                  <Popup>
                    A sample popup. <br /> This can contain any HTML.
                  </Popup>
                </Marker>

                            {/* renders the highlighted tree */}

                            <Marker position={[selectedTree.latitude, selectedTree.longitude]} icon={ChosenTreeIcon}>
          <Popup>
            A sample popup. <br /> This can contain any HTML.
          </Popup>
        </Marker>

                
                </>
      )}
      {selectedTree && selectedTree.id === 6 && (
  // If the "zurück zur Übersicht" option is selected, don't render any markers
  null
)}
    </MapContainer>
  );
};

export default LeafletMap;
