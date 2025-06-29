import React, { useEffect, useRef, useState } from 'react';
import './TetrisCSS/tetris.css';

const BLOCK_SIZE = 30;
const ROWS = 20;
const COLS = 10;


const colors: Record<string, string> = {
  'piece-i': '#00f0f0',
  'piece-o': '#f0f000',
  'piece-t': '#a000f0',
  'piece-j': '#0000f0',
  'piece-z': '#f00000',
  'piece-l': '#f0a000',
  'piece-s': '#00f000',
};

const shapes: { shape: number[][]; class: string }[] = [
  { shape: [[1, 1, 1, 1]], class: 'piece-i' },
  { shape: [[1, 1], [1, 1]], class: 'piece-o' },
  { shape: [[1, 1, 1], [0, 1, 0]], class: 'piece-t' },
  { shape: [[1, 1, 1], [1, 0, 0]], class: 'piece-j' },
  { shape: [[0, 1, 1], [1, 1, 0]], class: 'piece-z' },
  { shape: [[1, 1, 1], [0, 0, 1]], class: 'piece-l' },
  { shape: [[1, 1, 0], [0, 1, 1]], class: 'piece-s' },
];

type Piece = {
  shape: number[][];
  class: string;
  x: number;
  y: number;
};

const Tetris: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement>(null);
  const currentPieceRef = useRef<Piece | null>(null);


  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(''))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const dropIntervalRef = useRef(1000);
  const lastTimeRef = useRef(0);
  const dropCounterRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = COLS * BLOCK_SIZE;
      canvas.height = ROWS * BLOCK_SIZE;
    }
    const nextCanvas = nextCanvasRef.current;
    if (nextCanvas) {
      nextCanvas.width = 4 * BLOCK_SIZE;
      nextCanvas.height = 4 * BLOCK_SIZE;
    }
  }, []);

  const drawBlock = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    className: string
  ) => {
    ctx.fillStyle = colors[className] || '#fff';
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);

  // Draw locked grid pieces
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const val = grid[y]?.[x];
      if (val) {
        drawBlock(ctx, x, y, val); // val is a className like 'piece-i'
      }
    }
  }

  // ✅ Use currentPieceRef instead of currentPiece to ensure accurate position
  const activePiece = currentPieceRef.current;
  if (activePiece) {
    const { shape, x: px, y: py, class: cls } = activePiece;
    shape.forEach((row, y) =>
      row.forEach((val, x) => {
        if (val) drawBlock(ctx, px + x, py + y, cls);
      })
    );
  }
};

  const gameLoop = (time: number) => {
  console.log('Piece Y position:', currentPieceRef.current?.y);

  const deltaTime = time - lastTimeRef.current;
  lastTimeRef.current = time;
  dropCounterRef.current += deltaTime;

  const ctx = canvasRef.current?.getContext('2d');
  if (ctx) draw(ctx);

  if (dropCounterRef.current > dropIntervalRef.current) {
    dropCounterRef.current = 0;

    const curr = currentPieceRef.current;
    if (curr) {
      const movedPiece = { ...curr, y: curr.y + 1 };
      if (isValidMove(movedPiece)) {
        setCurrentPiece(movedPiece);
        currentPieceRef.current = movedPiece; // ✅ keep ref in sync
      } else {
        lockPiece(curr); // ✅ use ref version
      }
    }
  }

  if (gameStarted && !gameOver) {
    requestAnimationFrame(gameLoop); // Keep loop running
  }
};



useEffect(() => {
  if (gameStarted) {
    lastTimeRef.current = performance.now();
    dropCounterRef.current = 0;
    requestAnimationFrame(gameLoop);
  }
}, [gameStarted]);



  const startGame = () => {
  console.log("Game started");
  const firstPiece = randomPiece();
  const next = randomPiece();

  setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill('')));
  setScore(0);
  setLevel(1);
  setLines(0);
  setGameOver(false);
  setCurrentPiece(firstPiece);
  currentPieceRef.current = firstPiece; // ✅ keep ref in sync
  setNextPiece(next);
  setGameStarted(true);

  lastTimeRef.current = performance.now();
  dropCounterRef.current = 0;
  requestAnimationFrame(gameLoop); // Start loop here
};



  const randomPiece = (): Piece => {
  if (shapes.length === 0) {
    throw new Error("Shapes array is empty");
  }

  const index = Math.floor(Math.random() * shapes.length);
  const selected = shapes[index];

  if (!selected) {
    throw new Error("Failed to get a valid piece from shapes array.");
  }

  const shapeCopy = selected.shape.map(row => [...row]);

  const firstRow = shapeCopy[0] ?? [];
  const x = Math.floor(COLS / 2) - Math.ceil(firstRow.length / 2);

  return {
    shape: shapeCopy,
    class: selected.class,
    x,
    y: 0
  };
};

const isValidMove = (piece: Piece | null, offsetX = 0, offsetY = 0): boolean => {
  if (!piece) return false;

  const { shape, x: px, y: py } = piece;

  for (let y = 0; y < shape.length; y++) {
    const row = shape[y];
    if (!row) continue; // safeguard

    for (let x = 0; x < row.length; x++) {
      if (row[x]) {
        const newX = px + x + offsetX;
        const newY = py + y + offsetY;

        if (
          newX < 0 ||
          newX >= COLS ||
          newY >= ROWS ||
          (newY >= 0 && grid?.[newY]?.[newX])
        ) {
          return false;
        }
      }
    }
  }

  return true;
};

const lockPiece = (piece: Piece | null) => {
  if (!piece) return;

  const { shape, x: px, y: py, class: cls } = piece;

  // Defensive check to avoid grid being undefined
  if (!shape || !grid) return;

  const newGrid = grid.map(row => [...row]);

  shape.forEach((row, y) => {
    row?.forEach((val, x) => {
      const boardY = py + y;
      const boardX = px + x;

      // Ensure target position is within bounds before writing
      if (
        val &&
        boardY >= 0 &&
        boardY < ROWS &&
        boardX >= 0 &&
        boardX < COLS &&
        newGrid[boardY]
      ) {
        newGrid[boardY][boardX] = cls;
      }
    });
  });

  setGrid(newGrid);

  const next = nextPiece ?? randomPiece();
  const shape0 = next.shape?.[0] ?? [];
  const offsetX = Math.ceil(shape0.length / 2);
  const newPiece: Piece = {
    ...next,
    x: Math.floor(COLS / 2) - offsetX,
    y: 0,
  };

  if (!isValidMove(newPiece)) {
    setGameOver(true);
    setGameStarted(false);
    alert("Game Over");
  } else {
    setCurrentPiece(newPiece);
    currentPieceRef.current = newPiece; // ✅ keep ref in sync
    setNextPiece(randomPiece());
  }
};


return (
    <div className="game-container">
      <canvas ref={canvasRef} id="game-board" />
      <div className="side-panel">
        <div className="next-piece">
          <span className="next">Next</span>
          <canvas ref={nextCanvasRef} id="next-piece" />
        </div>
        <div className="score">Score: <span>{score}</span></div>
        <div className="level">Level: <span>{level}</span></div>
        <div className="lines">Lines: <span>{lines}</span></div>
        <button onClick={startGame}>Start Game</button>
      </div>
    </div>
  );
};

export default Tetris;
