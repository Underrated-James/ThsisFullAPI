import { useState, useEffect, useRef } from "react";
import { useColorBlind } from "../DaltonizationFilter/ColorBlindContext";
import "../CssFiles/Settings.css";
import backgroundImage from "../Images/Settingsbackground.jpg";
import { useFontSize } from "./FontSizeContext";

const settingsKeys = [
  "daltonization",
  "textSize",
  "highContrast",
  "voiceNavigation",
  "keyboardNav",
  "audioDescriptions",
];

function Settings() {
  const { filter, setFilterMode, intensity, setIntensity } = useColorBlind();
  const { fontSize, setFontSize } = useFontSize();

  const [settings, setSettings] = useState(() => {
    const initialSettings = settingsKeys.reduce((acc, key) => {
      if (key === "textSize") {
        acc[key] = Number(localStorage.getItem(key)) || 16;
      } else if (key === "daltonization") {
        acc[key] = localStorage.getItem(key) || "none";
      } else {
        acc[key] = localStorage.getItem(key) === "true";
      }
      return acc;
    }, {} as Record<string, any>);

    return initialSettings;
  });

  const prevFilterRef = useRef(filter);

  // Sync context fontSize with local state
  useEffect(() => {
    if (settings.textSize !== fontSize) {
      setFontSize(settings.textSize);
    }
  }, [settings.textSize]);

  useEffect(() => {
    // Apply font size dynamically in real-time
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.documentElement.style.setProperty("--dynamic-font-size", `${fontSize}px`);
  }, [fontSize]);

  useEffect(() => {
    settingsKeys.forEach((key) => {
      const value = settings[key]?.toString();
      localStorage.setItem(key, value);
    });

    document.body.classList.toggle("high-contrast", settings.highContrast);
  }, [settings]);

  useEffect(() => {
    if (filter !== prevFilterRef.current && filter !== settings.daltonization) {
      prevFilterRef.current = filter;
      setSettings((prev) => ({ ...prev, daltonization: filter }));
    }
  }, [filter]);

  useEffect(() => {
    if (settings.daltonization !== filter) {
      prevFilterRef.current = settings.daltonization;
      setFilterMode(settings.daltonization);
    }
  }, [settings.daltonization]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "daltonization") {
        const newValue = e.newValue || "none";
        setSettings((prev) => ({ ...prev, daltonization: newValue }));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleColorFilterChange = (e: CustomEvent) => {
      const newMode = e.detail;
      setSettings((prev) => ({ ...prev, daltonization: newMode }));
      setFilterMode(newMode);
    };

    window.addEventListener("colorFilterChange", handleColorFilterChange as EventListener);
    return () => window.removeEventListener("colorFilterChange", handleColorFilterChange as EventListener);
  }, []);

  const handleChange = (key: string, value: any) => {
    if (settings[key] !== value) {
      setSettings((prev) => ({ ...prev, [key]: value }));

      if (key === "textSize") {
        setFontSize(value); // Realtime update
      }

      if (key === "daltonization" && value !== filter) {
        setFilterMode(value);
        window.dispatchEvent(
          new StorageEvent("storage", { key: "daltonization", newValue: value })
        );
      }
    }
  };
  useEffect(() => {
    if (settings.daltonization !== "none") {
      const timeout = setTimeout(() => {
        setFilterMode(settings.daltonization);
      }, 100); // or any delay you like
      return () => clearTimeout(timeout);
    }
  }, [intensity]);
  

  return (
    <div
      className="settings-page"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="settings-container">
        <h2 className="settings-title">Accessibility Settings</h2>

        <label className="settings-label">
          <span>Colorblind Filter:</span>
          <select
            className="settings-select"
            value={settings.daltonization}
            onChange={(e) => handleChange("daltonization", e.target.value.toLowerCase())}
          >
            {["None", "Protanopia", "Deuteranopia", "Tritanopia"].map((mode) => (
              <option key={mode} value={mode.toLowerCase()}>
                {mode}
              </option>
            ))}
          </select>
        </label>

        {settings.daltonization !== "none" && (
          <label className="settings-label">
            <span>
              Filter Intensity: <span>{intensity.toFixed(1)}</span>
            </span>
            <input
              className="settings-slider"
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
            />
          </label>
        )}

        <label className="settings-label">
          <span>
            Text Size: <span>{fontSize}px</span>
          </span>
          <input
            className="settings-slider"
            type="range"
            min="11"
            max="18"
            value={fontSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              handleChange("textSize", newSize);
            }}
          />
        </label>

        {["highContrast", "voiceNavigation", "keyboardNav", "audioDescriptions"].map((key) => (
          <label key={key} className="settings-label">
            <input
              type="checkbox"
              className="settings-checkbox"
              checked={settings[key]}
              onChange={() => handleChange(key, !settings[key])}
            />
            {key.replace(/([A-Z])/g, " $1")}
          </label>
        ))}
      </div>
    </div>
  );
}

export default Settings;
