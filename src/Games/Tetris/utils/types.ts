// types.ts

// Define allowed block styles
export type BlockStyleType = "classic" | "bubble" | "neon";

// Tetris piece structure
export interface Piece {
  shape: number[][];
  x: number;
  y: number;
  color: string;
}
