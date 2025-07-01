import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../CssFiles/Games.css";
import backgroundImage from "../Images/games-bg.png";
import playButtonImage from "../Images/play-button.jpg";
import img2048 from "../Images/2048-games.png";
import imgFlappy from "../Images/FlappyBird.png";
import imgScream from "../Images/tetris.jpg";
import video2048 from "../videos/2048vid.mp4";
import videoFlappy from "../videos/flappyvid.mp4";
import videoTetris from "../videos/tetrisvid.mp4";
import { useFontSize } from "./FontSizeContext";

// Game Data
const games = [
  { name: "2048", img: img2048, video: video2048, route: "/2048" },
  { name: "Flappy Bird", img: imgFlappy, video: videoFlappy, route: "/flappybird" },
  { name: "Tetris", img: imgScream, video: videoTetris, route: "/tetris" },
];

// Game Descriptions
const gameDescriptions: Record<string, string> = {
  "2048":
    "2048 is a single-player sliding tile puzzle video game written by Italian web developer Gabriele Cirulli...",
  "Flappy Bird":
    "Flappy Bird is a fast-paced, side-scrolling mobile game where you control a tiny bird trying to fly between pipes...",
  "Tetris":
    "Tetris is a classic tile-matching puzzle game where players strategically rotate and stack falling blocks...",
};

function Games() {
  const [selected, setSelected] = useState<string>(games[1]?.name || "Flappy Bird");
  const navigate = useNavigate();
  const fontSize = useFontSize(); 

  // Get current game index
  const selectedIndex = games.findIndex((g) => g.name === selected);

  // Ensure valid indices for cycling games
  const previousIndex = (selectedIndex - 1 + games.length) % games.length;
  const nextIndex = (selectedIndex + 1) % games.length;

  // Safely access games, fallback to a default object if undefined
  const reorderedGames = [
    games[nextIndex] ?? games[0],
    games[selectedIndex] ?? games[1],
    games[previousIndex] ?? games[2],
  ];

  // Navigate to the selected game
  const handlePlay = () => {
    const selectedGame = games.find((game) => game.name === selected);
    if (selectedGame) {
      navigate(selectedGame.route);
    } else {
      console.error("Selected game not found!");
    }
  };

  return (
    <div
      className="games-container"
      style={{
        background: `url(${backgroundImage}) center/cover no-repeat`,
        minHeight: "100vh",
      }}
    >
      <div className="games-cards">
        {reorderedGames.map((game) =>
          game ? (
            <motion.div
              key={game.name}
              className={`card ${selected === game.name ? "active" : "darkened"}`}
              onClick={() => setSelected(game.name)}
              layout
              animate={{
                scale: selected === game.name ? 1.2 : 0.9,
                opacity: selected === game.name ? 1 : 0.5,
                zIndex: selected === game.name ? 2 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              whileHover={selected !== game.name ? { scale: 1.05 } : {}}
            >
              {game.video && (
                <div className="video-wrapper">
                  <video
                    className="card-video"
                    src={game.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  />
                  <img src={game.img} alt={game.name} className="card-image" />
                </div>
              )}
            </motion.div>
          ) : null
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          className="games-description"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          style={{fontSize: `${fontSize}px`}}
        >
          <h2>{selected.toUpperCase()}</h2>
          <p>{gameDescriptions[selected] ?? "No description available."}</p>
        </motion.div>
      </AnimatePresence>

      <div className="games-play-button" onClick={handlePlay}>
        <img src={playButtonImage} alt="Play" className="play-button-img" />
      </div>
    </div>
  );
}

export default Games;
