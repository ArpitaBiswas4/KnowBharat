import React, { useEffect, useState } from 'react';
import usePlaceData from '../Hooks/usePlaceData';
import useFoodData from '../Hooks/useFoodData';
import useFestivalData from '../Hooks/useFestivalData';
import useWearData from '../Hooks/useWearData';
import '../Css/Puzzle.css';
import WinningAnimation from '../Components/WinningAnimation'; // 🎉 Import animation

export default function PuzzlePage() {
  const placeData = usePlaceData(null, true);
  const foodData = useFoodData(null, true);
  const festivalData = useFestivalData(null, true);
  const wearData = useWearData(null, true);

  const [imageUrl, setImageUrl] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [board, setBoard] = useState([]);
  const [showOriginal, setShowOriginal] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [puzzleReady, setPuzzleReady] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false); // ✅ Win animation

  const gridSize = 3;
  const total = gridSize * gridSize;

  const isImageSuitable = (img) =>
    img.width >= 300 &&
    img.height >= 300 &&
    Math.abs(img.width - img.height) < 100;

  const pickSuitableImage = async (imageList) => {
    const tried = new Set();
    let validImage = null;

    while (tried.size < imageList.length) {
      const randomImage = imageList[Math.floor(Math.random() * imageList.length)];
      if (tried.has(randomImage)) continue;
      tried.add(randomImage);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = randomImage;

      const isValid = await new Promise((resolve) => {
        img.onload = () => resolve(isImageSuitable(img));
        img.onerror = () => resolve(false);
      });

      if (isValid) {
        validImage = randomImage;
        break;
      }
    }

    setImageUrl(validImage);
  };

  useEffect(() => {
    const allData = [
      ...(placeData || []),
      ...(foodData || []),
      ...(festivalData || []),
      ...(wearData || [])
    ];

    const images = allData
      .map((item) => item.image || item.imageUrl)
      .filter(Boolean);

    setAllImages(images);
    if (images.length > 0) {
      pickSuitableImage(images);
    }
  }, [placeData, foodData, festivalData, wearData]);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const order = Array.from({ length: total }, (_, i) => i);
      const shuffled = [...order].sort(() => Math.random() - 0.5);
      setPieces(shuffled);
      setBoard(Array(total).fill(null));
      setSubmitted(false);
      setResultMsg('');
      setShowOriginal(true);
      setPuzzleReady(true);
      setTimeout(() => setShowOriginal(false), 3000);
    };
    img.onerror = () => {
      setPuzzleReady(false);
    };
    img.src = imageUrl;
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

    const boardCopy = [...board];

    if (fromGrid) {
      if (board[dropIndex] !== null) return;
      boardCopy[dropIndex] = board[index];
      boardCopy[index] = null;
    } else {
      if (board[dropIndex] !== null) return;
      boardCopy[dropIndex] = pieces[index];
      const newPieces = [...pieces];
      newPieces.splice(index, 1);
      setPieces(newPieces);
    }

    setBoard(boardCopy);
  };

  const handleHint = () => {
    if (submitted) return;
    setShowOriginal(true);
    setTimeout(() => setShowOriginal(false), 3000);
  };

  const handleSubmit = () => {
    const isSolved = board.every((val, idx) => val === idx);
    if (isSolved) {
      setResultMsg('🎉 Correct! Puzzle completed.');
      setShowWinAnimation(true);
      setTimeout(() => setShowWinAnimation(false), 4000);
    } else {
      setResultMsg('❌ Not correct. Keep trying!');
    }
    setSubmitted(true);
  };

  const handleRestart = () => {
  if (!imageUrl) return;

  const order = Array.from({ length: total }, (_, i) => i);
  const shuffled = [...order].sort(() => Math.random() - 0.5);

  setPieces(shuffled);
  setBoard(Array(total).fill(null));
  setSubmitted(false);
  setResultMsg('');
  setShowOriginal(true);
  setShowWinAnimation(false);
  setPuzzleReady(true);

  setTimeout(() => setShowOriginal(false), 3000);
};



  const handlePlayAgain = () => {
    window.location.reload();
    setSubmitted(false);
  };

  return (
    <div className="puzzle-page">
      <h2>🧩 Place Puzzle Game 🧩</h2>
      <div className="instructions">
      <button onClick={handleHint} disabled={submitted} className="hint-icon">Hint</button>

      <button onClick={handleRestart} className='try-again-button'>Restart</button>
      </div>
      {resultMsg && (
  <p className={`feedback-msg ${resultMsg.includes('Correct') ? 'feedback-success' : 'feedback-error'}`}>
    {resultMsg}
  </p>
)}

      {puzzleReady && imageUrl && (
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

            {submitted && (
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
            <button onClick={handleSubmit} disabled={submitted || board.includes(null)} className='submit-button'>Submit</button>
            
            {submitted && (
              <button onClick={handlePlayAgain} className='try-again-button'>Play Again</button>
            )}
          </div>
        </>
      )}

      {puzzleReady && showOriginal && !submitted && imageUrl && (
        <div className="original-overlay">
          <img src={imageUrl} alt="original" className="original-preview" />
          <p>👀 Preview</p>
        </div>
      )}

      {/* 🎉 Win Animation */}
      {showWinAnimation && <WinningAnimation />}
    </div>
  );
}
