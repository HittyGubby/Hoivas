import { getContext } from "svelte";

/**
 * Resolves asset paths based on the current version.
 * If the path starts with /preset, /template, or /sfx, it prepends the version.
 */
export function resolveAsset(path: string, version: string | null): string {
  if (!path) return "";
  if (!version) return path;

  // If already prefixed or external, return as is
  if (
    path.startsWith(`/${version}/`) ||
    path.startsWith("http") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  // Prefix relevant paths
  if (
    path.startsWith("/preset") ||
    path.startsWith("/template") ||
    path.startsWith("/data")
  ) {
    return `/${version}${path}`;
  }

  return path;
}
