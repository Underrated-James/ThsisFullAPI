import { useState, useEffect, useRef } from "react";
import { useColorBlind } from "../DaltonizationFilter/ColorBlindContext";
import "../CssFiles/Settings.css";
import backgroundImage from "../Images/Settingsbackground.jpg";

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

  useEffect(() => {
    if (filter && settings.daltonization !== filter && prevFilterRef.current !== filter) {
      prevFilterRef.current = filter;
      setSettings((prev) => ({ ...prev, daltonization: filter }));
    }
  }, [filter]);

  useEffect(() => {
    settingsKeys.forEach((key) => {
      const newValue = settings[key]?.toString();
      localStorage.setItem(key, newValue);
    });

    document.documentElement.style.fontSize = `${settings.textSize}px`;
    document.body.classList.toggle("high-contrast", settings.highContrast);
  }, [settings]);

  useEffect(() => {
    if (settings.daltonization !== filter) {
      prevFilterRef.current = settings.daltonization;
      setFilterMode(settings.daltonization);
    }
  }, [settings.daltonization]);

  const handleChange = (key: string, value: any) => {
    if (settings[key] !== value) {
      setSettings((prev) => ({ ...prev, [key]: value }));

      if (key === "daltonization" && value !== filter) {
        setFilterMode(value);
        window.dispatchEvent(new StorageEvent("storage", { key: "daltonization", newValue: value }));
      }
    }
  };

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
            {["None", "Protanopia", "Tritanopia"].map((mode) => (
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
            Text Size: <span>{settings.textSize}px</span>
          </span>
          <input
            className="settings-slider"
            type="range"
            min="12"
            max="24"
            value={settings.textSize}
            onChange={(e) => handleChange("textSize", Number(e.target.value))}
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
