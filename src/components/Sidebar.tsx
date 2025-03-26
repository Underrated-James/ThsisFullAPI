import "../CssFiles/Body.css";
import { useState, useEffect } from "react";
import useSpeechRecognition from "../Hooks/userSpeechRecognitionHook";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { text } = useSpeechRecognition();

  useEffect(() => {
    const lowerText = text.toLowerCase();
    console.log("Recognized command:", lowerText); // Debugging log

    // Toggle sidebar
    if (lowerText.includes("open sidebar")) {
      setIsOpen(true);
      console.log("Sidebar opened");
    } else if (lowerText.includes("close sidebar")) {
      setIsOpen(false);
      console.log("Sidebar closed");
    }

    // Select a game
    if (lowerText.includes("play flappy bird")) {
      console.log("Launching Flappy Bird...");
    } else if (lowerText.includes("play scream hero")) {
      console.log("Launching Scream Hero...");
    } else if (lowerText.includes("play 2048")) {
      console.log("Launching 2048...");
    }
  }, [text]);

  return (
    <div>
      {/* Sidebar Toggle Button 
      <button onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? "Close Sidebar" : "Open Sidebar"}
      </button>*/}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <h3>Games</h3>
        <div className="game-card">
          <img src="flappyBird.png" alt="Flappy Bird" width="100%" />
        </div>
        <div className="game-card">
          <img src="scream.png" alt="Scream Hero" width="100%" />
        </div>
        <div className="game-card">
          <img src="2048.png" alt="2048" width="100%" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
