import React, { useState, useEffect } from 'react';
import useFoodData from '../Hooks/useFoodData';
import usePlaceData from '../Hooks/usePlaceData';
import useFestivalData from '../Hooks/useFestivalData';
import useWearData from '../Hooks/useWearData';
import ScoreScreen from './ScoreScreen';
import '../Css/SpellCheck.css';

export default function SpellCheck() {
  const foodData = useFoodData(null, true);
  const placeData = usePlaceData(null, true);
  const festivalData = useFestivalData(null, true);
  const wearData = useWearData(null, true);

  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [userAnswer, setUserAnswer] = useState([]);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [hintedIndexes, setHintedIndexes] = useState([]);

  useEffect(() => {
    const foods = (foodData || []).map(i => ({ ...i, type: 'Food', answer: i.name }));
    const places = (placeData || []).map(i => ({ ...i, type: 'Place', answer: i.name }));
    const festivals = (festivalData || []).map(i => ({ ...i, type: 'Festival', answer: i.name }));
    const wears = (wearData || []).map(i => ({ ...i, type: 'Clothing', answer: i.menWear }));

    const merged = [...foods, ...places, ...festivals, ...wears].filter(i => i.answer);
    setItems(merged.sort(() => 0.5 - Math.random()).slice(0, 10));
  }, [foodData, placeData, festivalData, wearData]);

  useEffect(() => {
    if (items.length === 0 || count >= items.length) return;
    const next = items[count];
    setCurrentItem(next);
    const letters = next.answer.toUpperCase().split('');
    setShuffledLetters(letters.sort(() => 0.5 - Math.random()));
    setUserAnswer(Array(letters.length).fill(''));
    setShowResult(false);
    setHintCount(0);
    setHintedIndexes([]);
  }, [items, count]);

  const handleLetterClick = (letter, index) => {
    const newAnswer = [...userAnswer];
    for (let i = 0; i < newAnswer.length; i++) {
      if (!newAnswer[i] && !hintedIndexes.includes(i)) {
        newAnswer[i] = letter;
        break;
      }
    }

    const updated = [...shuffledLetters];
    updated.splice(index, 1);

    setUserAnswer(newAnswer);
    setShuffledLetters(updated);
  };

  const handleBackspace = (index) => {
    if (hintedIndexes.includes(index)) return;
    const letter = userAnswer[index];
    const newAnswer = [...userAnswer];
    newAnswer[index] = '';
    setUserAnswer(newAnswer);
    setShuffledLetters([...shuffledLetters, letter]);
  };

  const handleCheck = () => {
    const answer = currentItem.answer.toUpperCase();
    const userInput = userAnswer.join('');
    if (userInput === answer) {
      setScore(prev => prev + 1);
      setShowResult('correct');
    } else {
      setShowResult('wrong');
    }
  };

  const handleNext = () => {
    if (count + 1 >= items.length) {
      setCompleted(true);
    } else {
      setCount(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  const handleHint = () => {
  if (!currentItem || hintCount >= 3) return;

  const answerArray = currentItem.answer.toUpperCase().split('');
  const newAnswer = [...userAnswer];
  const updatedShuffled = [...shuffledLetters];
  const newHints = [...hintedIndexes];

  
  const revealableIndexes = answerArray
    .map((char, i) => (newAnswer[i] !== char ? i : null))
    .filter(i => i !== null && !newHints.includes(i));

  if (revealableIndexes.length === 0) return;


  const indexToReveal = revealableIndexes[Math.floor(Math.random() * revealableIndexes.length)];
  const correctLetter = answerArray[indexToReveal];
  newAnswer[indexToReveal] = correctLetter;

  const idx = updatedShuffled.indexOf(correctLetter);
  if (idx !== -1) updatedShuffled.splice(idx, 1);

  newHints.push(indexToReveal);

  setUserAnswer(newAnswer);
  setShuffledLetters(updatedShuffled);
  setHintedIndexes(newHints);
  setHintCount(prev => prev + 1); 
};


  return (
    <div className="spellcheck-wrapper">
      <h2>🔠 Spell the Word 🔠</h2>

      <div className="extra-buttons">
        <button
          onClick={handleHint}
          disabled={showResult || hintCount >= 3}
          className="hint-icon"
        >
          Hint
        </button>
        <button onClick={handleRestart} className="try-again-button">Restart</button>
      </div>


      {completed ?  (
              <ScoreScreen score={score} total={items.length} resetGame={handleRestart} />
            ) : currentItem ? (
              <><h3 className="question-count">Question {count + 1} of {items.length}</h3>
        <div className="spell-content">          
          <div className="image-box">
            <img src={currentItem.image || currentItem.imageUrl} alt="quiz" />
            <p className="type-label">({currentItem.type})</p>
          </div>

          <div className="input-section">
            <div className="blanks">
              {Array.from({ length: currentItem.answer.length }).map((_, i) => {
                const letter = userAnswer[i];
                const isHinted = hintedIndexes.includes(i);
                return letter ? (
                  <span
                    key={i}
                    onClick={() => !isHinted && handleBackspace(i)}
                    className={`filled-letter ${isHinted ? 'hinted' : ''}`}
                    style={{ cursor: isHinted ? 'not-allowed' : 'pointer' }}
                  >
                    {letter}
                  </span>
                ) : (
                  <span key={i} className="blank-letter">_</span>
                );
              })}
            </div>

            <div className="letters-box">
              {shuffledLetters.map((letter, i) => (
                <button
                  key={i}
                  onClick={() => handleLetterClick(letter, i)}
                  className="letter-btn"
                >
                  {letter}
                </button>
              ))}
            </div>

            <div className="controls">
              {showResult === 'correct' && (
                <>
                  <p className="success-msg">✅ Great Job!</p>
                  <button onClick={handleNext}>Next</button>
                </>
              )}
              {showResult === 'wrong' && (
                <>
                  <p className="error-msg">❌ Oops! It was <strong>{currentItem.answer}</strong></p>
                  <button onClick={handleNext}>Try Next</button>
                </>
              )}
              {!showResult && (
                <button
                  onClick={handleCheck}
                  disabled={userAnswer.includes('') || userAnswer.length !== currentItem.answer.length}
                >
                  Check
                </button>
              )}
            </div>
          </div>
        </div>
        </>
      ) : (
        <p>Loading fun...</p>
      )}
    </div>
  );
}
