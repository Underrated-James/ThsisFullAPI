import React from 'react';

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
};


const GameBoard: React.FC<Props> = ({ canvasRef }) => {
  return <canvas ref={canvasRef} id="game-board" />;
};

export default GameBoard;
