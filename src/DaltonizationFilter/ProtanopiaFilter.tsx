import { useEffect } from "react";
import { useColorBlind } from "../DaltonizationFilter/ColorBlindContext";

const FILTER_CONTAINER_ID = "protanopia-filter";
const FILTER_ID = "protanopia-enhanced";

const ProtanopiaFilter = () => {
  const { filter, intensity } = useColorBlind();
  const enabled = filter === "protanopia";

  useEffect(() => {
    console.log("🔍 ProtanopiaFilter useEffect triggered. Enabled:", enabled, "Intensity:", intensity);

    const existingContainer = document.getElementById(FILTER_CONTAINER_ID);

    if (enabled) {
      if (!existingContainer) {
        console.log("⚠️ Creating new Protanopia filter...");
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
            ${Math.max(0.6, 0.567 * intensity)} ${Math.max(0.3, 0.433 * intensity)} 0.0 0.0 0.0
            ${Math.max(0.5, 0.558 * intensity)} ${Math.max(0.4, 0.442 * intensity)} 0.0 0.0 0.0
            0.000 ${Math.max(0.2, 0.242 * intensity)} ${Math.max(0.7, 0.758 * intensity)} 0.0 0.0
            0.0 0.0 0.0 1.0 0.0
          `
        );

        const feComponentTransfer = document.createElementNS(svgNS, "feComponentTransfer");

        const feFuncR = document.createElementNS(svgNS, "feFuncR");
        feFuncR.setAttribute("type", "gamma");
        feFuncR.setAttribute("exponent", `${Math.max(0.9, Math.min(1.2, 1.1 * intensity))}`);

        const feFuncG = document.createElementNS(svgNS, "feFuncG");
        feFuncG.setAttribute("type", "gamma");
        feFuncG.setAttribute("exponent", `${Math.max(0.95, Math.min(1.2, 1.05 * intensity))}`);

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

        console.log("✅ Protanopia filter created.");
      }

      // Apply the filter to the whole app
      document.documentElement.style.filter = `url(#${FILTER_ID})`;
      console.log("🎨 Protanopia filter applied.");
    } else {
      if (existingContainer) {
        existingContainer.remove();
        console.log("🧽 Removed Protanopia filter container.");
      }
      document.documentElement.style.filter = "none";
      console.log("❌ Protanopia filter disabled.");
    }

    return () => {
      // Clean up only if filter mode changes or unmounts
      console.log("🧼 Cleanup on unmount or change.");
    };
  }, [enabled, intensity]);

  return null;
};

export default ProtanopiaFilter;
