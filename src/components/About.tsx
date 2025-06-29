import React, { useState } from "react";
import "../CssFiles/About.css";
import aboutbg from "../Images/aboutbg.png";
import step1DaltonizationFilter from "../Images/step1Dalton.png";
import step2DaltonizationFilter from "../Images/step2Dalton.png";
import step3DaltonizationFilter from "../Images/step3Dalton.png";
import step1VoiceCommand from "../Images/step1Voice.png";
import step2VoiceCommand from "../Images/step2Voice.png";
import step3VoiceCommand from "../Images/step3Voice.png";
import step1HowToPlay from "../Images/step1Play.png";
import step2HowToPlay from "../Images/step2Play.png";
import step3HowToPlay from "../Images/step3Play.png";
import { useFontSize } from "./FontSizeContext";

const FontSized = ({ children, fontSize }: { children: React.ReactNode; fontSize: number }) => (
  <div style={{ fontSize: `${fontSize}px` }}>{children}</div>
);

function About() {
  const [selected, setSelected] = useState("How to use Daltonization Filter");
  const fontSize = useFontSize();

  const renderContent = () => {
    switch (selected) {
      case "How to use Daltonization Filter":
        return (
          <FontSized fontSize={fontSize}>
            <div className="daltonization-steps-row">
              <div className="step-box">
                <h2>Step 1</h2>
                <p>
                  Go to settings or simply turn on the microphone and say <strong>“Go to Settings”</strong>
                </p>
                <img src={step1DaltonizationFilter} alt="Step 1 Daltonization" />
              </div>
              <div className="step-box">
                <h2>Step 2</h2>
                <p>
                  Select the filter that matches your type of color blindness by clicking the drop-down button.
                </p>
                <img src={step2DaltonizationFilter} alt="Step 2 Daltonization" />
              </div>
              <div className="step-box">
                <h2>Step 3</h2>
                <p>
                  Use the slider to adjust the intensity of the filter like in the photo below.
                </p>
                <img src={step3DaltonizationFilter} alt="Step 3 Daltonization" />
              </div>
            </div>
          </FontSized>
        );

      case "How to use Voice Commands":
        return (
          <FontSized fontSize={fontSize}>
            <div className="daltonization-steps-row">
              <div className="step-box">
                <h2>Step 1</h2>
                <p>
                  Make sure your microphone is enabled in the browser settings.
                </p>
                <img src={step1VoiceCommand} alt="Step 1 Voice Commands" />
              </div>
              <div className="step-box">
                <h2>Step 2</h2>
                <p>
                  Click the mic icon on the app or say a valid command like <strong>"Start Game"</strong>.
                </p>
                <img src={step2VoiceCommand} alt="Step 2 Voice Commands" />
              </div>
              <div className="step-box">
                <h2>Step 3</h2>
                <p>
                  Wait for the command to be recognized, then enjoy hands-free interaction.
                </p>
                <img className="mic" src={step3VoiceCommand} alt="Step 3 Voice Commands" width={30} height={20} />
              </div>
            </div>
          </FontSized>
        );

      case "How to Play":
        return (
          <FontSized fontSize={fontSize}>
            <div className="daltonization-steps-row">
              <div className="step-box">
                <h2>Step 1</h2>
                <p>
                  Click on the Start Game button or say <strong>"Start Game"</strong>.
                </p>
                <img src={step1HowToPlay} alt="Step 1 How to Play" />
              </div>
              <div className="step-box">
                <h2>Step 2</h2>
                <p>
                  Use your preferred control (keyboard, mouse, or voice) to navigate or play.
                </p>
                <img src={step2HowToPlay} alt="Step 2 How to Play" />
              </div>
              <div className="step-box">
                <h2>Step 3</h2>
                <p>
                  Reach your goal while using any accessibility settings you need.
                </p>
                <img src={step3HowToPlay} alt="Step 3 How to Play" />
              </div>
            </div>
          </FontSized>
        );

      case "Voice Commands Available":
        return (
          <FontSized fontSize={fontSize}>
            <ul className="voice-list">
              <li>Start Game</li>
              <li>Pause Game</li>
              <li>Open Settings</li>
              <li>Enable Filter</li>
              <li>Disable Filter</li>
              <li>Go to Home</li>
            </ul>
          </FontSized>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="about-container"
      style={{ backgroundImage: `url(${aboutbg})` }}
    >
      <div className="about-modal">
        <ul className="about-nav">
          <li
            className={selected === "How to use Daltonization Filter" ? "active" : ""}
            onClick={() => setSelected("How to use Daltonization Filter")}
          >
            Daltonization Filter
          </li>
          <li
            className={selected === "How to use Voice Commands" ? "active" : ""}
            onClick={() => setSelected("How to use Voice Commands")}
          >
            Voice Commands
          </li>
          <li
            className={selected === "How to Play" ? "active" : ""}
            onClick={() => setSelected("How to Play")}
          >
            How to Play
          </li>
          <li
            className={selected === "Voice Commands Available" ? "active" : ""}
            onClick={() => setSelected("Voice Commands Available")}
          >
            Voice Commands List
          </li>
        </ul>

        <div className="content-section">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default About;
