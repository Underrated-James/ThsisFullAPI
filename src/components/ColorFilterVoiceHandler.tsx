// handlers/ColorFilterVoiceHandler.tsx
import { useEffect } from "react";
import { useColorBlind } from "../DaltonizationFilter/ColorBlindContext";
import { useVoiceCommandContext } from "./VoiceCommandContext";

const ColorFilterVoiceHandler: React.FC = () => {
  const { setFilterMode } = useColorBlind();
  const { registerHandler, unregisterHandler } = useVoiceCommandContext();

  useEffect(() => {
    const handler = (command: string): boolean => {
      const lower = command.toLowerCase();

      if (lower.includes("enable protanopia")) {
        console.log("🎨 Voice command: enabling protanopia");
        setFilterMode("protanopia");
        return true;
      }

      if (lower.includes("enable tritanopia")) {
        setFilterMode("tritanopia");
        return true;
      }

      if (lower.includes("enable deuteranopia")) {
        setFilterMode("deuteranopia");
        return true;
      }

      if (lower.includes("disable color filter") || lower.includes("disable filter")) {
        console.log("🎨 Voice command: disabling all color filters");
        setFilterMode("none");
        return true;
      }

      return false;
    };

    registerHandler(handler);
    return () => unregisterHandler(handler);
  }, [registerHandler, unregisterHandler, setFilterMode]);

  return null;
};

export default ColorFilterVoiceHandler;
