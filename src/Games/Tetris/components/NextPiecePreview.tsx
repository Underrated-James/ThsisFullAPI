import React from 'react';

type Props = {
  nextCanvasRef: React.RefObject<HTMLCanvasElement | null>;
};


const NextPiecePreview: React.FC<Props> = ({ nextCanvasRef }) => (
  <div className="next-piece">
    <canvas ref={nextCanvasRef} id="next-piece" />
  </div>
);

export default NextPiecePreview;
