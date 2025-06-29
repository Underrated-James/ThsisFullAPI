// components/VoiceController.tsx
import { Mic, MicOff } from "lucide-react";
import { useEffect, useState } from "react";
import useSpeechRecognition from "../Hooks/userSpeechRecognitionHook";
import { useColorBlind } from "../DaltonizationFilter/ColorBlindContext";
import { useNavigate } from "react-router-dom";

const VoiceController: React.FC = () => {
  const {
    text,
    startListening,
    stopListening,
    isListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  const { setFilterMode } = useColorBlind();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // optional UI feature

  const dispatchCommand = (command: string) => {
    const cmd = command.toLowerCase();

    // Navigation commands
    const routes: Record<string, string | number> = {
      "go to home": "/",
      "go to settings": "/settings",
      "go to profile": "/profile",
      "go to about": "/about",
      "go to contact": "/contact",
      "go to games": "/games",
      "go back": -1,
    };

    for (const [key, route] of Object.entries(routes)) {
      if (cmd.includes(key)) {
        typeof route === "string" ? navigate(route) : navigate(-1);
        console.log(`📍 Navigated to: ${route}`);
        return;
      }
    }

    // Color filter commands
    if (cmd.includes("protanopia")) {
      setFilterMode("protanopia");
      console.log("🎨 Protanopia mode enabled.");
      return;
    }

    if (cmd.includes("disable color filter")) {
      setFilterMode("none");
      document.documentElement.style.filter = "none";
      document.getElementById("protanopia-filter")?.remove();
      ["daltonization", "protanopiaFilter"].forEach((item) => localStorage.removeItem(item));
      window.dispatchEvent(new Event("storage"));
      console.log("🎨 Color filter disabled.");
      return;
    }

    console.log("🤖 Voice command not recognized:", cmd);
  };

  

  if (!hasRecognitionSupport) {
    return <h1>⚠️ Your browser does not support speech recognition.</h1>;
  }

  return (
    <div className="voice-controller">
      <button className="mic-button" onClick={isListening ? stopListening : startListening}>
        {isListening ? <MicOff color="red" /> : <Mic color="green" />}
      </button>
    </div>
  );
};

export default VoiceController;
