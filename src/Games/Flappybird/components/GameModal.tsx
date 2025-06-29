// GameModal.tsx
import React from "react";
import "../FlappyCSS/GameModal.css";

import yellowBird from "../images/yellowbird-upflap.png";
import redBird from "../images/redbird-downflap.png";
import blueBird from "../images/Bird-1.png";

interface GameModalProps {
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  birdColor: "yellow" | "red" | "blue"; // Restrict birdColor to specific colors
  setBirdColor: (color: "yellow" | "red" | "blue") => void; // Restrict setBirdColor to specific colors
  nightMode: boolean;
  setNightMode: (value: boolean) => void;
}

const GameModal: React.FC<GameModalProps> = ({
  soundEnabled,
  setSoundEnabled,
  birdColor,
  setBirdColor,
  nightMode,
  setNightMode,
}) => {
  return (
    <div className="game-modal">
      <h2>🎮 Game Settings</h2>

      <div className="toggle-group">
        <label>🔈 Sound:</label>
        <button onClick={(e) => {
          e.stopPropagation();
          setSoundEnabled(!soundEnabled);
        }}>
          {soundEnabled ? "On 🔊" : "Off 🔇"}
        </button>
      </div>

      <div className="select-box">
        <label>
          <img
            src={birdColor === "red" ? redBird : birdColor === "blue" ? blueBird : yellowBird}
            style={{ width: "30px", height: "30px" }}
            alt="Bird"
          />
             Bird Color:
        </label>
        <select
          value={birdColor}
          onChange={(e) => setBirdColor(e.target.value as "yellow" | "red" | "blue")} // Cast the value to the correct type
        >
          <option value="yellow">Yellow</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
        </select>
      </div>

      <div className="toggle-group">
        <label>🌙 Night Mode:</label>
        <button onClick={(e) => {
          e.stopPropagation();
          setNightMode(!nightMode);
        }}>
          {nightMode ? "On 🌌" : "Off ☀️"}
        </button>
      </div>
    </div>
  );
};

export default GameModal;
