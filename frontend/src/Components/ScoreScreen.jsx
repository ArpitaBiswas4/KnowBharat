import React from 'react';
import WinningAnimation from './WinningAnimation';
import '../Css/ScoreScreen.css'; // Optional custom styling

export default function ScoreScreen({ score, total, resetGame }) {
  return (
    <div className="score-screen">
      {score === total ? (
        <>
          <h2>🏆 Perfect Score! You nailed it! 🏆</h2>
          <WinningAnimation />
          <p>You scored {score} out of {total}</p>
          <button onClick={resetGame} className="try-again-button">Play Again</button>
        </>
      ) : score === 0 ? (
        <>
          <h2>😓 Oh no! Not a single one right! 😓</h2>
          <p>Don't worry, you can do better next time!</p>
          <p>You scored {score} out of {total}</p>
          <button onClick={resetGame} className="try-again-button">Try Again</button>
        </>
      ) : score >= total / 2 ? (
        <>
          <h2>🎉 Good Job! 🎉</h2>
          <p>You scored {score} out of {total}</p>
          <button onClick={resetGame} className="try-again-button">Try Again</button>
        </>
      ) : (
        <>
          <h2>😕 Better Luck Next Time! 😕</h2>
          <p>You scored only {score} out of {total}</p>
          <button onClick={resetGame} className="try-again-button">Try Again</button>
        </>
      )}
    </div>
  );
}
