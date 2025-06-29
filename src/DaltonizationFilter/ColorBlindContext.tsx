import { createContext, useContext, useState, useEffect } from "react";

type ColorBlindContextType = {
  filter: string;
  setFilterMode: (mode: string) => void;
  intensity: number;
  setIntensity: (value: number) => void;
};

export const ColorBlindContext = createContext<ColorBlindContextType | undefined>(undefined);

export const ColorBlindProvider = ({ children }: { children: React.ReactNode }) => {
  const [filter, setFilter] = useState<string>(() => localStorage.getItem("daltonization") || "none");
  const [intensity, setIntensity] = useState<number>(() => parseFloat(localStorage.getItem("filterIntensity") || "1.0"));

  const setFilterMode = (mode: string) => {
    if (mode !== filter) {
      console.log(`🎨 Changing filter mode to: ${mode}`);
      setFilter(mode);
      localStorage.setItem("daltonization", mode); // sync localStorage immediately
    }
  };

  useEffect(() => {
    const storedFilter = localStorage.getItem("daltonization") || "none";
    const storedIntensity = localStorage.getItem("filterIntensity") || "1.0";

    if (storedFilter !== filter) {
      localStorage.setItem("daltonization", filter);
    }
    if (storedIntensity !== intensity.toString()) {
      localStorage.setItem("filterIntensity", intensity.toString());
    }

    // Clear existing filters
    document.documentElement.classList.remove("protanopia", "tritanopia");

    if (filter === "none") {
      console.log("❌ Removing all color filters.");
      document.documentElement.style.removeProperty("--filter-intensity");
      document.documentElement.style.filter = "none";
    } else {
      console.log(`✅ Applying ${filter} filter.`);
      document.documentElement.classList.add(filter);
      document.documentElement.style.setProperty("--filter-intensity", intensity.toString());
    }
  }, [filter, intensity]);

  // 🧠 NEW: Listen to localStorage and custom events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "daltonization") {
        const newValue = e.newValue || "none";
        if (newValue !== filter) {
          setFilter(newValue);
        }
      }
    };

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newMode = customEvent.detail;
      if (newMode && typeof newMode === "string") {
        setFilterMode(newMode); // will update state and localStorage
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("colorFilterChange", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("colorFilterChange", handleCustomEvent);
    };
  }, [filter]);

  return (
    <ColorBlindContext.Provider value={{ filter, setFilterMode, intensity, setIntensity }}>
      {children}
    </ColorBlindContext.Provider>
  );
};

export const useColorBlind = () => {
  const context = useContext(ColorBlindContext);
  if (!context) {
    throw new Error("useColorBlind must be used within a ColorBlindProvider");
  }
  return context;
};
