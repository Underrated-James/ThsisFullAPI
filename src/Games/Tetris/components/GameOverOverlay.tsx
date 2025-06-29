// src/Games/Tetris/components/GameOverOverlay.tsx
import React from 'react';
import '../TetrisCSS/GameOverOverlay.css'; // You'll style it here

interface Props {
  onRestart: () => void;
}

const GameOverOverlay: React.FC<Props> = ({ onRestart }) => {
  return (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <h1>Game Over</h1>
      </div>
    </div>
  );
};

export default GameOverOverlay;
