import React, { useEffect, useState } from 'react';
import useFoodData from '../Hooks/useFoodData';
import usePlaceData from '../Hooks/usePlaceData';
import useFestivalData from '../Hooks/useFestivalData';
import useWearData from '../Hooks/useWearData';
import '../Css/Dive.css';

export default function Dive() {
  const foodData = useFoodData(null, true); // get all
  const placeData = usePlaceData(null, true);
  const festivalData = useFestivalData(null, true);
  const wearData = useWearData(null, true);
  
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const generateQuizItems = (category) => {
    let items = [];

    if (category === 'food') items = foodData.map(i => ({ ...i, type: 'food' }));
    if (category === 'place') items = placeData.map(i => ({ ...i, type: 'place' }));
    if (category === 'festival') items = festivalData.map(i => ({ ...i, type: 'festival' }));
    if (category === 'wear') {
      items = (wearData || []).map(i => ({
        ...i,
        name: i.menWear,
        image: i.image,
        type: 'wear',
      }));
    }

    if (category === 'mix') {
      items = [
        ...(foodData || []).map(i => ({ ...i, type: 'food' })),
        ...(placeData || []).map(i => ({ ...i, type: 'place' })),
        ...(festivalData || []).map(i => ({ ...i, type: 'festival' })),
        ...(wearData || []).map(i => ({
          ...i,
          name: i.menWear,
          image: i.image,
          type: 'wear',
        })),
      ];
    }

    if (!items || items.length === 0) return [];

    const quizItems = [...items]
      .sort(() => 0.5 - Math.random())
      .slice(0, category === 'mix' ? 10 : 5)
      .map(item => {
        const correct = item.name;
        const allOptions = items
          .map(i => i.name)
          .filter(name => name && name !== correct);

        const incorrects = allOptions
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        const options = [...incorrects, correct].sort(() => 0.5 - Math.random());

        return {
          ...item,
          correct,
          options,
        };
      });

    return quizItems;
  };

  useEffect(() => {
    if (!category) return;
    const quizItems = generateQuizItems(category);
    setQuestions(quizItems);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowScore(false);
  }, [category, foodData, placeData, festivalData, wearData]);

  const handleSelect = (option) => {
    setSelectedAnswer(option);
    if (option === questions[currentIndex].correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowScore(true);
    }
  };

  const resetGame = () => {
    setCategory(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowScore(false);
  };

  const current = questions[currentIndex];

  return (
    <div className="dive-wrapper">
      {!category ? (
        <div className="category-select">
          <h2>🎮 Choose a Category</h2>
          <button onClick={() => setCategory('food')}>🍲 Food</button>
          <button onClick={() => setCategory('place')}>🏞️ Places</button>
          <button onClick={() => setCategory('festival')}>🎉 Festivals</button>
          <button onClick={() => setCategory('wear')}>👗 Wear</button>
          <button onClick={() => setCategory('mix')}>🌈 Mix</button>
        </div>
      ) : showScore ? (
        <div className="score-screen">
          <h2>🎯 Game Over!</h2>
          <p>Your Score: {score} / {questions.length}</p>
          <button onClick={resetGame}>🔁 Play Again</button>
        </div>
      ) : (
        current && (
          <div className="question-box">
            <div className="quit-row">
              <button onClick={resetGame} className="quit-button">❌ Quit</button>
            </div>

            <h3 className="question-text">
              Q{currentIndex + 1}.{" "}
              {current.type === 'food' && 'What is this food?'}
              {current.type === 'place' && 'Where is this place?'}
              {current.type === 'festival' && 'Which festival is this?'}
              {current.type === 'wear' && 'What is this traditional wear?'}
            </h3>

            <div className="question-content">
              <img
                src={current?.image || current?.imageUrl}
                alt="quiz item"
                className="question-image"
              />

              <div className="answer-box">
                <div className="answer-options">
                  {current.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(opt)}
                      className={`option-btn ${selectedAnswer
                        ? opt === current.correct
                          ? 'correct'
                          : opt === selectedAnswer
                          ? 'wrong'
                          : ''
                        : ''}`}
                      disabled={!!selectedAnswer}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {selectedAnswer && (
                  <>
                    <p className={`feedback ${selectedAnswer === current.correct ? 'correct' : 'incorrect'}`}>
                      {selectedAnswer === current.correct
                        ? '🎉 Correct!'
                        : `❌ Correct answer: ${current.correct}`}
                    </p>
                    <button onClick={nextQuestion} className="next-button">➡️ Next</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
