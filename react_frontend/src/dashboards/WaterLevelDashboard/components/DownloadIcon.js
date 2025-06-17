import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL.endsWith('/')
  ? process.env.REACT_APP_API_URL
  : `${process.env.REACT_APP_API_URL}/`;

const DownloadIcon = ({
  activeDataset,
  size = '2x',
  color = '#6972A8',
  className = '',
  tooltipText = 'Datensatz herunterladen',
  isPrecipitationDownload = false,
  precipitationActiveDataset = 'lohnweiler',
}) => {
  const deviceIdMapping = {
    lastValueWolfstein: "31",
    lastValueRutsweiler: "30",
    lastValueKreimbach1: "34",
    lastValueKreimbach3: "32",
    lastValueKreimbach4: "29",
    lastValueLauterecken1: "33",
    lastValueKreisverwaltung: "14",
    lastValueLohnweiler1: "42",
    lastValueHinzweiler1: "35",
    lastValueUntersulzbach: "43",
    lastValueLohnweilerRLP: "44",
  };

  const nameMapping = {
    lastValueWolfstein: "Wolfstein",
    lastValueRutsweiler: "Rutsweiler",
    lastValueKreimbach1: "Kreimbach_1",
    lastValueKreimbach3: "Kreimbach_2",
    lastValueKreimbach4: "Kreimbach_3",
    lastValueLauterecken1: "Lauterecken",
    lastValueKreisverwaltung: "Kusel",
    lastValueLohnweiler1: "Lohnweiler_Mausbach",
    lastValueHinzweiler1: "Hinzweiler",
    lastValueUntersulzbach: "Untersulzbach",
    lastValueLohnweilerRLP: "Lauterecken_Lauter",
  };

  const precipitationNameMapping = {
    lohnweiler: "Lohnweiler",
    wolfstein: "Wolfstein",
  };

  const isDatasetSelected = isPrecipitationDownload || (activeDataset && deviceIdMapping[activeDataset]);
  const iconColor = isDatasetSelected ? color : '#ccc';
  const currentTooltipText = isDatasetSelected ? tooltipText : 'Wählen Sie einen Datensatz zum Herunterladen aus';

  const renderTooltip = (props) => (
    <Tooltip id="download-tooltip" {...props}>
      {currentTooltipText}
    </Tooltip>
  );

  const handleDownload = async () => {
    if (!isDatasetSelected) return;

    try {
      let downloadUrl = '';
      let filename = '';

      if (isPrecipitationDownload) {
          downloadUrl = `${API_URL}api/export-precipitation-data/?dataset=${precipitationActiveDataset}`;
  
        filename = `${precipitationNameMapping[precipitationActiveDataset]}_Niederschlagsdaten.csv`;
      } 
      
      else {
        const deviceId = deviceIdMapping[activeDataset];
        downloadUrl = `${API_URL}api/export-water-level-data/?device_id=${deviceId}`;
        filename = `${nameMapping[activeDataset]}_Pegelstaende.csv`;
      }

      const response = await axios.get(downloadUrl, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadLink = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadLink;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadLink);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Datei konnte nicht heruntergeladen werden.');
    }
  };

  return (
    <OverlayTrigger placement="bottom" overlay={renderTooltip}>
      <div style={{ cursor: isDatasetSelected ? 'pointer' : 'not-allowed' }}>
        <FontAwesomeIcon
          icon={faDownload}
          size={size}
          style={{ color: iconColor }}
          className={className}
          onClick={handleDownload}
        />
      </div>
    </OverlayTrigger>
  );
};

export default DownloadIcon;