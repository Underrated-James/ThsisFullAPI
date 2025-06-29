// HoldPiecePreview.tsx
import React from 'react';

type Props = {
  holdCanvasRef: React.RefObject<HTMLCanvasElement | null>;
};

const HoldPiecePreview: React.FC<Props> = ({ holdCanvasRef }) => (
  <div className="preview-container hold-preview">
    <h3>Hold</h3>
    <canvas ref={holdCanvasRef} width={120} height={120} />
  </div>
);

export default HoldPiecePreview;
