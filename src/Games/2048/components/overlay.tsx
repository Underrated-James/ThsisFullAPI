import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { dismissAction, resetAction } from '../Actions';
import { StateType } from '../reducers';
import type { AppDispatch } from '../store'; // ✅ Import the correct dispatch type

const Overlay: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // ✅ Properly typed dispatch

  const reset = useCallback(() => dispatch(resetAction()), [dispatch]);
  const dismiss = useCallback(() => dispatch(dismissAction()), [dispatch]);

  const defeat = useSelector((state: StateType) => state.defeat);
  const victory = useSelector(
    (state: StateType) => state.victory && !state.victoryDismissed
  );

  if (victory) {
    return (
      <div className="overlay overlay-victory">
        <h1>You win!</h1>
        <div className="overlay-buttons">
          <button onClick={dismiss}>Keep going</button>
          <button onClick={reset}>Try again</button>
        </div>
      </div>
    );
  }

  if (defeat) {
    return (
      <div className="overlay overlay-defeat">
        <h1>Game over!</h1>
        <div className="overlay-buttons">
          <button onClick={reset}>Try again</button>
        </div>
      </div>
    );
  }

  return null;
};

export default Overlay;
