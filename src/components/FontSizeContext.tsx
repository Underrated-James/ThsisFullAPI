import React, { createContext, useContext, useState, useEffect } from "react";

// Define the context type
type FontSizeContextType = {
  fontSize: number;
  setFontSize: (size: number) => void;
};

// Create the context with an initial undefined value
const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

// Custom hook for using font size context
export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return context;
};

// FontSizeProvider implementation
export const FontSizeProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontSize, setFontSize] = useState<number>(() => {
    return Number(localStorage.getItem("textSize")) || 16;
  });

  // Update both state and localStorage
  const updateFontSize = (size: number) => {
    localStorage.setItem("textSize", size.toString());
    setFontSize(size);
  };

  useEffect(() => {
    const storedSize = Number(localStorage.getItem("textSize")) || 16;
    if (storedSize !== fontSize) {
      setFontSize(storedSize);
    }
  }, []);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize: updateFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};
