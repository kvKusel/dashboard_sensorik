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

// Register the necessary modules and adapters with Chart.js to handle timeseries data better
Chart.register(...registerables);

const App = () => {
    return (
      <Router>
        {/* <CreateNavbar /> */}
        <Routes>
          <Route path="/" element={<MyJumbotron />} />
          <Route path="/second" element={<SecondPage />} />
          <Route path="/maps" element={<MapOverview />} />
          <Route path="/projektziele" element={<Ziele />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    );
  };

export default App;
