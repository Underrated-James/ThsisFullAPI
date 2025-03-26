import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useColorBlind } from "../DaltonizationFilter/ColorBlindContext";

type SpeechRecognition = any;

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

const useSpeechRecognition = () => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const { setFilterMode } = useColorBlind();

  const commandRoutes: Record<string, string | number> = {
    "go to home": "/",
    "go to settings": "/settings",
    "go to profile": "/profile",
    "go back": -1,
    "go to about": "/about",
    "go to contact": "/contact",
    "go to games": "/games",
    "open sidebar": "sidebar",
    "pick a game": "game-selection",
  };

  useEffect(() => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      console.warn("⚠️ Speech recognition not supported in this browser.");
      return;
    }

    const speechRecognition = new SpeechRecognitionClass();
    Object.assign(speechRecognition, {
      continuous: true,
      interimResults: true,
      lang: "en-US",
      onresult: ({ resultIndex, results }: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        for (let i = resultIndex; i < (results?.length ?? 0); ++i) {
          results?.[i]?.isFinal && (finalTranscript += results?.[i]?.[0]?.transcript + " ");
        }
        if (finalTranscript) {
          const command = finalTranscript.trim().toLowerCase();
          setText((prev) => prev + command + " ");
          handleVoiceCommand(command);
        }
      },
      onerror: (e: any) => (console.error("❌ Speech recognition error:", e.error), setIsListening(false)),
      onend: () => (console.log("🎙️ Speech recognition ended."), setIsListening(false)),
    });

    setRecognition(speechRecognition);
    return () => speechRecognition.abort();
  }, []);

  const handleVoiceCommand = (command: string) => {
    const filterActions: Record<string, string> = {
      protanopia: "protanopia",
      tritanopia: "tritanopia",
      "disable color filter": "none",
    };

    for (const [key, mode] of Object.entries(filterActions)) {
      if (command.includes(key)) {
        setFilterMode(mode);
        console.log(`🎨 ${mode} mode enabled.`);

        if (mode === "none") {
          document.documentElement.style.filter = "none";
          document.getElementById("protanopia-filter")?.remove();
          ["daltonization", "protanopiaFilter"].forEach((item) => localStorage.removeItem(item));
          window.dispatchEvent(new Event("storage"));
        }
        return;
      }
    }

    Object.entries(commandRoutes).forEach(([key, route]) => {
      if (command.includes(key)) {
        typeof route === "string" ? navigate(route) : navigate(-1);
      }
    });
  };

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

  return { isListening, text, startListening, stopListening, hasRecognitionSupport: !!recognition };
};

export default useSpeechRecognition;
