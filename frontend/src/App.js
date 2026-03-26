import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { AuthGuard, AdminGuard } from './components/RouteGuards';

import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
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
import ChronologicalMode from './pages/ChronologicalMode';
import MillionaireMode from './pages/MillionaireMode';
import GuessCharacterMode from './pages/GuessCharacterMode';
import RevealPictureMode from './pages/RevealPictureMode';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  // THAY THẾ CHUỖI DƯỚI ĐÂY BẰNG CLIENT ID CỦA BẠN TỪ GOOGLE CLOUD CONSOLE
  const GOOGLE_CLIENT_ID = "943924493757-no7i1gd695lqsogvc8u90bguhkcl77pv.apps.googleusercontent.com"; 

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div className="App">
          <Navbar />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/modes" element={<AuthGuard><ModeSelection /></AuthGuard>} />
              <Route path="/timeline" element={<AuthGuard><Timeline /></AuthGuard>} />
              <Route path="/study/:lessonId" element={<AuthGuard><StudyDetail /></AuthGuard>} />
              <Route path="/play/:lessonId" element={<AuthGuard><GamePlay /></AuthGuard>} />
              <Route path="/survival" element={<AuthGuard><SurvivalMode /></AuthGuard>} />
              <Route path="/time-attack" element={<AuthGuard><TimeAttackMode /></AuthGuard>} />
              <Route path="/matching" element={<AuthGuard><MatchingMode /></AuthGuard>} />
              <Route path="/pvp" element={<AuthGuard><PvPMode /></AuthGuard>} />
              <Route path="/pvp/battle" element={<AuthGuard><PvPBattle /></AuthGuard>} />
              <Route path="/territory-map" element={<AuthGuard><TerritoryMap /></AuthGuard>} />
              <Route path="/change-password" element={<AuthGuard><ChangePassword /></AuthGuard>} />
              <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/leaderboard" element={<AuthGuard><Leaderboard /></AuthGuard>} />
              <Route path="/chronological" element={<AuthGuard><ChronologicalMode /></AuthGuard>} />
              <Route path="/millionaire" element={<AuthGuard><MillionaireMode /></AuthGuard>} />
              <Route path="/guess-character" element={<AuthGuard><GuessCharacterMode /></AuthGuard>} />
              <Route path="/reveal-picture" element={<AuthGuard><RevealPictureMode /></AuthGuard>} />
            </Routes>
          </main>        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
