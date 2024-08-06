import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateNavbar from './components/Navbar';
import MyJumbotron from './components/Jumbotron';
import SecondPage from './components/ProjektBeschreibung';
import MapOverview from './components/Maps';
import Ziele from './components/ProjektZiele';
import Dashboard from './components/Dashboard/Dashboard';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import ImpressumLayout from './components/Impressum';
import Datenschutz from './components/Datenschutz';
import OrientationLock from './tools/OrientationLock';

// Register the necessary modules and adapters with Chart.js to handle timeseries data better
Chart.register(...registerables);

const App = () => {
  return (
    <OrientationLock>
      <Router>
        {/* <CreateNavbar /> */}
        <Routes>
          <Route path="/" element={<MyJumbotron />} />
          <Route path="/second" element={<SecondPage />} />
          <Route path="/maps" element={<MapOverview />} />
          <Route path="/projektziele" element={<Ziele />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/impressum" element={<ImpressumLayout />} />
          <Route path="/datenschutzbestimmungen" element={<Datenschutz />} />
        </Routes>
      </Router>
    </OrientationLock>
  );
};
export default App;
