import React, { useState, useEffect } from 'react';
import useStateData from '../Hooks/useStateData';
import useFoodData from '../Hooks/useFoodData';
import usePlaceData from '../Hooks/usePlaceData';
import useFestivalData from '../Hooks/useFestivalData';
import useWearData from '../Hooks/useWearData';
import '../Css/Quiz.css';

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

  useEffect(() => {
    if (!category || questions.length > 0) return;

    let items = [];

    if (category === 'food') items = foodData.map(i => ({ ...i, type: 'food' }));
    if (category === 'place') items = placeData.map(i => ({ ...i, type: 'place' }));
    if (category === 'festival') items = festivalData.map(i => ({ ...i, type: 'festival' }));
    if (category === 'wear') {
      items = (wearData || []).map(i => ({
        ...i,
        name: i.menWear,
        type: 'wear',
      }));
    }

    if (category === 'capital') {
      items = Object.values(stateData).map(i => ({
        ...i,
        name: i.capital,
        state: { name: i.name },
        type: 'capital',
      }));
    }

    if (category === 'establish') {
      items = Object.values(stateData).map(i => ({
        ...i,
        name: i.established,
        state: { name: i.name },
        type: 'establish',
      }));
    }

    if (category === 'language') {
      items = Object.values(stateData).map(i => ({
        ...i,
        name: i.language,
        state: { name: i.name },
        type: 'language',
      }));
    }

    if (category === 'mix') {
      items = [
        ...(foodData || []).map(i => ({ ...i, type: 'food' })),
        ...(placeData || []).map(i => ({ ...i, type: 'place' })),
        ...(festivalData || []).map(i => ({ ...i, type: 'festival' })),
        ...(wearData || []).map(i => ({ ...i, name: i.menWear, type: 'wear' })),
      ];
    }

    if (!items.length) return;

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

        // Food
        if (item.type === 'food') {
          const allFoods = foodData.map(f => f.name).filter(n => n !== item.name);
          if (isReverse) {
            questionText = `${correctState} is famous for which food?`;
            correct = item.name;
            options = [...allFoods.sort(() => 0.5 - Math.random()).slice(0, 3), correct];
          } else {
            questionText = `In which state is "${item.name}" famous?`;
            correct = correctState;
            options = [...allStates.sort(() => 0.5 - Math.random()).slice(0, 3), correct];
          }
        }

        // Place
        else if (item.type === 'place') {
          const allPlaces = placeData.map(p => p.name).filter(n => n !== item.name);
          if (isReverse) {
            questionText = `${correctState} is known for which place?`;
            correct = item.name;
            options = [...allPlaces.sort(() => 0.5 - Math.random()).slice(0, 3), correct];
          } else {
            questionText = `"${item.name}" is a famous place in which state?`;
            correct = correctState;
            options = [...allStates.sort(() => 0.5 - Math.random()).slice(0, 3), correct];
          }
        }

        // Festival
        else if (item.type === 'festival') {
          const allFestivals = festivalData.map(f => f.name).filter(n => n !== item.name);
          if (isReverse) {
            questionText = `${correctState} is known for which festival?`;
            correct = item.name;
            options = [...allFestivals.sort(() => 0.5 - Math.random()).slice(0, 3), correct];
          } else {
            questionText = `The festival "${item.name}" is celebrated in which state?`;
            correct = correctState;
            options = [...allStates.sort(() => 0.5 - Math.random()).slice(0, 3), correct];
          }
        }

        // Wear
        else if (item.type === 'wear') {
          const allWears = wearData.map(w => w.menWear).filter(n => n && n !== item.name);
          if (isReverse) {
            questionText = `${correctState}'s traditional wear is?`;
            correct = item.name;
            options = [...allWears.sort(() => 0.5 - Math.random()).slice(0, 3), correct];
          } else {
            questionText = `Which state's traditional wear is "${item.name}"?`;
            correct = correctState;
            options = [...allStates.sort(() => 0.5 - Math.random()).slice(0, 3), correct];
          }
        }

        // Capital
        else if (item.type === 'capital') {
          questionText = `What is the capital of ${correctState}?`;
          correct = item.name;
          const allCapitals = Object.values(stateData).map(s => s.capital).filter(c => c && c !== correct);
          options = [...allCapitals.sort(() => 0.5 - Math.random()).slice(0, 3), correct];
        }

        // Established
        else if (item.type === 'establish') {
          questionText = `In which year was ${correctState} established?`;
          correct = item.name;
          const allYears = Object.values(stateData).map(s => s.established).filter(y => y && y !== correct);
          options = [...allYears.sort(() => 0.5 - Math.random()).slice(0, 3), correct];
        }

        // Language
        else if (item.type === 'language') {
          questionText = `What is the official language of ${correctState}?`;
          correct = item.name;
          const allLangs = Object.values(stateData).map(s => s.language).filter(l => l && l !== correct);
          options = [...allLangs.sort(() => 0.5 - Math.random()).slice(0, 3), correct];
        }

        return {
          ...item,
          correct,
          questionText,
          options: options.sort(() => 0.5 - Math.random()),
        };
      });

    setQuestions(quizItems);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowScore(false);
  }, [category, foodData, placeData, festivalData, wearData, stateData]);

  const handleSelect = (option) => {
    setSelectedAnswer(option);
    if (option === questions[currentIndex].correct) {
      setScore(prev => prev + 1);
    }
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowScore(true);
      }
    }, 800);
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
          <h2>🎮 Choose a Category</h2>
          <button onClick={() => setCategory('food')}>🍲 Food</button>
          <button onClick={() => setCategory('place')}>🏞️ Places</button>
          <button onClick={() => setCategory('festival')}>🎉 Festivals</button>
          <button onClick={() => setCategory('wear')}>👗 Wear</button>
          <button onClick={() => setCategory('capital')}>🏛️ Capital</button>
          <button onClick={() => setCategory('establish')}>📅 Established</button>
          <button onClick={() => setCategory('language')}>🗣️ Language</button>
          <button onClick={() => setCategory('mix')}>🌈 Mix</button>
        </div>
      ) : showScore ? (
        <div className="score-screen">
          <h2>🎯 Finished!</h2>
          <p>Your Score: {score} / {questions.length}</p>
          <button onClick={resetGame}>🔁 Play Again</button>
        </div>
      ) : (
        current && (
          <div className="question-box">
            <div className="quit-row">
              <button className="quit-button" onClick={resetGame}>❌ Quit</button>
            </div>
            <h3 className="question-text">
              Q{currentIndex + 1}. {current.questionText}
            </h3>
            <div className="answer-options">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(opt)}
                  className={`option-btn ${selectedAnswer ? (
                    opt === current.correct ? 'correct' : opt === selectedAnswer ? 'wrong' : ''
                  ) : ''}`}
                  disabled={!!selectedAnswer}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
