import { mountCalculator } from "./app.js";
import { applyEmbedTheme } from "./embed.js";

if (document.querySelector(".embed-primary")) {
  applyEmbedTheme(document.documentElement, new URLSearchParams(window.location.search).get("color"));
}
void mountCalculator(document);
