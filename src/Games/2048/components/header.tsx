// components/ModalHeader.tsx
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetAction, undoAction } from '../Actions';
import { StateType } from '../reducers';
import type { AppDispatch } from '../store';

interface ModalHeaderProps {
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  const reset = useCallback(() => {
    dispatch(resetAction());
    onClose();
  }, [dispatch, onClose]);

  const undo = useCallback(() => dispatch(undoAction()), [dispatch]);

  const score = useSelector((state: StateType) => state.score);
  const scoreIncrease = useSelector((state: StateType) => state.scoreIncrease);
  const moveId = useSelector((state: StateType) => state.moveId);
  const best = useSelector((state: StateType) => state.best);
  const previousBoard = useSelector((state: StateType) => state.previousBoard);

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        
        <h1>2048</h1>
        <div className="modal-scores">
          <div>
            <strong>Score:</strong> {score}
            {!!scoreIncrease && (
              <span className="score-increase" key={moveId}> +{scoreIncrease} </span>
            )}
          </div>
          <div><strong>Best:</strong> {best}</div>
        </div>
        <p>Join the numbers and get to the <strong>2048 tile!</strong></p>
        <div className="modal-buttons">
          <button onClick={undo} disabled={!previousBoard}>Undo</button>
          <button onClick={reset}>New game</button>
        </div>
      </div>
    </div>
  );
};

export default ModalHeader;
