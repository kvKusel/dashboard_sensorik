// components/Dashboard/elements/ChartMenu.js
import React, { useState } from "react";
import { Box, Tab, Tabs, Divider } from '@mui/material';


const ChartMenu = ({ activeTab, onTabChange }) => {
  return (
    <Box sx={{ width: '100%'}}>
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => onTabChange(newValue)}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs example"
      >
        <Tab
          label="Baummonitoring"
          value="Baummonitoring"
          sx={{ borderBottom: activeTab === 'Baummonitoring' && '2px solid #1976D2', color: 'white' }}
        />
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Tab
          label="Wetter"
          value="Wetter"
          sx={{ borderBottom: activeTab === 'Wetter' && '2px solid #1976D2', color: 'white' }}
        />
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Tab
          label="Webcam Potzberg"
          value="Webcam Potzberg"
          sx={{ borderBottom: activeTab === 'Webcam Potzberg' && '2px solid #1976D2', color: 'white' }}
        />
      </Tabs>
    </Box>
  );
};


export default ChartMenu;
