import { mountCalculator } from "./app.js";
import { applyEmbedTheme } from "./embed.js";

const assetBase = new URL(".", import.meta.url);

async function loadText(path: string) {
  const response = await fetch(new URL(path, assetBase));
  if (!response.ok) throw new Error(`Could not load ${path}: ${response.status}`);
  return response.text();
}

// Reuse the iframe's markup and stylesheet so both embeds stay in sync.
const resources = Promise.all([loadText("embed.html"), loadText("styles.css")]);

async function mount(host: HTMLElement) {
  if (host.shadowRoot) return;
  const shadow = host.attachShadow({ mode: "open" });
  host.setAttribute("aria-busy", "true");
  shadow.textContent = "Loading calculator…";
  try {
    const [html, css] = await resources;
    const template = new DOMParser().parseFromString(html, "text/html");
    const main = template.querySelector("main");
    if (!main) throw new Error("Calculator markup is missing");
    const style = document.createElement("style");
    // Browsers do not consistently register @property inside shadow roots.
    // Supply Tailwind's defaults locally, without registering them on the host page.
    const defaults = Array.from(css.matchAll(/@property\s+([\w-]+)\s*\{([^}]+)\}/g), match => {
      const initial = match[2].match(/initial-value\s*:\s*([^;}]+)/)?.[1] ?? "initial";
      return `${match[1]}:${initial};`;
    }).join("");
    style.textContent = css.replace(/:root/g, ":host") + `
      @layer properties { *, ::before, ::after { ${defaults} } }
      :host { all: initial; display: block; min-width: 0; }
      .calculator { font: 16px var(--font-body); line-height: 1.5;
        color: #0f172a; background: white; text-align: left; }
    ` + Array.from(template.querySelectorAll("style"), el => el.textContent).join("\n");
    const wrapper = document.createElement("div");
    wrapper.className = "calculator";
    wrapper.append(document.importNode(main, true));
    shadow.replaceChildren(style, wrapper);
    const fonts = template.querySelector<HTMLLinkElement>('link[href*="fonts.googleapis.com"]');
    if (fonts) shadow.prepend(document.importNode(fonts, true));
    const color = host.dataset.color ?? new URLSearchParams(window.location.search).get("color");
    applyEmbedTheme(wrapper, color);
    const tripUrl = new URL(window.location.href);
    if (color) tripUrl.searchParams.set("color", color);
    // Shared URL trips take precedence over an agency's default trip.
    tripUrl.hash = /^#(?:adult|youth|smd)(?:#|$)/.test(window.location.hash)
      ? window.location.hash : host.dataset.trip ?? "";
    await mountCalculator(shadow, assetBase, tripUrl, false);
  } catch (error) {
    console.error("Could not load Clipper calculator:", error);
    shadow.textContent = "The calculator could not load. Please reload the page to try again.";
  } finally {
    host.removeAttribute("aria-busy");
  }
}

function initialize() {
  document.querySelectorAll<HTMLElement>("[data-clipper-calculator]").forEach(host => { void mount(host); });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
  initialize();
}
