import React, { useState } from 'react';
import IndiaMap from './India';
import useStateData from '../Hooks/useStateData';
import '../Css/Map.css';

export default function ElderHome() {
  const { stateData, selectedState, setSelectedState } = useStateData();
  const [hoveredState, setHoveredState] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [tryMode, setTryMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [usedHints, setUsedHints] = useState([]);
  const [revealedHints, setRevealedHints] = useState([]);

  const fields = ['name', 'capital', 'population', 'language', 'area', 'established'];

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = Object.keys(stateData).filter((key) =>
      stateData[key].name.toLowerCase().startsWith(value)
    );
    setSuggestions(filtered);
  };

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      setSelectedState(suggestions[0]);
      setSuggestions([]);
      setSearchTerm('');
      resetTry();
    }
  };

  const resetTry = () => {
    setTryMode(false);
    setUserAnswers({});
    setResult(null);
    setUsedHints([]);
    setRevealedHints([]);
  };

  const handlePlayAgain = () => {
    const cleared = {};
    fields.forEach((field) => (cleared[field] = ''));
    setUserAnswers(cleared);
    setResult(null);
    setUsedHints([]);
    setRevealedHints([]);
  };

  const stateInfo = hoveredState
    ? stateData[hoveredState]
    : selectedState
    ? stateData[selectedState]
    : null;

  const handleAnswerChange = (e) => {
    setUserAnswers({ ...userAnswers, [e.target.name]: e.target.value });
  };

  const handleCheckAnswers = () => {
    if (!stateInfo) return;

    let totalCorrect = 0;
    const correct = {};

    fields.forEach((field) => {
      const expected = String(stateInfo[field]).toLowerCase().trim();
      const given = String(userAnswers[field] || '').toLowerCase().trim();
      if (expected === given) {
        correct[field] = true;
        totalCorrect++;
      } else {
        correct[field] = false;
      }
    });

    const hintPenalty = usedHints.length * 0.5;
    const finalScore = totalCorrect - hintPenalty;

    setResult({ totalCorrect: finalScore, correct, allCorrect: totalCorrect === fields.length });
  };

  const handleHint = () => {
    if (!stateInfo || result || revealedHints.length >= 3) return;

    const unanswered = fields.filter(
      (field) =>
        !(userAnswers[field] || '').trim() &&
        !revealedHints.some((h) => h.field === field)
    );

    if (unanswered.length === 0) return;

    const randomField = unanswered[Math.floor(Math.random() * unanswered.length)];

    setRevealedHints((prev) => [...prev, { field: randomField, value: stateInfo[randomField] }]);
    setUsedHints((prev) => [...prev, randomField]);
  };

  return (
    <div className="container">
      <div id="map-container">
        <div id="map">
          <IndiaMap
            onHover={setHoveredState}
            onClick={setSelectedState}
            selectedState={selectedState}
            hoveredState={hoveredState}
          />
        </div>

        <div id="sidebar">
          {/* Hide search bar when Try Mode is active */}
          {!tryMode && (
            <div id="search-container">
              <input
                type="text"
                placeholder="Search for a state..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleSearchEnter}
                id="state-search"
              />
              {suggestions.length > 0 && (
                <ul id="search-results">
                  {suggestions.map((state, index) => (
                    <li
                      key={index}
                      className="search-result-item"
                      onClick={() => {
                        setSelectedState(state);
                        setSuggestions([]);
                        resetTry();
                      }}
                    >
                      {stateData[state].name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {stateInfo ? (
            <>
              <div className="state-header">
                {!tryMode && <h2>{stateInfo.name}</h2>}
                <div className="try-controls">
                  <button className="try-button" onClick={() => setTryMode(!tryMode)}>
                    {tryMode ? 'Show State Data' : 'Try Yourself!'}
                  </button>
                  {tryMode && (
                    <button
                      className="hint-icon"
                      onClick={handleHint}
                      title="Hint"
                      disabled={!!result || revealedHints.length >= 3}
                    >
                      Use Hint:💡
                    </button>
                  )}
                </div>
              </div>

              {tryMode ? (
                <>
                  {revealedHints.length > 0 && (
                    <div className="hint-display">
                      {revealedHints.map((hint, idx) => (
                        <p key={idx}>
                          💡 Hint for {hint.field.charAt(0).toUpperCase() + hint.field.slice(1)}:{' '}
                          <strong>{hint.value}</strong>
                        </p>
                      ))}
                      {revealedHints.length >= 3 && (
                        <p className="all-used-msg">All hints used. Check state data!</p>
                      )}
                    </div>
                  )}

                  {fields.map((field, index) => {
                    const isCorrect = result?.correct?.[field];
                    const isSubmitted = result !== null;
                    return (
                      <div key={index} className="input-row">
                        <label>
                          <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                          <input
                            name={field}
                            value={userAnswers[field] || ''}
                            onChange={handleAnswerChange}
                            placeholder={`Enter ${field}`}
                            readOnly={isSubmitted}
                            className={
                              isSubmitted
                                ? isCorrect
                                  ? 'input-correct'
                                  : 'input-wrong'
                                : ''
                            }
                          />
                        </label>
                        {isSubmitted && !isCorrect && (
                          <div className="expected-text">
                            Expected: <strong>{stateInfo[field]}</strong>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {!result && (
                    <button onClick={handleCheckAnswers} className="submit-button">
                      Submit
                    </button>
                  )}

                  {result && (
                    <div className="result-container">
                      <p>
                        <strong>Score:</strong> {Math.max(0, result.totalCorrect)} / 6
                      </p>
                      {result.totalCorrect < fields.length && (
                        <button onClick={handlePlayAgain} className="play-again-button">
                          Play Again
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p><strong>Capital:</strong> {stateInfo.capital}</p>
                  <p><strong>Population:</strong> {stateInfo.population}</p>
                  <p><strong>Language:</strong> {stateInfo.language}</p>
                  <p><strong>Area:</strong> {stateInfo.area}</p>
                  <p><strong>Established:</strong> {stateInfo.established}</p>
                  <p><strong>About:</strong> {stateInfo.about}</p>
                  <a href={`/states/${stateInfo.id}`} className="more-link">
                    More about this state →
                  </a>
                </>
              )}
            </>
          ) : (
            <p>Hover over a state or search for one.</p>
          )}
        </div>
      </div>
    </div>
  );
}
