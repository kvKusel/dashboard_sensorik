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
}) => {
  const nameMapping = {
    lastValueWolfstein: "31",
    lastValueRutsweiler: "30",
    lastValueKreimbach1: "34",
    lastValueKreimbach3: "32",
    lastValueKreimbach4: "36",
    lastValueLauterecken1: "33",
    lastValueKreisverwaltung: "14",
    lastValueLohnweiler1: "42",
    lastValueHinzweiler1: "35",
    lastValueUntersulzbach: "43",
    lastValueLohnweilerRLP: "44",
  };

  const renderTooltip = (props) => (
    <Tooltip id="download-tooltip" {...props}>
      {tooltipText}
    </Tooltip>
  );

  //console.log(activeDataset);

  const handleDownload = async () => {
    if (!activeDataset) {
      alert('Kein Datensatz ausgewählt.');
      return;
    }

    const deviceId = nameMapping[activeDataset];
    if (!deviceId) {
      alert('Unbekannter Datensatz.');
      return;
    }

    try {
      // Use device ID in the API call
      const response = await axios.get(
        `${API_URL}api/export-water-level-data/?device_id=${deviceId}`,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      // Create a more readable filename
      const locationName = activeDataset.replace('lastValue', '').toLowerCase();
      a.download = `${locationName}_dataset.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Datei konnte nicht heruntergeladen werden.');
    }
  };

  return (
    <OverlayTrigger placement="bottom" overlay={renderTooltip}>
      <div style={{ cursor: 'pointer' }}>
        <FontAwesomeIcon
          icon={faDownload}
          size={size}
          style={{ color }}
          className={className}
          onClick={handleDownload}
        />
      </div>
    </OverlayTrigger>
  );
};

export default DownloadIcon;