import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import ModeSelection from './pages/ModeSelection';
import Timeline from './pages/Timeline';
import GamePlay from './pages/GamePlay';
import StudyDetail from './pages/StudyDetail';
import SurvivalMode from './pages/SurvivalMode';
import TimeAttackMode from './pages/TimeAttackMode';
import MatchingMode from './pages/MatchingMode';
import PvPMode from './pages/PvPMode';
import PvPBattle from './pages/PvPBattle';
import ChangePassword from './pages/ChangePassword';
import TerritoryMap from './pages/TerritoryMap';
import AdminDashboard from './pages/AdminDashboard';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/modes" element={<ModeSelection />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/study/:lessonId" element={<StudyDetail />} />
          <Route path="/play/:lessonId" element={<GamePlay />} />
          <Route path="/survival" element={<SurvivalMode />} />
          <Route path="/time-attack" element={<TimeAttackMode />} />
          <Route path="/matching" element={<MatchingMode />} />
          <Route path="/pvp" element={<PvPMode />} />
          <Route path="/pvp/battle" element={<PvPBattle />} />
          <Route path="/territory-map" element={<TerritoryMap />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
