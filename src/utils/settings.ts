import { writable } from "svelte/store";

export interface GlobalSettings {
  bgColor: string;
  themeColor: string;
  exportScale: number;
}

export const globalSettings = writable<GlobalSettings>({
  bgColor: "#121212",
  themeColor: "#ff0071",
  exportScale: 2,
});

// Load from localStorage if available
const saved = localStorage.getItem("hoivas-settings");
if (saved) {
  try {
    globalSettings.set(JSON.parse(saved));
  } catch (e) {
    console.error("Failed to load settings", e);
  }
}

globalSettings.subscribe((value) => {
  localStorage.setItem("hoivas-settings", JSON.stringify(value));
  document.documentElement.style.setProperty("--theme-color", value.themeColor);
});
