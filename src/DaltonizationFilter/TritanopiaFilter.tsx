import { useEffect } from "react";
import { useColorBlind } from "../DaltonizationFilter/ColorBlindContext";

const FILTER_CONTAINER_ID = "tritanopia-filter";
const FILTER_ID = "tritanopia-enhanced";

const TritanopiaFilter = () => {
  const { filter, intensity } = useColorBlind();
  const enabled = filter === "tritanopia";

  useEffect(() => {
    console.log("🔍 TritanopiaFilter useEffect triggered. Enabled:", enabled, "Intensity:", intensity);

    let container = document.getElementById(FILTER_CONTAINER_ID);

    if (enabled) {
      if (!container) {
        console.log("⚠️ Creating new Tritanopia filter container...");
        container = document.createElement("div");
        container.id = FILTER_CONTAINER_ID;
        document.body.appendChild(container);
      } else {
        container.innerHTML = ""; // Clear previous filter content for live updates
      }

      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("style", "display: none");

      const defs = document.createElementNS(svgNS, "defs");
      const filterEl = document.createElementNS(svgNS, "filter");
      filterEl.setAttribute("id", FILTER_ID);
      filterEl.setAttribute("color-interpolation-filters", "linearRGB");

      const feColorMatrix = document.createElementNS(svgNS, "feColorMatrix");
      feColorMatrix.setAttribute("type", "matrix");

      feColorMatrix.setAttribute(
        "values",
        `
          ${Math.max(0.95, 0.967 * intensity)} ${Math.max(0.05, 0.033 * intensity)} 0.0 0.0 0.0
          0.0 ${Math.max(0.433, 0.5 * intensity)} ${Math.max(0.567, 0.5 * intensity)} 0.0 0.0
          0.0 ${Math.max(0.475, 0.475 * intensity)} ${Math.max(0.525, 0.525 * intensity)} 0.0 0.0
          0.0 0.0 0.0 1.0 0.0
        `
      );

      const feComponentTransfer = document.createElementNS(svgNS, "feComponentTransfer");

      const feFuncR = document.createElementNS(svgNS, "feFuncR");
      feFuncR.setAttribute("type", "gamma");
      feFuncR.setAttribute("exponent", `${Math.max(0.9, Math.min(1.2, 1.05 * intensity))}`);

      const feFuncG = document.createElementNS(svgNS, "feFuncG");
      feFuncG.setAttribute("type", "gamma");
      feFuncG.setAttribute("exponent", `${Math.max(0.9, Math.min(1.2, 1.1 * intensity))}`);

      const feFuncB = document.createElementNS(svgNS, "feFuncB");
      feFuncB.setAttribute("type", "gamma");
      feFuncB.setAttribute("exponent", `${Math.max(1.0, Math.min(1.3, 1.2 * intensity))}`);

      feComponentTransfer.appendChild(feFuncR);
      feComponentTransfer.appendChild(feFuncG);
      feComponentTransfer.appendChild(feFuncB);

      filterEl.appendChild(feColorMatrix);
      filterEl.appendChild(feComponentTransfer);
      defs.appendChild(filterEl);
      svg.appendChild(defs);
      container.appendChild(svg);

      document.documentElement.style.filter = `url(#${FILTER_ID})`;
      console.log("🎨 Tritanopia filter applied with updated intensity.");
    } else {
      if (container) {
        container.remove();
        console.log("🧽 Removed Tritanopia filter container.");
      }
      document.documentElement.style.filter = "none";
      console.log("❌ Tritanopia filter disabled.");
    }

    return () => {
      console.log("🧼 Cleanup on unmount or change.");
    };
  }, [enabled, intensity]);

  return null;
};

export default TritanopiaFilter;
