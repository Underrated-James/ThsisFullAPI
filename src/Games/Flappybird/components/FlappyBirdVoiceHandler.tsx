import { useEffect } from "react";
import { useVoiceCommandContext } from "../../../components/VoiceCommandContext";

const FlappyBirdVoiceHandler: React.FC<{
  onToggleNightMode: () => void;
  onSetNightMode: (isNight: boolean) => void; // ✅ New prop
  onToggleSound: () => void;
  onChangeBirdColor: (color: "red" | "blue" | "yellow") => void;
}> = ({ onToggleNightMode, onSetNightMode, onToggleSound, onChangeBirdColor }) => {
  const { registerHandler, unregisterHandler } = useVoiceCommandContext();

  useEffect(() => {
    const handler = (command: string): boolean => {
      const lower = command.toLowerCase();

      if (lower.includes("night mode")) {
        console.log("🌙 Switching to night mode");
        onSetNightMode(true); // ✅ Explicit night
        return true;
      }

      if (lower.includes("day mode")) {
        console.log("☀️ Switching to day mode");
        onSetNightMode(false); // ✅ Explicit day
        return true;
      }

      if (lower.includes("sound off") || lower.includes("mute")) {
        console.log("🔇 Sound off");
        onToggleSound();
        return true;
      }

      if (lower.includes("sound on")) {
        console.log("🔊 Sound on");
        onToggleSound();
        return true;
      }

      if (lower.includes("red bird")) {
        onChangeBirdColor("red");
        return true;
      }

      if (lower.includes("blue bird")) {
        onChangeBirdColor("blue");
        return true;
      }

      if (lower.includes("yellow bird")) {
        onChangeBirdColor("yellow");
        return true;
      }

      return false;
    };

    registerHandler(handler);
    return () => unregisterHandler(handler);
  }, [onToggleNightMode, onSetNightMode, onToggleSound, onChangeBirdColor]);

  return null;
};

export default FlappyBirdVoiceHandler;
