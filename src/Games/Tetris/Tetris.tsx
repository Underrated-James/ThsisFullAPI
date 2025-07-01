import React, { useEffect, useRef, useState } from 'react';
import './TetrisCSS/tetris.css';
import { BLOCK_SIZE, COLS, ROWS, colors } from './utils/constants';
import { randomPiece, Piece } from '../Tetris/utils/helpers';
import GameBoard from './components/GameBoard';
import SidePanel from './components/SidePanel';
import NextPiecePreview from './components/NextPiecePreview';
import HoldPiecePreview from './components/HoldPiecePreview';
import GameOverOverlay from './components/GameOverOverlay';
import GameMenuModal from './components/GameMenuModal';
import TetrisVoiceHandler from './components/TetrisVoiceHandler';


const rotate = (matrix: number[][]): number[][] => {
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;

  const rotated: number[][] = [];

  for (let x = 0; x < cols; x++) {
    const newRow: number[] = [];
    for (let y = rows - 1; y >= 0; y--) {
      newRow.push(matrix[y]?.[x] ?? 0); // fallback to 0 if undefined
    }
    rotated.push(newRow);
  }

  return rotated;
};

const Tetris: React.FC = () => {
  const [showMenu, setShowMenu] = useState(true); // Show menu on first load
const [showGhost, setShowGhost] = useState(true);
const [blockStyle, setBlockStyle] = useState<BlockStyleType>("classic");


type BlockStyleType = "classic" | "bubble" | "neon";

const [highScore, setHighScore] = useState(0); // You may load/save this


  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement>(null);
  const currentPieceRef = useRef<Piece | null>(null);

  // Hold piece state
  const [heldPiece, setHeldPiece] = useState<Piece | null>(null);
const [canHold, setCanHold] = useState(true); // Prevent multiple holds per drop
const holdCanvasRef = useRef<HTMLCanvasElement>(null);


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

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = COLS * BLOCK_SIZE;
      canvasRef.current.height = ROWS * BLOCK_SIZE;
    }
    if (nextCanvasRef.current) {
      nextCanvasRef.current.width = 4 * BLOCK_SIZE;
      nextCanvasRef.current.height = 4 * BLOCK_SIZE;
    }
  }, []);

  const holdCurrentPiece = () => {
  if (!currentPiece || !canHold) return;

  if (heldPiece) {
    // Swap held with current
    const temp = heldPiece;
    setHeldPiece(currentPiece);
    const resetTemp = { ...temp, x: 3, y: 0 }; // reset position
    if (!isValidMove(resetTemp.shape, resetTemp.x, resetTemp.y)) {
      setGameOver(true);
      return;
    }
    setCurrentPiece(resetTemp);
    currentPieceRef.current = resetTemp;
  } else {
    // First time hold
    setHeldPiece(currentPiece);
    const fresh = nextPiece || randomPiece();
    const newNext = randomPiece();
    setCurrentPiece({ ...fresh, x: 3, y: 0 });
    currentPieceRef.current = fresh;
    setNextPiece(newNext);
  }

  setCanHold(false); // disable further holding until piece is locked
};


  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(gameLoop, 1000 / level);
      return () => clearInterval(interval);
    }
  }, [gameStarted, currentPiece, level, gameOver]);

  const drawBlock = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  colorKey: string,
  style: 'classic' | 'bubble' | 'neon' = 'classic',
  options?: { alpha?: number; offsetX?: number; offsetY?: number }
) => {
  const color = colors[colorKey] ?? '#000';
  const px = (options?.offsetX ?? 0) + x * BLOCK_SIZE;
  const py = (options?.offsetY ?? 0) + y * BLOCK_SIZE;
  const alpha = options?.alpha ?? 1;

  ctx.save();
  ctx.globalAlpha = alpha;

  switch (style) {
    case 'bubble':
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px + BLOCK_SIZE / 2, py + BLOCK_SIZE / 2, BLOCK_SIZE / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.stroke();
      break;
    case 'neon':
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
      break;
    case 'classic':
    default:
      ctx.fillStyle = color;
      ctx.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
      break;
  }

  ctx.restore();
};

const draw = () => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw main grid
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = grid[row]?.[col];
      if (cell) {
        drawBlock(ctx, col, row, cell, blockStyle);
      }
    }
  }

  // Draw ghost piece
  if (currentPiece && showGhost) {
    const ghostY = (() => {
      let y = currentPiece.y;
      while (isValidMove(currentPiece.shape, currentPiece.x, y + 1)) {
        y++;
      }
      return y;
    })();

    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          drawBlock(
            ctx,
            currentPiece.x + x,
            ghostY + y,
            currentPiece.class,
            blockStyle,
            { alpha: 0.3 }
          );
        }
      });
    });
  }

  // Draw current falling piece
  if (currentPiece) {
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          drawBlock(ctx, currentPiece.x + x, currentPiece.y + y, currentPiece.class, blockStyle);
        }
      });
    });
  }

  // Centered piece previews
  const drawCenteredPiece = (
    previewCtx: CanvasRenderingContext2D,
    pieceShape: number[][],
    blockSize: number,
    canvasSize: number,
    colorKey: string
  ) => {
    previewCtx.clearRect(0, 0, canvasSize, canvasSize);
    const pieceHeight = pieceShape.length;
    const pieceWidth = pieceShape[0]!.length;

    let minX = pieceWidth, maxX = 0, minY = pieceHeight, maxY = 0;
    for (let y = 0; y < pieceHeight; y++) {
      for (let x = 0; x < pieceWidth; x++) {
        if (pieceShape[y]![x]) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }

    const shapeWidth = (maxX - minX + 1) * blockSize;
    const shapeHeight = (maxY - minY + 1) * blockSize;
    const offsetX = (canvasSize - shapeWidth) / 2 - minX * blockSize;
    const offsetY = (canvasSize - shapeHeight) / 2 - minY * blockSize;

    for (let y = 0; y < pieceHeight; y++) {
      for (let x = 0; x < pieceWidth; x++) {
        if (pieceShape[y]![x]) {
          drawBlock(
            previewCtx,
            x,
            y,
            colorKey,
            blockStyle,
            { offsetX, offsetY }
          );
        }
      }
    }
  };

  const nextCtx = nextCanvasRef.current?.getContext('2d');
  if (nextCtx && nextPiece?.shape) {
    drawCenteredPiece(nextCtx, nextPiece.shape, BLOCK_SIZE, 4 * BLOCK_SIZE, nextPiece.class);
  }

  const holdCtx = holdCanvasRef.current?.getContext('2d');
  if (holdCtx && heldPiece?.shape) {
    drawCenteredPiece(holdCtx, heldPiece.shape, BLOCK_SIZE, 4 * BLOCK_SIZE, heldPiece.class);
  }
};





  const isValidMove = (shape: number[][], offsetX: number, offsetY: number): boolean => {
    return shape.every((row, y) =>
      row.every((cell, x) => {
        if (!cell) return true;
        const newX = offsetX + x;
        const newY = offsetY + y;
        return (
          newX >= 0 &&
          newX < COLS &&
          newY < ROWS &&
          (newY < 0 || grid[newY]?.[newX] === '')
        );
      })
    );
  };

  const lockPiece = (piece: Piece = currentPiece!) => {
  if (!piece) return;

  const newGrid = grid.map(row => [...row]);

  // Lock the piece into the grid
  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const gx = piece.x + x;
        const gy = piece.y + y;
        if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS && newGrid[gy]) {
          newGrid[gy][gx] = piece.class;
        }
      }
    });
  });

  // Clear completed lines
  let linesCleared = 0;
  const updatedGrid = newGrid.filter(row => {
    if (row.every(cell => cell)) {
      linesCleared++;
      return false;
    }
    return true;
  });

  // Fill missing rows at the top
  while (updatedGrid.length < ROWS) {
    updatedGrid.unshift(Array(COLS).fill(''));
  }

  // Calculate base score and ghost piece bonus
  const baseScore = linesCleared * 100;
  const ghostBonus = !showGhost ? linesCleared * 25 : 0;
  const totalScoreGain = baseScore + ghostBonus;

  // Update score
  setScore(prev => {
    const newScore = prev + totalScoreGain;

    // Save to localStorage if new high score
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('tetrisHighScore', newScore.toString());
    }

    return newScore;
  });

  // Update lines and level
  const newLines = lines + linesCleared;
  setLines(newLines);
  setLevel(1 + Math.floor(newLines / 10));

  // Update the grid
  setGrid(updatedGrid);

  // Spawn next piece
  const newPiece = nextPiece || randomPiece();
  const freshNext = randomPiece();
  setCurrentPiece(newPiece);
  setNextPiece(freshNext);
  currentPieceRef.current = newPiece;

  // Check for game over
  if (!isValidMove(newPiece.shape, newPiece.x, newPiece.y)) {
    setGameOver(true);
    setGameStarted(false);

    // Save high score again just in case
    const storedHigh = parseInt(localStorage.getItem('tetrisHighScore') || '0', 10);
    const finalScore = score + totalScoreGain;
    if (finalScore > storedHigh) {
      setHighScore(finalScore);
      localStorage.setItem('tetrisHighScore', finalScore.toString());
    }
  }

  setCanHold(true);
};




  const gameLoop = () => {
    if (!currentPiece) return;
    const newY = currentPiece.y + 1;
    if (isValidMove(currentPiece.shape, currentPiece.x, newY)) {
      setCurrentPiece(prev => prev && { ...prev, y: newY });
      currentPieceRef.current = { ...currentPiece, y: newY };
    } else {
      lockPiece();
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
  if (!currentPiece || gameOver) return;

  let newX = currentPiece.x;
  let newY = currentPiece.y;
  let newShape = currentPiece.shape;

  switch (e.key) {
    case 'ArrowLeft':
      newX--;
      break;
    case 'ArrowRight':
      newX++;
      break;
    case 'ArrowDown':
      newY++;
      break;
    case 'ArrowUp':
      newShape = rotate(currentPiece.shape);
      break;
    case ' ':
      e.preventDefault(); // Prevent space scrolling the page
      performHardDrop();
      return;
    case 'Shift':
      holdCurrentPiece();
      return;
    default:
      return;
  }

  if (isValidMove(newShape, newX, newY)) {
    const updatedPiece = { ...currentPiece, x: newX, y: newY, shape: newShape };
    setCurrentPiece(updatedPiece);
    currentPieceRef.current = updatedPiece;
  }
};



const performHardDrop = () => {
  if (!currentPiece) return;

  let dropY = currentPiece.y;
  while (isValidMove(currentPiece.shape, currentPiece.x, dropY + 1)) {
    dropY++;
  }

  const droppedPiece = {
    ...currentPiece,
    y: dropY
  };

  lockPiece(droppedPiece);
};



useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => handleKeyPress(e);
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [currentPiece, grid, gameOver]);

const startGame = () => {
  const newPiece = randomPiece();
  const freshNext = randomPiece();

  setScore(0);
  setLevel(1);
  setLines(0);
  setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill('')));
  setCurrentPiece(newPiece);
  setNextPiece(freshNext);
  currentPieceRef.current = newPiece;

  // Reset hold functionality
  setHeldPiece(null);
  setCanHold(true);

  // Reset game state flags
  setGameOver(false);
  setGameStarted(true);

};


  useEffect(() => {
    draw();
  }, [grid, currentPiece, nextPiece]);


  

useEffect(() => {
  if (gameStarted && !gameOver && !showMenu) {
    const interval = setInterval(gameLoop, 1000 / level);
    return () => clearInterval(interval);
  }
}, [gameStarted, currentPiece, level, gameOver, showMenu]);


useEffect(() => {
  if (gameOver) {
    const timeout = setTimeout(() => {
      setGameOver(false);    // Hide the GameOverOverlay
      setShowMenu(true);     // Show the GameMenuModal
    }, 2000); // 1 second delay

    return () => clearTimeout(timeout); // cleanup
  } 
}, [gameOver]);

useEffect(() => {
  if (score > highScore) {
    setHighScore(score);
    localStorage.setItem('tetrisHighScore', score.toString());
  }
}, [score]);

useEffect(() => {
  const storedHigh = parseInt(localStorage.getItem('tetrisHighScore') || '0', 10);
  setHighScore(storedHigh);
}, []);

return (
  <div className="game-container" style={{ position: 'relative' }}>
    {/* 🎙️ Tetris Voice Commands */}
    <TetrisVoiceHandler
      showGhost={showGhost}
  setShowGhost={setShowGhost}
  blockStyle={blockStyle}
  setBlockStyle={setBlockStyle}
      
    />

    {/* 📋 Game Menu Modal */}
    {showMenu && (
      <GameMenuModal
        onStartGame={() => {
          startGame();
          setShowMenu(false);
        }}
        showGhost={showGhost}
        setShowGhost={setShowGhost}
        blockStyle={blockStyle}
        setBlockStyle={setBlockStyle}
        highScore={highScore}
      />
    )}

    {/* 🎮 Main Game Board */}
    <GameBoard canvasRef={canvasRef} />

    {/* ❌ Game Over Overlay */}
    {gameOver && <GameOverOverlay onRestart={startGame} />}

    {/* 👉 Right Side Panel */}
    <div className="side-panel">
      {/* 🛑 Hold Preview */}
      <div className="hold-preview">
        <HoldPiecePreview holdCanvasRef={holdCanvasRef} />
      </div>

      {/* ⏭️ Next Piece Preview */}
      <div className="preview-container">
        <h3>Next</h3>
        <NextPiecePreview nextCanvasRef={nextCanvasRef} />
      </div>

      {/* 📊 Score Panel */}
      <SidePanel
        score={score}
        level={level}
        lines={lines}
        startGame={() => setShowMenu(true)} // Opens the menu modal
      />
    </div>
  </div>
);

   
};

export default Tetris;
