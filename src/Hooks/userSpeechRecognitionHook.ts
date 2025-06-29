import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useColorBlind } from "../DaltonizationFilter/ColorBlindContext";
import { useVoiceCommandContext } from "../components/VoiceCommandContext"; // ✅ Import context

// ✅ Extend the Window interface
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionType;
    webkitSpeechRecognition: new () => SpeechRecognitionType;
  }
}

// ✅ Stronger type for SpeechRecognition
type SpeechRecognitionType = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
};

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

const useSpeechRecognition = () => {
  const [recognition, setRecognition] = useState<SpeechRecognitionType | null>(null);
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const { setFilterMode } = useColorBlind();
  const { dispatchCommand } = useVoiceCommandContext(); // ✅ Hook into context

  const commandRoutes: Record<string, string | number> = {
    "go to home": "/",
    "go to settings": "/settings",
    "go to profile": "/profile",
    "go to about": "/about",
    "go to contact": "/contact",
    "go to games": "/games",
    "go back": -1,
  };

  const filterActions: Record<string, string> = {
    //Protanopia
    "protanopia": "protanopia",
   "protonopia": "protanopia",
    "disable color filter": "none",
    //Tritanopia
    "tritanopia": "tritanopia",
    "trytanopia": "tritanopia",
    "trypanopia" : "tritanopia",
    "tritanovia": "tritanopia",
    "try tanopia": "tritanopia",
    "try ampota" : "tritanopia",
    //Deuteranopia
    "deuteranopia": "deuteranopia",
    "deuteranoia": "deuteranopia",
    "deuteronomia": "deuteranopia",
  };

  const handleVoiceCommand = (command: string) => {
    const cleanedCmd = command.toLowerCase().trim();

    for (const [key, mode] of Object.entries(filterActions)) {
      if (cleanedCmd.includes(key)) {
        setFilterMode(mode);
        console.log(`🎨 ${mode} mode enabled.`);

        if (mode === "none") {
          document.documentElement.style.filter = "none";
          document.getElementById("protanopia-filter")?.remove();
          localStorage.setItem("daltonization", "none");
          localStorage.removeItem("protanopiaFilter");
          window.dispatchEvent(new CustomEvent("colorFilterChange", { detail: "none" }));
          window.dispatchEvent(new Event("storage"));
        }
        return;
      }
    }

    for (const [key, route] of Object.entries(commandRoutes)) {
      if (cleanedCmd.includes(key)) {
        typeof route === "string" ? navigate(route) : navigate(-1);
        return;
      }
    }

    // 🔁 Dispatch to other components (like FlappyBirdVoiceHandler)
    dispatchCommand(cleanedCmd);

    console.log("🤖 Text speech recognize by my systen: ", cleanedCmd);
  };

  useEffect(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      console.warn("⚠️ Speech recognition not supported in this browser.");
      return;
    }

    const speechRecognition = new SpeechRecognitionClass();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = "en-US";

    speechRecognition.onresult = ({ resultIndex, results }: SpeechRecognitionEvent) => {
      let finalTranscript = "";

      for (let i = resultIndex; i < results.length; ++i) {
        const result = results[i];
        const alternative = result?.[0];
        if (result?.isFinal && alternative?.transcript) {
          finalTranscript += alternative.transcript + " ";
        }
      }

      if (finalTranscript) {
        const command = finalTranscript.trim();
        setText((prev) => prev + command + " ");
        handleVoiceCommand(command);
      }
    };

    speechRecognition.onerror = (e) => {
      console.error("❌ Speech recognition error:", e.error);
      setIsListening(false);
    };

    speechRecognition.onend = () => {
      console.log("🎙️ Speech recognition ended.");
      setIsListening(false);
    };

    setRecognition(speechRecognition);
    return () => {
      speechRecognition.abort();
    };
  }, []);

  const startListening = () => {
    if (!recognition) return;
    try {
      setIsListening(true);
      recognition.start();
      console.log("🎤 Speech recognition started.");
    } catch (err) {
      console.error("⚠️ Error starting recognition:", err);
    }
  };

  const stopListening = () => {
    recognition?.stop();
    setIsListening(false);
    console.log("🛑 Speech recognition stopped.");
  };

  return {
    isListening,
    text,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognition,
  };
};

export default useSpeechRecognition;
