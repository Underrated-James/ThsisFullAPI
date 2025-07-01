import  {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

// Define the context value shape
type FontSizeContextType = {
  fontSize: number;
  setFontSize: (size: number) => void;
};

// Create the context
const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

// Custom hook to use font size context
export const useFontSize = (): FontSizeContextType => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return context;
};

// Provider component
export const FontSizeProvider = ({ children }: { children: ReactNode }) => {
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem("textSize");
    return saved ? Number(saved) : 16;
  });

  // Update localStorage whenever font size changes
  useEffect(() => {
    localStorage.setItem("textSize", fontSize.toString());
  }, [fontSize]);

  // Memoize context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      fontSize,
      setFontSize,
    }),
    [fontSize]
  );

  return (
    <FontSizeContext.Provider value={contextValue}>
      {children}
    </FontSizeContext.Provider>
  );
};
