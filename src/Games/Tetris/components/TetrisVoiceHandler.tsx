import { useEffect } from "react";
import { useVoiceCommandContext } from "../../../components/VoiceCommandContext";

interface TetrisVoiceHandlerProps {
  showGhost: boolean;
  setShowGhost: (value: boolean) => void;
  blockStyle: "classic" | "neon" | "bubble";
  setBlockStyle: (style: "classic" | "neon" | "bubble") => void;
}

const TetrisVoiceHandler: React.FC<TetrisVoiceHandlerProps> = ({
  showGhost,
  setShowGhost,
  blockStyle,
  setBlockStyle,
}) => {
  const { registerHandler, unregisterHandler } = useVoiceCommandContext();

  useEffect(() => {
    const handler = (command: string): boolean => {
      const lower = command.toLowerCase();

      // Ghost Piece Toggle
      if (lower.includes("ghost on") || lower.includes("goes on")) {
        console.log("👻 Ghost piece enabled");
        setShowGhost(true);
        return true;
      }
      if (lower.includes("ghost off") || lower.includes("goes off")) {
        console.log("🚫 Ghost piece disabled");
        setShowGhost(false);
        return true;
      }

      // Block Style
      if (lower.includes("bubble blocks")) {
        console.log("🔵 Switching to bubble blocks");
        setBlockStyle("bubble");
        return true;
      }
      if (lower.includes("neon blocks")) {
        console.log("💡 Switching to neon blocks");
        setBlockStyle("neon");
        return true;
      }
      if (lower.includes("classic blocks")) {
        console.log("🎮 Switching to classic blocks");
        setBlockStyle("classic");
        return true;
      }

      return false;
    };

    registerHandler(handler);
    return () => unregisterHandler(handler);
  }, [registerHandler, unregisterHandler, showGhost, setShowGhost, blockStyle, setBlockStyle]);

  return null;
};

export default TetrisVoiceHandler;
