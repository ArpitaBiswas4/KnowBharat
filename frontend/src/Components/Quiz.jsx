import React, { useState, useEffect } from 'react';
import useStateData from '../Hooks/useStateData';
import useFoodData from '../Hooks/useFoodData';
import usePlaceData from '../Hooks/usePlaceData';
import useFestivalData from '../Hooks/useFestivalData';
import useWearData from '../Hooks/useWearData';
import ScoreScreen from './ScoreScreen';
import '../Css/Quiz.css';

const categoryLabels = {
  food: 'Food',
  place: 'Place',
  festival: 'Festival',
  wear: 'Traditional Wear',
  capital: 'Capital',
  establish: 'Establishment Year',
  language: 'Language',
  mix: 'Mix'
};

export default function QuizGame() {
  const { stateData } = useStateData();
  const foodData = useFoodData(null, true);
  const placeData = usePlaceData(null, true);
  const festivalData = useFestivalData(null, true);
  const wearData = useWearData(null, true);

  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showScore, setShowScore] = useState(false);

  const optionLabels = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    if (!category || questions.length > 0) return;

    let items = [];
    const formatWear = wear => ({ ...wear, name: wear.menWear, type: 'wear' });

    if (category === 'food') items = foodData.map(i => ({ ...i, type: 'food' }));
    if (category === 'place') items = placeData.map(i => ({ ...i, type: 'place' }));
    if (category === 'festival') items = festivalData.map(i => ({ ...i, type: 'festival' }));
    if (category === 'wear') items = (wearData || []).map(formatWear);
    if (category === 'capital') {
      items = Object.values(stateData).map(i => ({ ...i, name: i.capital, state: { name: i.name }, type: 'capital' }));
    }
    if (category === 'establish') {
      items = Object.values(stateData).map(i => ({ ...i, name: i.established, state: { name: i.name }, type: 'establish' }));
    }
    if (category === 'language') {
      items = Object.values(stateData).map(i => ({ ...i, name: i.language, state: { name: i.name }, type: 'language' }));
    }
    if (category === 'mix') {
      items = [
        ...foodData.map(i => ({ ...i, type: 'food' })),
        ...placeData.map(i => ({ ...i, type: 'place' })),
        ...festivalData.map(i => ({ ...i, type: 'festival' })),
        ...wearData.map(formatWear),
      ];
    }

    const quizItems = items
      .sort(() => 0.5 - Math.random())
      .slice(0, 10)
      .map(item => {
        const correctState = item.state?.name || 'Unknown';
        const isReverse = Math.random() < 0.5;
        let questionText = '';
        let correct = '';
        let options = [];

        const allStates = Object.values(stateData).map(s => s.name).filter(n => n !== correctState);
        const shuffleOptions = (arr, correct) =>
          [...arr.sort(() => 0.5 - Math.random()).slice(0, 3), correct].sort(() => 0.5 - Math.random());

        switch (item.type) {
          case 'food':
            questionText = isReverse
              ? `${correctState} is famous for which food?`
              : `Where is "${item.name}" popular?`;
            correct = isReverse ? item.name : correctState;
            options = shuffleOptions(
              isReverse
                ? foodData.map(f => f.name).filter(n => n !== item.name)
                : allStates,
              correct
            );
            break;
          case 'place':
            questionText = isReverse
              ? `${correctState} is famous for which place?`
              : `Where is "${item.name}" located?`;
            correct = isReverse ? item.name : correctState;
            options = shuffleOptions(
              isReverse
                ? placeData.map(p => p.name).filter(n => n !== item.name)
                : allStates,
              correct
            );
            break;
          case 'festival':
            questionText = isReverse
              ? `${correctState} is known for which festival?`
              : `"${item.name}" is celebrated in which state?`;
            correct = isReverse ? item.name : correctState;
            options = shuffleOptions(
              isReverse
                ? festivalData.map(f => f.name).filter(n => n !== item.name)
                : allStates,
              correct
            );
            break;
          case 'wear':
            questionText = isReverse
              ? `Traditional wear of ${correctState}?`
              : `"${item.name}" is worn in which state?`;
            correct = isReverse ? item.name : correctState;
            options = shuffleOptions(
              isReverse
                ? wearData.map(w => w.menWear).filter(n => n !== item.name)
                : allStates,
              correct
            );
            break;
          case 'capital':
            questionText = `What is the capital of ${correctState}?`;
            correct = item.name;
            options = shuffleOptions(
              Object.values(stateData).map(s => s.capital).filter(c => c !== correct),
              correct
            );
            break;
          case 'establish':
            questionText = `When was ${correctState} established?`;
            correct = item.name;
            options = shuffleOptions(
              Object.values(stateData).map(s => s.established).filter(c => c !== correct),
              correct
            );
            break;
          case 'language':
            questionText = `What is the official language of ${correctState}?`;
            correct = item.name;
            options = shuffleOptions(
              Object.values(stateData).map(s => s.language).filter(c => c !== correct),
              correct
            );
            break;
        }

        return {
          ...item,
          correct,
          questionText,
          options,
        };
      });

    setQuestions(quizItems);
  }, [category, foodData, placeData, festivalData, wearData, stateData]);

  const handleSelect = (option) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    if (option === questions[currentIndex].correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
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
    setScore(0);
    setSelectedAnswer(null);
    setShowScore(false);
  };

  const current = questions[currentIndex];

  return (
    <div className="quiz-wrapper">
      {!category ? (
        <div className="category-select">
          <h2>🎮 Choose a Category 🎮</h2>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button key={key} onClick={() => setCategory(key)}>{label}</button>
          ))}
        </div>
      ) : showScore ? (
        <ScoreScreen score={score} total={questions.length} resetGame={resetGame} />
      ) : (
        current && (
          <>
            <h2 className="heading">🤔 Can You Guess Right? It's Quiz Time on {categoryLabels[category]} 🤔</h2>
            <div className="question-box">
              <div className="quit-row">
                <button className="quit-button" onClick={resetGame}>❌</button>
              </div>
              <h2 className="question-text">Question {currentIndex + 1} of {questions.length}</h2>
              <h3 className="quiz-question">{current.questionText}</h3>
              <div className="answer-options two-columns">
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
                    <span className="option-label">{optionLabels[i]}.</span> {opt}
                  </button>
                ))}
              </div>
              {selectedAnswer && (
                <button className="next-button" onClick={handleNext}>Next</button>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
}
