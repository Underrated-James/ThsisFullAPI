// handlers/GlobalVoiceHandler.tsx
import { useEffect } from "react";
import { useVoiceCommandContext } from "./VoiceCommandContext";

const GlobalVoiceHandler: React.FC = () => {
  const { registerHandler, unregisterHandler } = useVoiceCommandContext();

  useEffect(() => {
    const handler = (command: string): boolean => {
      const lower = command.toLowerCase();

      if (lower.includes("open sidebar")) {
        console.log("🔊 Opening sidebar..."); // replace with actual UI state update
        return true;
      }

      if (lower.includes("close sidebar")) {
        console.log("🔊 Closing sidebar...");
        return true;
      }

      return false; // not handled
    };

    registerHandler(handler);
    return () => unregisterHandler(handler);
  }, [registerHandler, unregisterHandler]);

  return null;
};

export default GlobalVoiceHandler;
