import "../CssFiles/Body.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSpeechRecognition from "../Hooks/userSpeechRecognitionHook";
import img2048 from "../Images/2048-games.png";
import imgFlappy from "../Images/FlappyBird.png";
import imgScream from "../Images/tetris.jpg";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { text } = useSpeechRecognition();
  const navigate = useNavigate(); // ⬅️ React Router navigation

  useEffect(() => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes("open sidebar")) {
      setIsOpen(true);
      console.log("Sidebar opened");
    } else if (lowerText.includes("close sidebar")) {
      setIsOpen(false);
      console.log("Sidebar closed");
    }

    if (lowerText.includes("play flappy bird")) {
      navigate("/flappy-bird");
    } else if (lowerText.includes("play scream hero")) {
      // navigate("/scream-hero");
    } else if (lowerText.includes("/2048")) {
      // navigate("/2048");
    }
  }, [text, navigate]);

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <h3>Games</h3>
      <div className="game-card" onClick={() => navigate("/flappybird")}>
        <img src={imgFlappy} alt="Flappy Bird" width="100%" />
      </div>
      <div className="game-card" onClick={() => navigate("/2048")}>
        <img src={img2048} alt="2048" width="100%" />
      </div>
      <div className="game-card" onClick={() => navigate("/tetris")}>
        <img src={imgScream} alt="Scream Hero" width="100%" />
      </div>
    </div>
  );
};

export default Sidebar;
