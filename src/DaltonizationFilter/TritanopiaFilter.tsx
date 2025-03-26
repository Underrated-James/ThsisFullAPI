import { useEffect, useState } from "react";

const TritanopiaFilter = () => {
  const [enabled, setEnabled] = useState(
    localStorage.getItem("tritanopiaFilter") === "true"
  );
  const [intensity, setIntensity] = useState(
    parseFloat(localStorage.getItem("tritanopiaIntensity") ?? "1.0")
  );

  useEffect(() => {
    const id = "tritanopia-filter";
    const html = document.documentElement;
    let filterContainer = document.getElementById(id);

    if (enabled) {
      if (!filterContainer) {
        filterContainer = document.createElement("div");
        filterContainer.id = id;
        filterContainer.style.height = "0";
        filterContainer.style.lineHeight = "0";
        filterContainer.style.margin = "0";
        filterContainer.style.padding = "0";
        document.body.appendChild(filterContainer);
      }

      filterContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
          <defs>
            <filter id="tritanopia-advanced" color-interpolation-filters="linearRGB">
              <feColorMatrix type="matrix" values="
                1.0  0.0   0.0   0.0  0.0
                0.0  1.0   0.0   0.0  0.0
               ${Math.max(-0.3, -0.2 * intensity)} ${Math.min(1.5, 1.3 * intensity)}  1.0   0.0  0.0
                0.0  0.0   0.0   1.0  0.0
              " in="SourceGraphic"/>
              <feComponentTransfer>
                <feFuncR type="gamma" exponent="${Math.max(0.7, Math.min(1.0, 0.8 * intensity))}"/>
                <feFuncG type="gamma" exponent="${Math.max(0.85, Math.min(1.1, 0.9 * intensity))}"/>
                <feFuncB type="gamma" exponent="${Math.max(1.2, Math.min(1.5, 1.3 * intensity))}"/>
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>
      `;
      
      html.style.transition = "filter 0.5s ease-in-out";
      html.style.filter = "url(#tritanopia-advanced)";
      localStorage.setItem("tritanopiaFilter", "true");
    } else {
      filterContainer?.remove();
      html.style.transition = "filter 0.5s ease-in-out";
      html.style.filter = "none";
      localStorage.setItem("tritanopiaFilter", "false");
    }
  }, [enabled, intensity]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2 p-4 bg-white rounded shadow-lg">
      <label className="text-sm font-semibold">Tritanopia Intensity</label>
      <input
        type="range"
        min="0.5"
        max="2.5"
        step="0.1"
        value={intensity}
        onChange={(e) => {
          const newValue = parseFloat(e.target.value);
          setIntensity(newValue);
          localStorage.setItem("tritanopiaIntensity", newValue.toString());
        }}
        className="w-full cursor-pointer"
      />
      <button
        onClick={() => {
          setEnabled((prev) => {
            const newState = !prev;
            return newState;
          });
        }}
        className={`mt-2 px-4 py-2 rounded text-white ${
          enabled ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-700 hover:bg-blue-800"
        }`}
      >
        {enabled ? "Disable Tritanopia" : "Enable Tritanopia"}
      </button>
    </div>
  );
};

export default TritanopiaFilter;