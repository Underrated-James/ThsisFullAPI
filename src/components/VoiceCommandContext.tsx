// context/VoiceCommandContext.tsx
import React, { createContext, useContext, useRef } from "react";

type VoiceCommandHandler = (command: string) => boolean;

const VoiceCommandContext = createContext<{
  registerHandler: (handler: VoiceCommandHandler) => void;
  unregisterHandler: (handler: VoiceCommandHandler) => void;
  dispatchCommand: (command: string) => void;
}>({
  registerHandler: () => {},
  unregisterHandler: () => {},
  dispatchCommand: () => {},
});

export const VoiceCommandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handlers = useRef<VoiceCommandHandler[]>([]);

  const registerHandler = (handler: VoiceCommandHandler) => {
    handlers.current.push(handler);
  };

  const unregisterHandler = (handler: VoiceCommandHandler) => {
    handlers.current = handlers.current.filter((h) => h !== handler);
  };

  const dispatchCommand = (command: string) => {
    for (const handler of handlers.current) {
      if (handler(command)) break; // Stop if handled
    }
  };

  return (
    <VoiceCommandContext.Provider value={{ registerHandler, unregisterHandler, dispatchCommand }}>
      {children}
    </VoiceCommandContext.Provider>
  );
};

export const useVoiceCommandContext = () => useContext(VoiceCommandContext);
