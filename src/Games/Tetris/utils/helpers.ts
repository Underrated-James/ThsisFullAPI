import { COLS } from './constants';
import { shapes } from './shapes';

export type Piece = {
  shape: number[][];
  class: string;
  x: number;
  y: number;
};

export const randomPiece = (): Piece => {
  const index = Math.floor(Math.random() * shapes.length);
  const selected = shapes[index]!;
  const shapeCopy = selected.shape.map(row => [...row]);
  const x = Math.floor(COLS / 2) - Math.ceil(shapeCopy[0].length / 2);

  return {
    shape: shapeCopy,
    class: selected.class,
    x,
    y: 0
  };
};

export const rotate = (matrix: number[][]): number[][] => {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;

  const rotated: number[][] = [];

  for (let x = 0; x < cols; x++) {
    const newRow: number[] = [];
    for (let y = rows - 1; y >= 0; y--) {
      newRow.push(matrix[y]?.[x] ?? 0);
    }
    rotated.push(newRow);
  }

  return rotated;
};
