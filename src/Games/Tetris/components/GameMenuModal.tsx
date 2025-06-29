import React from 'react';
import '../TetrisCSS/GameMenu.css';
import { BlockStyleType } from '../utils/types'; // ✅ use only this, don't redeclare below

interface GameMenuModalProps {
  onStartGame: () => void;
  showGhost: boolean;
  setShowGhost: React.Dispatch<React.SetStateAction<boolean>>;
  blockStyle: BlockStyleType;
  setBlockStyle: React.Dispatch<React.SetStateAction<BlockStyleType>>;
  highScore: number;
}

const GameMenuModal: React.FC<GameMenuModalProps> = ({
  onStartGame,
  showGhost,
  setShowGhost,
  blockStyle,
  setBlockStyle,
  highScore,
}) => {
  return (
    <div className="menu-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="gameMenuTitle">
      <div className="menu-modal">
        <h2 id="gameMenuTitle">🎮 Tetris Game Menu</h2>

        <div className="menu-section">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showGhost}
              onChange={(e) => setShowGhost(e.target.checked)}
            />
            Show Ghost Piece
          </label>
          {!showGhost && (
            <p className="note-text">🟣 Bonus Score when Ghost is Off!</p>
          )}
        </div>

        <div className="menu-section">
          <label htmlFor="block-style-select" className="dropdown-label">Block Design:</label>
          <select
            id="block-style-select"
            value={blockStyle}
            onChange={(e) => setBlockStyle(e.target.value as BlockStyleType)}
            className="dropdown-select"
          >
            <option value="classic">Classic</option>
            <option value="bubble">Bubble</option>
            <option value="neon">Neon</option>
          </select>
        </div>

        <div className="menu-section">
          <p className="high-score-label">🏆 High Score: <span>{highScore}</span></p>
        </div>

        <button className="start-button" onClick={onStartGame}>
          ▶ Start Game
        </button>
      </div>
    </div>
  );
};

export default GameMenuModal;
