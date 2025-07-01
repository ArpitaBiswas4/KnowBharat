import React, { useEffect, useState } from 'react';
import useFoodData from '../Hooks/useFoodData';
import usePlaceData from '../Hooks/usePlaceData';
import useFestivalData from '../Hooks/useFestivalData';
import useWearData from '../Hooks/useWearData';
import ScoreScreen from './ScoreScreen';
import '../Css/Dive.css';

export default function Dive() {
  const foodData = useFoodData(null, true);
  const placeData = usePlaceData(null, true);
  const festivalData = useFestivalData(null, true);
  const wearData = useWearData(null, true);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const generateQuizItems = () => {
    const tables = {
      food: foodData || [],
      place: placeData || [],
      festival: festivalData || [],
      wear: (wearData || []).map(i => ({
        ...i,
        name: i.menWear, // for quiz purposes
        type: 'wear',
      })),
    };

    const allItems = Object.entries(tables)
      .flatMap(([type, arr]) => arr.map(item => ({ ...item, type })));

    if (!allItems.length) return [];

    const selectedItems = [...allItems].sort(() => 0.5 - Math.random()).slice(0, 10);

    const quizItems = selectedItems.map(item => {
      const correct = item.name;
      const sameTypeOptions = tables[item.type].map(i => i.menWear || i.name).filter(n => n && n !== correct);
      const incorrects = sameTypeOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
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
    const quizItems = generateQuizItems();
    setQuestions(quizItems);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowScore(false);
  }, [foodData, placeData, festivalData, wearData]);

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
    const quizItems = generateQuizItems();
    setQuestions(quizItems);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowScore(false);
  };

  const current = questions[currentIndex];

  return (
    <div className="dive-wrapper">
      <h2 className="heading">🖼️ Look Closely! Can You Guess It Right? 🖼️</h2>
      {showScore ? (
              <ScoreScreen score={score} total={questions.length} resetGame={resetGame} />
            ) : (
        current && (
          <div className="question-box">
            <div className="quit-row">
              <button onClick={resetGame} className="try-again-button">Restart</button>
            </div>
            <h2 className="question-text">
              Question {currentIndex + 1} of {questions.length}
            </h2>
            <h3 className="quiz-question">
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
                    <button onClick={nextQuestion} className="next-button">Next</button>
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
