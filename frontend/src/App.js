import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import Navbar from './components/Navbar';
import { AuthGuard, AdminGuard } from './components/RouteGuards';

import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ModeSelection from './pages/ModeSelection';
import ModeGuidePage from './pages/ModeGuidePage';
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
import Theme4AdminManager from './pages/Theme4AdminManager';
import Leaderboard from './pages/Leaderboard';
import ChronologicalMode from './pages/ChronologicalMode';
import MillionaireMode from './pages/MillionaireMode';
import GuessCharacterMode from './pages/GuessCharacterMode';
import RevealPictureMode from './pages/RevealPictureMode';
import NotFound from './pages/NotFound';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Thành phần chứa các Route để có thể sử dụng useLocation()
function AppContent() {
  const location = useLocation();

  return (
    <div className="App">
      <Navbar />
      <main className="app-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<AuthGuard><HomePage /></AuthGuard>} />
            <Route path="/modes" element={<AuthGuard><ModeSelection /></AuthGuard>} />
            <Route path="/modes/:modeId/guide" element={<AuthGuard><ModeGuidePage /></AuthGuard>} />
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
            <Route path="/admin" element={<AdminGuard><Theme4AdminManager /></AdminGuard>} />
            <Route path="/leaderboard" element={<AuthGuard><Leaderboard /></AuthGuard>} />
            <Route path="/chronological" element={<AuthGuard><ChronologicalMode /></AuthGuard>} />
            <Route path="/millionaire" element={<AuthGuard><MillionaireMode /></AuthGuard>} />
            <Route path="/guess-character" element={<AuthGuard><GuessCharacterMode /></AuthGuard>} />
            <Route path="/reveal-picture" element={<AuthGuard><RevealPictureMode /></AuthGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  const GOOGLE_CLIENT_ID = "943924493757-no7i1gd695lqsogvc8u90bguhkcl77pv.apps.googleusercontent.com"; 

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AppContent />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
