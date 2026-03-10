// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import Timeline from './pages/Timeline';
import GamePlay from './pages/GamePlay';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <Router>
      <div className="history-bg">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/play/:lessonId" element={<GamePlay />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;