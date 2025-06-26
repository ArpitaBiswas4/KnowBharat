import React, { useEffect, useState } from 'react';
import usePlaceData from '../Hooks/usePlaceData';
import '../Css/Puzzle.css';

export default function PuzzlePage() {
  const placeData = usePlaceData(null, true);
  const [imageUrl, setImageUrl] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [board, setBoard] = useState([]);
  const [showOriginal, setShowOriginal] = useState(true);
  const [resultMsg, setResultMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const gridSize = 3;
  const total = gridSize * gridSize;

  // Load image list and pick one
  useEffect(() => {
    const images = (placeData || []).map(p => p.image || p.imageUrl).filter(Boolean);
    setAllImages(images);
    if (images.length > 0) {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      setImageUrl(randomImage);
    }
  }, [placeData]);

  // Setup puzzle
  useEffect(() => {
    if (!imageUrl) return;

    const order = Array.from({ length: total }, (_, i) => i);
    const shuffled = [...order].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
    setBoard(Array(total).fill(null));
    setShowOriginal(true);
    setSubmitted(false);
    setResultMsg('');

    const timer = setTimeout(() => setShowOriginal(false), 3000);
    return () => clearTimeout(timer);
  }, [imageUrl]);

  const onDragStart = (e, fromGrid, index) => {
    e.dataTransfer.setData('fromGrid', fromGrid);
    e.dataTransfer.setData('index', index);
  };

  const onDrop = (e, dropIndex) => {
    if (submitted) return;

    const fromGrid = e.dataTransfer.getData('fromGrid') === 'true';
    const index = parseInt(e.dataTransfer.getData('index'), 10);
    if (isNaN(index)) return;

    if (fromGrid) {
      if (board[dropIndex] !== null) return;
      const boardCopy = [...board];
      boardCopy[dropIndex] = board[index];
      boardCopy[index] = null;
      setBoard(boardCopy);
    } else {
      if (board[dropIndex] !== null) return;
      const newBoard = [...board];
      newBoard[dropIndex] = pieces[index];
      setBoard(newBoard);

      const newPieces = [...pieces];
      newPieces.splice(index, 1);
      setPieces(newPieces);
    }
  };

  const handleHint = () => {
    if (submitted) return;
    setShowOriginal(true);
    setTimeout(() => setShowOriginal(false), 3000);
  };

  const handleSubmit = () => {
    const isSolved = board.every((val, idx) => val === idx);
    setResultMsg(isSolved ? '🎉 Correct! Puzzle completed.' : '❌ Not correct. Keep trying!');
    setSubmitted(true);
  };

  const handleRestart = () => {
    if (!imageUrl) return;
    const order = Array.from({ length: total }, (_, i) => i);
    const shuffled = [...order].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
    setBoard(Array(total).fill(null));
    setResultMsg('');
    setSubmitted(false);
    setShowOriginal(true);
    setTimeout(() => setShowOriginal(false), 3000);
  };

  const handlePlayAgain = () => {
    if (allImages.length === 0) return;
    const randomImage = allImages[Math.floor(Math.random() * allImages.length)];
    setImageUrl(randomImage);
  };

  return (
    <div className="puzzle-page">
      <h2>🧩 Place Puzzle Game</h2>

      {imageUrl && (
        <>
          <div className="puzzle-container">
            {/* Puzzle Grid */}
            <div className="puzzle-grid">
              {board.map((val, idx) => (
                <div
                  key={idx}
                  className="drop-cell"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDrop(e, idx)}
                >
                  {val !== null ? (
                    <div
                      className="tile draggable"
                      draggable={!submitted}
                      onDragStart={(e) => onDragStart(e, true, idx)}
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundPosition: `${-(val % gridSize) * 100}px ${-Math.floor(val / gridSize) * 100}px`,
                        backgroundSize: `${gridSize * 100}px ${gridSize * 100}px`,
                      }}
                    />
                  ) : (
                    <div className="tile empty-slot" />
                  )}
                </div>
              ))}
            </div>
            {submitted && imageUrl && (
  <div className="reference-image-box">
    <h4>🖼️ Original Image:</h4>
    <img src={imageUrl} alt="original" className="reference-image" />
  </div>
)}


            {/* Pieces Panel */}
            <div className="pieces-panel">
              {pieces.map((val, i) => (
                <div
                  key={i}
                  className="tile draggable"
                  draggable={!submitted}
                  onDragStart={(e) => onDragStart(e, false, i)}
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: `${-(val % gridSize) * 100}px ${-Math.floor(val / gridSize) * 100}px`,
                    backgroundSize: `${gridSize * 100}px ${gridSize * 100}px`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="puzzle-buttons">
  <button onClick={handleHint} disabled={submitted}>💡 Hint</button>
  <button onClick={handleSubmit} disabled={submitted || board.includes(null)}>✅ Submit</button>
  <button onClick={handleRestart}>🔁 Restart</button>
</div>

{submitted && (
  <div className="play-again-wrapper">
    <button onClick={handlePlayAgain}>🔄 Play Again</button>
  </div>
)}


          {resultMsg && <p className="feedback-msg">{resultMsg}</p>}
        </>
      )}

      {showOriginal && !submitted && imageUrl && (
        <div className="original-overlay">
          <img src={imageUrl} alt="original" className="original-preview" />
          <p>👀 Preview</p>
        </div>
      )}
    </div>
    
  );
}
