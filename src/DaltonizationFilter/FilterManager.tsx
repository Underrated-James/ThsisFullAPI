import { useEffect } from "react";
import { useColorBlind } from "./ColorBlindContext";

const FilterManager = () => {
  const { filter, intensity } = useColorBlind(); // ✅ Using correct values

  useEffect(() => {
    const html = document.documentElement;

    // Clear existing filters first
    html.style.filter = "none";
    document.getElementById("protanopia-filter")?.remove();
    document.getElementById("tritanopia-filter")?.remove();

    if (filter === "protanopia") {
      html.style.filter = `brightness(${1.0 - 0.2 * intensity}) contrast(${1.0 + 0.2 * intensity})`;
    } else if (filter === "tritanopia") {
      html.style.filter = `hue-rotate(${180 * intensity}deg)`;
    }

    return () => {
      html.style.filter = "none";
    };
  }, [filter, intensity]);

  return null;
};

export default FilterManager;
