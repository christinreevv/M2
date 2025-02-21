import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import GagarinInfo from './pages/GagarinInfo';
import MissionList from './pages/MissionList';
import EditMission from './pages/EditMission';
import AddMission from './pages/AddMission';
import SearchPage from './pages/SearchPage';
import CreateFlight from './pages/CreateFlight';
import FlightsList from './pages/FlightsList';

function App() {
  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gagarin" element={<GagarinInfo />} />
        <Route path="/missions" element={<MissionList />} />
        <Route path="/add-mission" element={<AddMission />} />
        <Route path="/edit-mission/:id" element={<EditMission />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/flights/create" element={<CreateFlight />} />
        <Route path="/flights" element={<FlightsList />} />
        {/* <Route path="/flights/create" element={<CreateFlight />} /> */}
      </Routes>
    </Router>

    </>
  );
}
export default App;
