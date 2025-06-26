import React from 'react';
import '../Css/WinningAnimation.css'; // Import the CSS for the animation

const WinningAnimation = ({ onAnimationEnd }) => {
  return (
    <div className="winning-animation" onAnimationEnd={onAnimationEnd}>
      <div className="confetti">
        <span role="img" aria-label="confetti">🎉</span>
        <span role="img" aria-label="confetti">🎊</span>
        <span role="img" aria-label="confetti">🎉</span>
        <span role="img" aria-label="confetti">🎊</span>
        <span role="img" aria-label="confetti">🎉</span>
      </div>
      <h2 className="win-message">Congratulations! You've won!</h2>
    </div>
  );
};

export default WinningAnimation;
