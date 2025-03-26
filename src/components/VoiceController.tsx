import { Mic, MicOff } from "lucide-react";
import { useEffect, useState } from "react";
import useSpeechRecognition from "../Hooks/userSpeechRecognitionHook";
import { useColorBlind } from "../DaltonizationFilter/ColorBlindContext";

const VoiceController = () => {
  const { setFilterMode } = useColorBlind();
  const {
    text,
    startListening,
    stopListening,
    isListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCommand = (command: string) => {
    const lower = command.toLowerCase();

    if (lower.includes("open sidebar")) {
      setSidebarOpen(true);
      console.log("🟢 Sidebar opened");
    } else if (lower.includes("close sidebar")) {
      setSidebarOpen(false);
      console.log("🔴 Sidebar closed");
    } else if (lower.includes("enable protanopia")) {
      setFilterMode("protanopia");
      console.log("🎨 Protanopia filter enabled.");
    } else if (lower.includes("enable tritanopia")) {
      setFilterMode("tritanopia");
      console.log("🎨 Tritanopia filter enabled.");
    } else if (lower.includes("disable color filter")) {
      setFilterMode("none");
      console.log("🎨 Color filter disabled.");
    }
  };

  useEffect(() => {
    if (!isListening && text.trim()) {
      handleCommand(text);
    }
  }, [isListening]);

  if (!hasRecognitionSupport) {
    return <h1>⚠️ Your browser does not support speech recognition.</h1>;
  }

  return (
    <div className="voice-controller">
      <button
        className="mic-button"
        onClick={isListening ? stopListening : startListening}
      >
        {isListening ? <MicOff color="red" /> : <Mic color="green" />}
      </button>
    </div>
  );
};

export default VoiceController;
