import React, { useState } from 'react';
import IndiaMap from './India';
import useStateData from '../Hooks/useStateData';
import useFoodData from '../Hooks/useFoodData';
import usePlaceData from '../Hooks/usePlaceData';
import useFestivalData from '../Hooks/useFestivalData';
import useWearData from '../Hooks/useWearData';
import '../Css/Map.css';

export default function Map() {
  const { stateData, selectedState, setSelectedState } = useStateData();
  const [hoveredState, setHoveredState] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentView, setCurrentView] = useState('basic');
  const [carouselIndex, setCarouselIndex] = useState(0);

  const [tryMode, setTryMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [usedHints, setUsedHints] = useState([]);
  const [revealedHints, setRevealedHints] = useState([]);

  const fields = ['name', 'capital', 'population', 'language', 'area', 'established'];

  const stateInfo = hoveredState
    ? stateData[hoveredState]
    : selectedState
      ? stateData[selectedState]
      : null;

  const foodData = useFoodData(stateInfo?.id || 0);
  const placeData = usePlaceData(stateInfo?.id || 0);
  const festivalData = useFestivalData(stateInfo?.id || 0);
  const wearData = useWearData(stateInfo?.id || 0);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = Object.keys(stateData).filter((key) =>
      stateData[key].name.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      const selected = suggestions[0];
      setSelectedState(selected);
      setSearchTerm(stateData[selected].name);
      setSuggestions([]);
      resetTry();
      setCurrentView('basic');
      setCarouselIndex(0);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setCarouselIndex(0);
    setTryMode(false);
  };

  const getCarouselData = () => {
    switch (currentView) {
      case 'food': return foodData || [];
      case 'festival': return festivalData || [];
      case 'tourist': return placeData || [];
      default: return [];
    }
  };

  const carouselData = getCarouselData();
  const currentItem = carouselData[carouselIndex];

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselData.length);
  };

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

    setResult({
      totalCorrect: Math.max(0, finalScore),
      correct,
      allCorrect: totalCorrect === fields.length,
    });
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
          {!tryMode && (
            <div id="search-try-container">
              <input
                type="text"
                placeholder="🔍 Search for a state..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleSearchEnter}
                onBlur={() => setTimeout(() => setSuggestions([]), 100)}
                id="state-search"
              />
              <button className="try-button try-near-search" onClick={() => setTryMode(!tryMode)}>
                Try Yourself!
              </button>

              {suggestions.length > 0 && (
                <ul id="search-results">
                  {suggestions.map((state, index) => (
                    <li
                      key={index}
                      className="search-result-item"
                      onMouseDown={() => {
                        setSelectedState(state);
                        setSearchTerm(stateData[state].name);
                        setSuggestions([]);
                        resetTry();
                        setCurrentView('basic');
                        setCarouselIndex(0);
                      }}
                    >
                      {stateData[state].name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tryMode && (
            <div className="try-top-button-wrapper">
              <button className="try-button try-near-search" onClick={() => setTryMode(false)}>
                Show Info
              </button>
            </div>
          )}


          {stateInfo ? (
            <>
              <div className="state-header">
                <div className="try-controls">
                  {tryMode && (
                    <button
                      className={`hint-icon ${revealedHints.length >= 3 || result ? 'disabled-hint' : ''}`}
                      onClick={handleHint}
                      disabled={!!result || revealedHints.length >= 3}
                    >
                      Hint
                    </button>
                  )}
                </div>
              </div>

              {!tryMode && (
                <>
                  <h2>{stateInfo.name}</h2>
                  <div>
                    <button
                      onClick={() => handleViewChange('basic')}
                      className={`details-controls ${currentView === 'basic' ? 'active-view' : ''}`}
                    >
                      Basic Info
                    </button>
                    <button
                      onClick={() => handleViewChange('food')}
                      className={`details-controls ${currentView === 'food' ? 'active-view' : ''}`}
                    >
                      Food
                    </button>
                    <button
                      onClick={() => handleViewChange('festival')}
                      className={`details-controls ${currentView === 'festival' ? 'active-view' : ''}`}
                    >
                      Festival
                    </button>
                    <button
                      onClick={() => handleViewChange('wear')}
                      className={`details-controls ${currentView === 'wear' ? 'active-view' : ''}`}
                    >
                      Wear
                    </button>
                    <button
                      onClick={() => handleViewChange('tourist')}
                      className={`details-controls ${currentView === 'tourist' ? 'active-view' : ''}`}
                    >
                      Tourist
                    </button>
                  </div>


                  <div className="state-view">
                    {currentView === 'basic' && (
                      <div className='basic-info'>
                        <p><strong>🏛 Capital:</strong> {stateInfo.aboutCapital}</p>
                        <p><strong>👨‍👩‍👧 Population:</strong> {stateInfo.population}</p>
                        <p><strong>🗣 Language:</strong> {stateInfo.language}</p>
                        <p><strong>📐 Area:</strong> {stateInfo.area}</p>
                        <p><strong>📅 Established:</strong> {stateInfo.established}</p>
                        <p><strong>📖 About:</strong> {stateInfo.about}</p>
                      </div>
                    )}

                    {(currentView === 'food' || currentView === 'festival' || currentView === 'tourist') && currentItem && (
                      <div className="carousel-container">
                        <img src={currentItem.imageUrl} alt={currentItem.name} style={{ width: '100%', borderRadius: '12px' }} />
                        <p><strong>{currentItem.name}</strong></p>
                        <p>{currentItem.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <button onClick={handlePrev}>Prev</button>
                          <button onClick={handleNext}>Next</button>
                        </div>
                      </div>
                    )}

                    {currentView === 'wear' && wearData && (
                      <div className="wear-container">
                        <img src={wearData.imageUrl} alt="Traditional Wear" style={{ width: '100%', borderRadius: '12px' }} />
                        <p><strong>🧑‍🦱 Men:</strong> {wearData.menWear}</p>
                        <p><strong>👩‍🦰 Women:</strong> {wearData.womenWear}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {tryMode && (
                <>
                  {revealedHints.length > 0 && (
                    <div className="hint-display">
                      {revealedHints.map((hint, idx) => (
                        <p key={idx}>💡 Hint for {hint.field}: <strong>{hint.value}</strong></p>
                      ))}
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
                            → Expected: <strong>{stateInfo[field]}</strong>
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
                      <p>🎯 <strong>Score:</strong> {result.totalCorrect} / 6</p>
                      {result.totalCorrect < fields.length && (
                        <button onClick={handlePlayAgain} className="play-again-button">
                          Try Again
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <p>🖱 Hover or search for a state to begin.</p>
          )}
        </div>
      </div>
    </div>
  );
}
