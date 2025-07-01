import React from 'react';
import '../Css/WinningAnimation.css';

const WinningAnimation = ({ onAnimationEnd }) => {
  return (
    <div className="winning-animation" onClick={onAnimationEnd}>
      <div className="confetti">
        <span role="img" aria-label="confetti">🎉</span>
        <span role="img" aria-label="party">🥳</span>
        <span role="img" aria-label="confetti">🎊</span>
        <span role="img" aria-label="balloon">🎈</span>
        <span role="img" aria-label="star">🌟</span>
      </div>
      <h2 className="win-message">Yay! You did it, Superstar! 🌈</h2>
    </div>
  );
};

export default WinningAnimation;
