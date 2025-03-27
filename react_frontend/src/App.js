import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPageMain';

import Dashboard from './pages/DashboardContainerPage/DashboardContainerPageMain';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import ImpressumLayout from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import OrientationLock from './tools/OrientationLock';

// Register the necessary modules and adapters with Chart.js to handle timeseries data better
Chart.register(...registerables);

const App = () => {
  return (
    <OrientationLock>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/impressum" element={<ImpressumLayout />} />
          <Route path="/datenschutzbestimmungen" element={<Datenschutz />} />
        </Routes>
      </Router>
    </OrientationLock>
  );
};
export default App;
