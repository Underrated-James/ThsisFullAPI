import { useEffect } from "react";
import { useColorBlind } from "../DaltonizationFilter/ColorBlindContext";

const ProtanopiaFilter = () => {
  const { filter, intensity } = useColorBlind();
  const enabled = filter === "protanopia";

  useEffect(() => {
    console.log("🔍 ProtanopiaFilter useEffect triggered. Enabled:", enabled, "Intensity:", intensity);

    let filterContainer = document.getElementById("protanopia-filter");

    if (enabled) {
      if (!filterContainer) {
        console.log("⚠️ Protanopia filter missing! Creating now...");
        filterContainer = document.createElement("div");
        filterContainer.id = "protanopia-filter";
        document.body.appendChild(filterContainer);
      }

      filterContainer.innerHTML = `
        <svg style="display: none">
          <defs>
            <filter id="protanopia-enhanced" color-interpolation-filters="linearRGB">
              <feColorMatrix type="matrix" values="
                ${Math.max(0.6, 0.567 * intensity)} ${Math.max(0.3, 0.433 * intensity)}  0.0   0.0  0.0
                ${Math.max(0.5, 0.558 * intensity)} ${Math.max(0.4, 0.442 * intensity)}  0.0   0.0  0.0
                0.000 ${Math.max(0.2, 0.242 * intensity)}  ${Math.max(0.7, 0.758 * intensity)}  0.0  0.0
                0.0   0.0    0.0   1.0  0.0
              " in="SourceGraphic"/>
              <feComponentTransfer>
                <feFuncR type="gamma" exponent="${Math.max(0.9, Math.min(1.2, 1.1 * intensity))}"/>
                <feFuncG type="gamma" exponent="${Math.max(0.95, Math.min(1.2, 1.05 * intensity))}"/>
                <feFuncB type="gamma" exponent="${Math.max(1.0, Math.min(1.3, 1.15 * intensity))}"/> 
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>
      `;

      document.documentElement.style.filter = "url(#protanopia-enhanced)";
      console.log("✅ Protanopia filter applied.");
    } else {
      console.log("❌ Removing Protanopia filter.");
      if (filterContainer) {
        filterContainer.remove(); // ✅ Completely remove the filter element
      }
      document.documentElement.style.filter = "none"; // ✅ Reset filter
    }
  }, [filter, intensity]);

  return null;
};

export default ProtanopiaFilter;
