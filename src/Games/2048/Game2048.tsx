import React, { useState } from 'react';
import './app.scss'; // Global styles
import Game2048VoiceHandler from "./components/Game2048VoiceHandler";

import { animationDuration, gridGap } from './config';
import ModalHeader from './components/header'; // This is now a modal
import Board from './components/board';
import Info from './components/info';
import BoardSizePicker from './components/boardSizePicker';

const Game2048: React.FC = () => {
  const [showHeader, setShowHeader] = useState(false);

  return (
    <div className="legacy2048">
      {/* ✅ Enable voice commands */}
      <Game2048VoiceHandler />

      <div
        className="app"
        style={
          {
            '--animation-duration': `${animationDuration}ms`,
            '--grid-gap': gridGap,
          } as React.CSSProperties
        }
      >
        {showHeader && (
          <div className="modal-overlay">
            <div className="modal-box">
              <button className="modal-close-button" onClick={() => setShowHeader(false)}>
                ✕
              </button>
              <ModalHeader onClose={() => setShowHeader(false)} />
            </div>
          </div>
        )}

        <div className="page">
          <button
            className="header-modal-toggle"
            onClick={() => setShowHeader(true)}
          >
            Show Game Info
          </button>

          <Board />
          <BoardSizePicker />
        </div>
<div className='info-container'>
  <Info />
</div>
      
      </div>
    </div>
  );
};

export default Game2048;
