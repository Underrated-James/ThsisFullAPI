import React from 'react';

type Props = {
  score: number;
  level: number;
  lines: number;
  startGame: () => void;
};

const SidePanel: React.FC<Props> = ({
  score,
  level,
  lines,
  startGame,
}) => (
  <div className="side-panel">
    <div className="score">Score: <span>{score}</span></div>
    <div className="level">Level: <span>{level}</span></div>
    <div className="lines">Lines: <span>{lines}</span></div>
    <button id="start-button" onClick={startGame}>Start Game</button>
  </div>
);

export default SidePanel;
