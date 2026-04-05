import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import Navbar from './components/Navbar';
import { AuthGuard, TeacherGuard } from './components/RouteGuards';
import { ToastProvider } from './components/Toast';

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
import RevealPictureMode from './pages/RevealPictureModeOlympia';
import AdminDashboard from './pages/AdminDashboard';
import CourseManagement from './pages/CourseManagement';
import NotFound from './pages/NotFound';
import { GoogleOAuthProvider } from '@react-oauth/google';
import FullscreenGameWrapper from './components/FullscreenGameWrapper';

const gameRoutes = ['/survival', '/time-attack', '/matching', '/pvp', '/chronological', '/millionaire', '/territory-map', '/guess-character', '/reveal-picture'];

function AppContent() {
  const location = useLocation();
  const isGameRoute = gameRoutes.some(route => location.pathname === route || location.pathname.startsWith(route + '/'));

  return (
    <div className="App">
      <div
        className="app-global-bg"
        aria-hidden="true"
        style={{ backgroundImage: "url('/assets/images/background_homepage.jpg')" }}
      />
      <div className="app-global-overlay" aria-hidden="true" />
      {!isGameRoute && <Navbar />}
      <main className={`app-content${isGameRoute ? ' fullscreen-mode' : ''}`}>
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
            <Route path="/survival" element={<AuthGuard><FullscreenGameWrapper><SurvivalMode /></FullscreenGameWrapper></AuthGuard>} />
            <Route path="/time-attack" element={<AuthGuard><FullscreenGameWrapper><TimeAttackMode /></FullscreenGameWrapper></AuthGuard>} />
            <Route path="/matching" element={<AuthGuard><FullscreenGameWrapper><MatchingMode /></FullscreenGameWrapper></AuthGuard>} />
            <Route path="/pvp" element={<AuthGuard><FullscreenGameWrapper><PvPMode /></FullscreenGameWrapper></AuthGuard>} />
            <Route path="/pvp/battle" element={<AuthGuard><FullscreenGameWrapper><PvPBattle /></FullscreenGameWrapper></AuthGuard>} />
            <Route path="/territory-map" element={<AuthGuard><FullscreenGameWrapper><TerritoryMap /></FullscreenGameWrapper></AuthGuard>} />
            <Route path="/change-password" element={<AuthGuard><ChangePassword /></AuthGuard>} />
            <Route path="/courses" element={<AuthGuard><CourseManagement /></AuthGuard>} />
            <Route path="/teacher/content" element={<TeacherGuard><AdminDashboard /></TeacherGuard>} />
            <Route path="/teacher/theme4" element={<TeacherGuard><Theme4AdminManager /></TeacherGuard>} />
            <Route path="/admin" element={<TeacherGuard><Theme4AdminManager /></TeacherGuard>} />
            <Route path="/leaderboard" element={<AuthGuard><Leaderboard /></AuthGuard>} />
            <Route path="/chronological" element={<AuthGuard><FullscreenGameWrapper><ChronologicalMode /></FullscreenGameWrapper></AuthGuard>} />
            <Route path="/millionaire" element={<AuthGuard><FullscreenGameWrapper><MillionaireMode /></FullscreenGameWrapper></AuthGuard>} />
            <Route path="/guess-character" element={<AuthGuard><FullscreenGameWrapper><GuessCharacterMode /></FullscreenGameWrapper></AuthGuard>} />
            <Route path="/reveal-picture" element={<AuthGuard><FullscreenGameWrapper><RevealPictureMode /></FullscreenGameWrapper></AuthGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "943924493757-no7i1gd695lqsogvc8u90bguhkcl77pv.apps.googleusercontent.com"; 

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

