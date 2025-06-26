// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Components/Home';
import StateDetails from './Components/StateDetails';
import ViewMap from './Components/Map';
import MatchingGame from './Components/MatchingGame';
import SpellCheck from './Components/SpellCheck';
import Quiz from './Components/Quiz';
import Dive from './Components/Dive';
import PuzzlePage from './Components/Puzzle';

function App() {
  return (
    <Router>
      <header>
        <nav>
          <Link to="/" className="nav-link">🏠 Home</Link>
        </nav>
        <h1>🇮🇳 WELCOME TO INDIA</h1>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/states/:id" element={<StateDetails />} />
        <Route path="/map" element={<ViewMap />} />
        <Route path="/matching" element={<MatchingGame />} />
        <Route path="/spell" element={<SpellCheck />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/dive" element={<Dive />} />
        <Route path="/puzzle" element={<PuzzlePage />} />
      </Routes>
    </Router>
  );
}

export default App;
