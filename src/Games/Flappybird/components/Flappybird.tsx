import React, { useEffect, useState, useRef } from "react";
import "../FlappyCSS/style.css";
import GameModal from "./GameModal";
import FlappyBirdVoiceHandler from "../components/FlappyBirdVoiceHandler";

import bgDay from "../images/background-day.png";
import bgNight from "../images/background-night.png";
import pipeGreen from "../images/pipe-green.png";
import pipePurple from "../images/pipe-red.png";
import yellowBird from "../images/yellowbird-upflap.png";
import redBird from "../images/redbird-downflap.png";
import blueBird from "../images/Bird-1.png";

import jumpSoundFile from "../Audio/assets_audio_wing-pygbag.ogg";
import pointSoundFile from "../Audio/assets_audio_point-pygbag.ogg";
import hitSoundFile from "../Audio/assets_audio_hit.wav";

const [BIRD_HEIGHT, BIRD_WIDTH, WALL_HEIGHT, WALL_WIDTH, BASE_HEIGHT, OBJ_WIDTH, OBJ_GAP] = [28, 33, 600, 400, 112, 52, 170];
const [GRAVITY, JUMP_STRENGTH, OBJ_SPEED, PIPE_SPAWN_INTERVAL] = [0.8, -10, 3.5, 1700];

interface Pipe {
  id: number;
  x: number;
  height: number;
  passed?: boolean;
}

let pipeCounter = 0;

const Game: React.FC = () => {
  const [isStart, setIsStart] = useState(false);
  const [birdPos, setBirdPos] = useState(300);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [birdColor, setBirdColor] = useState<"yellow" | "red" | "blue">("yellow");
  const [nightMode, setNightMode] = useState(false);

  const pipesRef = useRef<Pipe[]>([]);
  const jumpSoundRef = useRef<HTMLAudioElement | null>(null);
  const pointSoundRef = useRef<HTMLAudioElement | null>(null);
  const hitSoundRef = useRef<HTMLAudioElement | null>(null);
  const soundEnabledRef = useRef(true);
  


  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const playSound = (ref: React.RefObject<HTMLAudioElement | null>) => {
    if (soundEnabledRef.current && ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch((e) => console.warn("Sound error:", e));
    }
  };

  const generateRandomHeight = () =>
    Math.floor(Math.random() * (WALL_HEIGHT - BASE_HEIGHT - OBJ_GAP - 100)) + 50;

  const resetGame = () => {
    setIsStart(false);
    setBirdPos(300);
    setBirdVelocity(0);
    setScore(0);
    pipesRef.current = [];
    setPipes([]);
    pipeCounter = 0;
  };

  const handleJump = () => {
    if (!isStart) setIsStart(true);
    setBirdVelocity(JUMP_STRENGTH);
    playSound(jumpSoundRef);
  };

  useEffect(() => {
    if (!isStart) return;
    const gravityInterval = setInterval(() => {
      setBirdVelocity((v) => v + GRAVITY);
      setBirdPos((pos) =>
        Math.min(pos + birdVelocity, WALL_HEIGHT - BASE_HEIGHT - BIRD_HEIGHT)
      );
    }, 24);
    return () => clearInterval(gravityInterval);
  }, [isStart, birdVelocity]);

  useEffect(() => {
    if (!isStart) return;
    const moveInterval = setInterval(() => {
      pipesRef.current = pipesRef.current
        .map((pipe) => ({ ...pipe, x: pipe.x - OBJ_SPEED }))
        .filter((pipe) => pipe.x + OBJ_WIDTH > 0);
      setPipes([...pipesRef.current]);
    }, 24);
    return () => clearInterval(moveInterval);
  }, [isStart]);

  useEffect(() => {
    if (!isStart) return;
    const spawnInterval = setInterval(() => {
      const height = generateRandomHeight();
      pipesRef.current.push({
        id: pipeCounter++,
        x: WALL_WIDTH + Math.random() * 50 + 100,
        height,
        passed: false,
      });
      setPipes([...pipesRef.current]);
    }, PIPE_SPAWN_INTERVAL);
    return () => clearInterval(spawnInterval);
  }, [isStart]);

  useEffect(() => {
    if (!isStart) return;

    const birdTop = birdPos;
    const birdBottom = birdPos + BIRD_HEIGHT;
    const birdX = 100;

    let didCollide = false;

    pipesRef.current.forEach((pipe) => {
      const pipeTop = pipe.height;
      const pipeBottom = pipe.height + OBJ_GAP;
      const inRange = pipe.x < birdX + BIRD_WIDTH && pipe.x + OBJ_WIDTH > birdX;

      if (inRange && (birdTop < pipeTop || birdBottom > pipeBottom)) {
        didCollide = true;
      }

      if (!pipe.passed && pipe.x + OBJ_WIDTH < birdX) {
        pipe.passed = true;
        setScore((s) => s + 1);
        playSound(pointSoundRef);
      }
    });

    if (didCollide || birdBottom >= WALL_HEIGHT - BASE_HEIGHT) {
      playSound(hitSoundRef);
      resetGame();
    }
  }, [birdPos]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") handleJump();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const getBirdImage = () => {
    switch (birdColor) {
      case "red":
        return redBird;
      case "blue":
        return blueBird;
      default:
        return yellowBird;
    }
  };

  const toggleNightMode = () => setNightMode((prev) => !prev);
  const toggleSound = () => setSoundEnabled((prev) => !prev);
  const changeBirdColor = (color: "red" | "blue" | "yellow") => setBirdColor(color);

  return (
    <div className="home">
      <FlappyBirdVoiceHandler
        onToggleNightMode={toggleNightMode}
        onSetNightMode={(isNight) => setNightMode(isNight)}
        onToggleSound={toggleSound}
        onChangeBirdColor={changeBirdColor}
      />

      <div className="score">🏆: {score}</div>

      <audio ref={jumpSoundRef} src={jumpSoundFile} preload="auto" />
      <audio ref={pointSoundRef} src={pointSoundFile} preload="auto" />
      <audio ref={hitSoundRef} src={hitSoundFile} preload="auto" />

      <div
        className="background"
        style={{ backgroundImage: `url(${nightMode ? bgNight : bgDay})` }}
      >
        {!isStart && (
          <div className="startboard">
            Press <span className="highlight">SPACE</span> to Start
            <GameModal
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              birdColor={birdColor}
              setBirdColor={setBirdColor}
              nightMode={nightMode}
              setNightMode={setNightMode}
            />
          </div>
        )}

        {pipes.map(({ id, x, height }) => (
          <React.Fragment key={id}>
            <img
              src={nightMode ? pipePurple : pipeGreen}
              className="pipe top-pipe"
              style={{ height, left: x }}
            />
            <img
              src={nightMode ? pipePurple : pipeGreen}
              className="pipe bottom-pipe"
              style={{
                height: WALL_HEIGHT - BASE_HEIGHT - OBJ_GAP - height,
                left: x,
              }}
            />
          </React.Fragment>
        ))}

        <img
          src={getBirdImage()}
          alt="Flappy Bird"
          className="bird"
          style={{ top: birdPos, width: BIRD_WIDTH, height: BIRD_HEIGHT }}
        />
        <div className="base" />
      </div>
    </div>
  );
};

export default Game;
