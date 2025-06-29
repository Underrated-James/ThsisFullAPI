// GameOver.tsx
import React from "react";

interface GameOverProps {
  restartGame: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ restartGame }) => (
  <div className="game-over-screen" onClick={restartGame}>
    Game Over! Press any key to restart!.
  </div>
);

export default GameOver;
