import { Mic, MicOff } from "lucide-react";
import useSpeechRecognition from "../Hooks/userSpeechRecognitionHook";
import { useState } from "react";

const VoiceController = () => {
    const { text, startListening, stopListening, isListening, hasRecognitionSupport } = useSpeechRecognition();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Function to toggle sidebar based on voice commands
    const handleCommand = (command: string) => {
        if (command.includes("open sidebar")) {
            setSidebarOpen(true);
            console.log("Sidebar opened");
        } else if (command.includes("close sidebar")) {
            setSidebarOpen(false);
            console.log("Sidebar closed");
        } else if (command.includes("play flappy bird")) {
            console.log("Launching Flappy Bird");
        } else if (command.includes("play scream hero")) {
            console.log("Launching Scream Hero");
        } else if (command.includes("play 2048")) {
            console.log("Launching 2048");
        }
    };

    if (!hasRecognitionSupport) {
        return <h1>Your browser has no speech recognition support</h1>;
    }

    return (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
                onMouseDown={startListening}
                onMouseUp={() => {
                    stopListening();
                    handleCommand(text.toLowerCase());
                }}
                onTouchStart={startListening}
                onTouchEnd={() => {
                    stopListening();
                    handleCommand(text.toLowerCase());
                }}
                style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    outline: "none",
                }}
            >
                {isListening ? <MicOff size={48} color="red" /> : <Mic size={48} color="green" />}
            </button>

            <div style={{ marginTop: "1rem" }}>
                {isListening && <p>🎙️ Your browser is currently listening...</p>}
                <p><strong>Recognized Text:</strong> {text}</p>
            </div>
        </div>
    );
};

export default VoiceController;
