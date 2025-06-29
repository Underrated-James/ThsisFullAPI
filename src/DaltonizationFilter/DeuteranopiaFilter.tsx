import { useEffect } from "react";
import { useColorBlind } from "../DaltonizationFilter/ColorBlindContext";

const FILTER_CONTAINER_ID = "deuteranopia-filter";
const FILTER_ID = "deuteranopia-enhanced";

const DeuteranopiaFilter = () => {
  const { filter, intensity } = useColorBlind();
  const enabled = filter === "deuteranopia";

  useEffect(() => {
    console.log("🔍 DeuteranopiaFilter useEffect triggered. Enabled:", enabled, "Intensity:", intensity);
  
    const existingContainer = document.getElementById(FILTER_CONTAINER_ID);
  
    // Always remove old filter if exists
    if (existingContainer) {
      existingContainer.remove();
      console.log("♻️ Removed existing filter for re-creation.");
    }
  
    if (enabled) {
      console.log("⚠️ Creating Deuteranopia filter...");
  
      const container = document.createElement("div");
      container.id = FILTER_CONTAINER_ID;
  
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
          ${Math.max(0.8, 0.625 * intensity)} ${Math.max(0.2, 0.375 * intensity)} 0.0 0.0 0.0
          ${Math.max(0.7, 0.7 * intensity)} ${Math.max(0.1, 0.3 * intensity)} 0.0 0.0 0.0
          0.0 ${Math.max(0.2, 0.3 * intensity)} ${Math.max(0.7, 0.7 * intensity)} 0.0 0.0
          0.0 0.0 0.0 1.0 0.0
        `
      );
  
      const feComponentTransfer = document.createElementNS(svgNS, "feComponentTransfer");
  
      const feFuncR = document.createElementNS(svgNS, "feFuncR");
      feFuncR.setAttribute("type", "gamma");
      feFuncR.setAttribute("exponent", `${Math.max(0.9, Math.min(1.2, 1.05 * intensity))}`);
  
      const feFuncG = document.createElementNS(svgNS, "feFuncG");
      feFuncG.setAttribute("type", "gamma");
      feFuncG.setAttribute("exponent", `${Math.max(0.95, Math.min(1.2, 1.1 * intensity))}`);
  
      const feFuncB = document.createElementNS(svgNS, "feFuncB");
      feFuncB.setAttribute("type", "gamma");
      feFuncB.setAttribute("exponent", `${Math.max(1.0, Math.min(1.3, 1.15 * intensity))}`);
  
      feComponentTransfer.appendChild(feFuncR);
      feComponentTransfer.appendChild(feFuncG);
      feComponentTransfer.appendChild(feFuncB);
  
      filterEl.appendChild(feColorMatrix);
      filterEl.appendChild(feComponentTransfer);
      defs.appendChild(filterEl);
      svg.appendChild(defs);
      container.appendChild(svg);
      document.body.appendChild(container);
  
      // Apply filter to entire document
      document.documentElement.style.filter = `url(#${FILTER_ID})`;
      console.log("✅ Deuteranopia filter applied.");
    } else {
      // Clear the filter
      document.documentElement.style.filter = "none";
      console.log("❌ Deuteranopia filter disabled.");
    }
  
    return () => {
      const container = document.getElementById(FILTER_CONTAINER_ID);
      if (container) {
        container.remove();
        console.log("🧼 Cleanup: Filter container removed.");
      }
      document.documentElement.style.filter = "none";
    };
  }, [enabled, intensity]);
  

  return null;
};

export default DeuteranopiaFilter;
