import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Custom type definitions for Web Speech API
type SpeechRecognition = any;

type SpeechRecognitionEvent = Event & {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
};

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    length: number;
    isFinal: boolean;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

const useSpeechRecognition = () => {
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [text, setText] = useState("");
    const [isListening, setIsListening] = useState(false);
    const navigate = useNavigate();

    // Voice command to route mapping
    const commandRoutes: Record<string, string | number> = {
        "go to home": "/",
        "open home": "/",
        "go to settings": "/settings",
        "open settings": "/settings",
        "show profile": "/profile",
        "open profile": "/profile",
        "go back": -1, 
        "go to about": "/about",
        "open about": "/about",
        "go to contact": "/contact",
        "open contact": "/contact",
        "go to games": "/games",  // ✅ Added this
        "open games": "/games",  // ✅ Added this
        "open sidebar": "sidebar",
        "pick a game": "game-selection"
    };
    

    useEffect(() => {
        const SpeechRecognitionClass =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognitionClass) {
            console.warn("Speech recognition is not supported in this browser.");
            return;
        }

        const speechRecognition = new SpeechRecognitionClass();
        speechRecognition.continuous = true;
        speechRecognition.interimResults = true;
        speechRecognition.lang = "en-US";

        speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
            console.log("onresult", event);

            let finalTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript + " ";
                }
            }

            if (finalTranscript) {
                const cleanedCommand = finalTranscript.trim().toLowerCase();
                setText((prev) => prev + cleanedCommand + " ");
                handleVoiceCommand(cleanedCommand);
            }
        };

        speechRecognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        speechRecognition.onend = () => {
            console.log("Speech recognition ended.");
            setIsListening(false);
        };

        setRecognition(speechRecognition);

        return () => {
            speechRecognition.abort(); // Clean up on unmount
        };
    }, []);

    const handleVoiceCommand = (command: string) => {
        Object.entries(commandRoutes).forEach(([key, route]) => {
            if (command.includes(key)) {
                if (route === -1) {
                    navigate(-1); // Go back
                } else if (typeof route === "string") {
                    if (route === "sidebar") {
                        console.log("Opening sidebar...");
                    } else if (route === "game-selection") {
                        console.log("Navigating to game selection...");
                    } else {
                        navigate(route); // Navigate to the given path
                    }
                }
            }
        });
    };

    const startListening = () => {
        if (!recognition) return;
        try {
            setIsListening(true);
            recognition.start();
            console.log("Speech recognition started.");
        } catch (err) {
            console.error("Error starting recognition:", err);
        }
    };

    const stopListening = () => {
        if (!recognition) return;
        recognition.stop();
        setIsListening(false);
        console.log("Speech recognition stopped.");
    };

    return {
        isListening,
        text,
        startListening,
        stopListening,
        hasRecognitionSupport: recognition !== null,
    };
};

export default useSpeechRecognition;
