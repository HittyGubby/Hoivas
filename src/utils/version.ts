import { writable } from "svelte/store";

export type ProjectVersion = "tfr" | "tno" | "pb";

export const currentVersion = writable<ProjectVersion | null>(null);

export function setVersion(version: ProjectVersion) {
  currentVersion.set(version);
  localStorage.setItem("hoivas-version", version);
}

export function getVersion(): string | null {
  return localStorage.getItem("hoivas-version");
}

// Initialize from localStorage if available
const savedVersion = localStorage.getItem("hoivas-version");
if (savedVersion === "tfr" || savedVersion === "tno" || savedVersion === "pb") {
  currentVersion.set(savedVersion);
}
