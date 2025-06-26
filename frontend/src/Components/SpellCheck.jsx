import React, { useState, useEffect } from 'react';
import useFoodData from '../Hooks/useFoodData';
import usePlaceData from '../Hooks/usePlaceData';
import useFestivalData from '../Hooks/useFestivalData';
import useWearData from '../Hooks/useWearData';
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
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const foods = (foodData || []).map(i => ({ ...i, type: 'food', answer: i.name }));
    const places = (placeData || []).map(i => ({ ...i, type: 'place', answer: i.name }));
    const festivals = (festivalData || []).map(i => ({ ...i, type: 'festival', answer: i.name }));
    const wears = (wearData || []).map(i => ({ ...i, type: 'wear', answer: i.menWear }));

    const merged = [...foods, ...places, ...festivals, ...wears].filter(i => i.answer);
    setItems(merged.sort(() => 0.5 - Math.random()).slice(0, 10));
  }, [foodData, placeData, festivalData, wearData]);

  useEffect(() => {
    if (items.length === 0) return;
    const next = items[score];
    setCurrentItem(next);
    const letters = next.answer.toUpperCase().split('');
    setShuffledLetters(letters.sort(() => 0.5 - Math.random()));
    setUserAnswer([]);
    setShowResult(false);
  }, [items, score]);

  const handleLetterClick = (letter, index) => {
    setUserAnswer([...userAnswer, letter]);
    const updated = [...shuffledLetters];
    updated.splice(index, 1);
    setShuffledLetters(updated);
  };

  const handleBackspace = (index) => {
    const letter = userAnswer[index];
    setUserAnswer(userAnswer.filter((_, i) => i !== index));
    setShuffledLetters([...shuffledLetters, letter]);
  };

  const handleCheck = () => {
    const answer = currentItem.answer.toUpperCase();
    const userInput = userAnswer.join('');
    if (userInput === answer) {
      setShowResult('correct');
    } else {
      setShowResult('wrong');
    }
  };

  const handleNext = () => {
    if (score + 1 >= items.length) {
      setCompleted(true);
    } else {
      setScore(score + 1);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCompleted(false);
    setShowResult(false);
  };

  return (
    <div className="spellcheck-wrapper">
      <h2>🔤 Spell the Word!</h2>

      {completed ? (
        <div className="end-screen">
          <h3>🎉 You completed the spelling quiz!</h3>
          <p>Your score: {score} / {items.length}</p>
          <button onClick={handleRestart}>🔁 Play Again</button>
        </div>
      ) : currentItem ? (
        <>
          <div className="image-box">
            <img src={currentItem.image || currentItem.imageUrl} alt="quiz" />
            <p className="type-label">({currentItem.type.toUpperCase()})</p>
          </div>

          <div className="blanks">
            {userAnswer.map((letter, i) => (
              <span key={i} onClick={() => handleBackspace(i)} className="filled-letter">
                {letter}
              </span>
            ))}
            {[...Array(currentItem.answer.length - userAnswer.length)].map((_, i) => (
              <span key={i} className="blank-letter">_</span>
            ))}
          </div>

          <div className="letters-box">
            {shuffledLetters.map((letter, i) => (
              <button key={i} onClick={() => handleLetterClick(letter, i)} className="letter-btn">
                {letter}
              </button>
            ))}
          </div>

          <div className="controls">
            {showResult === 'correct' && (
              <>
                <p className="success-msg">✅ Correct!</p>
                <button onClick={handleNext}>➡️ Play again</button>
              </>
            )}
            {showResult === 'wrong' && (
              <>
                <p className="error-msg">❌ Oops! The correct answer is: <strong>{currentItem.answer}</strong></p>
                <button onClick={handleNext}>➡️ Play again</button>
              </>
            )}
            {!showResult && (
              <button onClick={handleCheck} disabled={userAnswer.length !== currentItem.answer.length}>
                ✅ Check
              </button>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
