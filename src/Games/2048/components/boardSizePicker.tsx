import React from 'react';
import { useDispatch } from 'react-redux';
import { resetAction } from '../Actions';

import { supportedBoardSizes } from '../config';
import type { AppDispatch } from '../store';

const BoardSizePicker: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <h2>Board size</h2>
      <div className="size-picker">
        {supportedBoardSizes.map(size => (
          <button key={size} onClick={() => dispatch(resetAction(size))}>
            {size}x{size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BoardSizePicker;
