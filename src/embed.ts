// Apply the agency theme before the embed renders.
(() => {
  const value = new URLSearchParams(window.location.search).get("color");
  if (!value || !/^#?(?:[\da-f]{3}|[\da-f]{6})$/i.test(value)) return;

  let hex = value.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map(char => char + char).join("");
  const rgb = [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
  const luminance = (channels: number[]) => channels.reduce((sum, channel, index) => {
    const s = channel / 255;
    const linear = s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    return sum + linear * [0.2126, 0.7152, 0.0722][index];
  }, 0);
  const color = (channels: number[]) => `#${channels.map(channel => channel.toString(16).padStart(2, "0")).join("")}`;
  const accent = color(rgb);
  const foreground = luminance(rgb) > 0.179 ? "#000000" : "#ffffff";
  // Darken light agency colors for headings and savings displayed on white.
  let textRgb = [...rgb];
  while (luminance(textRgb) > (1.05 / 4.5 - 0.05)) {
    textRgb = textRgb.map(channel => Math.floor(channel * 0.9));
  }
  const root = document.documentElement;
  root.style.setProperty("--transbay-red", color(textRgb));
  root.style.setProperty("--bay-gold", color(textRgb));
  root.style.setProperty("--transbay-teal", color(textRgb.map(channel => Math.floor(channel * 0.75))));
  root.style.setProperty("--embed-accent", accent);
  root.style.setProperty("--embed-highlight", color(textRgb));
  root.style.setProperty("--embed-foreground", foreground);
  root.dataset.embedTheme = "custom";
})();
