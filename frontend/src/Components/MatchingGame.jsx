import React, { useEffect, useState } from 'react';
import useStateData from '../Hooks/useStateData';
import WinningAnimation from './WinningAnimation';
import '../Css/MatchingGame.css';

export default function MatchingGame() {
  const { stateData } = useStateData();
  const [category, setCategory] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [hearts, setHearts] = useState(3);
  const [states, setStates] = useState([]);
  const [values, setValues] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [showWinningAnimation, setShowWinningAnimation] = useState(false);
  const [removingItems, setRemovingItems] = useState([]);

  const categories = [
    'capital', 'food', 'festival', 'place', 'wear', 'language', 'established', 'mix'
  ];

  const getValueByCategoryAsync = async (stateKey, cat) => {
    const state = stateData[stateKey];
    if (!state) return null;

    const id = state.id;

    switch (cat) {
      case 'capital': return state.capital;
      case 'language': return state.language;
      case 'established': return state.established;
      case 'food': {
        const res = await fetch(`http://localhost:8080/foods/food/${id}`);
        const data = await res.json();
        return Array.isArray(data) ? data[0]?.name : data?.name;
      }
      case 'place': {
        const res = await fetch(`http://localhost:8080/places/place/${id}`);
        const data = await res.json();
        return Array.isArray(data) ? data[0]?.name : data?.name;
      }
      case 'festival': {
        const res = await fetch(`http://localhost:8080/festivals/festival/${id}`);
        const data = await res.json();
        return Array.isArray(data) ? data[0]?.name : data?.name;
      }
      case 'wear': {
        const res = await fetch(`http://localhost:8080/wears/wear/${id}`);
        const data = await res.json();
        return data?.menWear;
      }
      default: return null;
    }
  };

  useEffect(() => {
    if (stateData && Object.keys(stateData).length > 0 && category) {
      initializeGame();
    }
  }, [stateData, category]);

  const initializeGame = async () => {
    const stateKeys = Object.keys(stateData);
    const selectedPairs = [];
    const usedKeys = new Set();

    const pickRandomCategory = () => {
      const valid = ['food', 'place', 'festival', 'wear'];
      return valid[Math.floor(Math.random() * valid.length)];
    };

    while (selectedPairs.length < 5 && stateKeys.length > 0) {
      const randomStateKey = stateKeys[Math.floor(Math.random() * stateKeys.length)];
      if (usedKeys.has(randomStateKey)) continue;

      const cat = category === 'mix' ? pickRandomCategory() : category;
      const value = await getValueByCategoryAsync(randomStateKey, cat);
      if (value) {
        selectedPairs.push({ state: randomStateKey, value, category: cat });
        usedKeys.add(randomStateKey);
      }
    }

    const stateList = selectedPairs.map(p => p.state);
    const valueList = shuffle(selectedPairs.map(p => p.value));

    setStates(stateList);
    setValues(valueList);
    setMatchedPairs([]);
    setFeedback('');
    setGameOver(false);
    setShowWinningAnimation(false);
    setSelectedState(null);
    setSelectedValue(null);
  };

  const shuffle = (arr) => {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setFeedback('');
  };

  const handleValueSelect = (value) => {
    setSelectedValue(value);
    if (selectedState) {
      const matchPair = matchedPairs.find(p => p.state === selectedState);
      if (matchPair) return;

      const correctValue = values.find(v => v === value);
      const isMatch = getValueByCategoryAsync(selectedState, category).then(correct => {
        const matched = correct === value;
        if (matched) {
          setMatchedPairs(prev => [...prev, { state: selectedState, value }]);
          setFeedback('Correct Match!');
          setRemovingItems(prev => [...prev, selectedState, value]);

          setTimeout(() => {
            setStates(prev => prev.filter(s => s !== selectedState));
            setValues(prev => prev.filter(v => v !== value));
            setRemovingItems([]);
          }, 500);
        } else {
          setHearts(prev => prev - 1);
          setFeedback('Incorrect Match. Try Again!');
        }
        setSelectedState(null);
        setSelectedValue(null);
        setTimeout(() => setFeedback(''), 3000);
      });
    }
  };

  useEffect(() => {
    if (matchedPairs.length === 5) {
      setGameOver(true);
      setShowWinningAnimation(true);
    }
  }, [matchedPairs]);

  const handleRestart = () => {
    setHearts(3);
    setCategory(null);
    setStates([]);
    setValues([]);
    setMatchedPairs([]);
    setFeedback('');
  };

  const handleAnimationEnd = () => {
    setShowWinningAnimation(false);
  };

  return (
    <div className="matching-game-container">
      {showWinningAnimation && <WinningAnimation onAnimationEnd={handleAnimationEnd} />}
      {!category ? (
        <div className="category-select">
          <h2>Select a Matching Category</h2>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}>
              {cat === 'mix' ? '🌈 Mix' : `🔹 ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="quit-row">
  <button className="quit-button" onClick={handleRestart}>❌ Quit</button>
</div>

          <h2 className="title">Match States with Their {category === 'place' ? 'Tourist Places' : category.charAt(0).toUpperCase() + category.slice(1)}</h2>
          <div className="status">
            <h3 className="hearts">Hearts: {Array(hearts).fill('❤️')}</h3>
            {hearts === 0 && (
              <>
                <p className="lose-message">You lost all hearts. Restart?</p>
                <button onClick={handleRestart} className="restart-button">Restart Game</button>
              </>
            )}
            {gameOver && (
              <>
                <p className="win-message">Congratulations! All pairs matched!</p>
                <button onClick={handleRestart} className="restart-button">Play Again</button>
              </>
            )}
          </div>

          {feedback && (
            <p className={`feedback-text ${feedback.includes('Correct') ? 'correct' : 'incorrect'}`}>
              {feedback}
            </p>
          )}

          <div className="Pairs">
            {hearts > 0 && !gameOver && (
              <div className="game-columns">
                <div className="states-column">
                  <h3>States</h3>
                  <ul className="list">
                    {states.map(state => (
                      <li
                        key={state}
                        className={`list-item ${selectedState === state ? 'selected' : ''} ${removingItems.includes(state) ? 'removing' : ''}`}
                        onClick={() => handleStateSelect(state)}
                      >
                        {stateData[state].name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="capitals-column">
                  <h3>{category === 'place' ? 'Tourist Places' : category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                  <ul className="list">
                    {values.map(val => (
                      <li
                        key={val}
                        className={`list-item ${selectedValue === val ? 'selected' : ''} ${removingItems.includes(val) ? 'removing' : ''}`}
                        onClick={() => handleValueSelect(val)}
                      >
                        {val}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="matched-pairs">
              <h3 className="matched-pairs-title">Matched Pairs:</h3>
              <ul>
                {matchedPairs.map((pair, index) => (
                  <li key={index} className="matched-pair">
                    {stateData[pair.state]?.name} - {pair.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
