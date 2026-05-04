import JSZip from "jszip";
import { db } from "./db";

export async function exportProjectToZip(nodes: any[], config: { bgColor: string; themeColor: string; exportScale: number }, focusNodes: any[] = [], focusEdges: any[] = []) {
  const zip = new JSZip();
  const assetsFolder = zip.folder("assets");
  const assetMap = new Map<string, string>();
  const usedFilenames = new Map<string, number>();

  function getUniqueFilename(baseName: string, ext: string): string {
    const fullName = `${baseName}.${ext}`;
    if (!usedFilenames.has(fullName)) {
      usedFilenames.set(fullName, 1);
      return fullName;
    }
    const count = usedFilenames.get(fullName)! + 1;
    usedFilenames.set(fullName, count);
    return `${baseName}_${count}.${ext}`;
  }

  const processImage = async (url: string) => {
    if (!url) return url;
    if (assetMap.has(url)) return assetMap.get(url);
    // Vanilla/local site images: keep URL as-is, don't include in ZIP
    if (!url.startsWith("blob:")) return url;

    // Custom uploaded image: include in ZIP assets
    try {
      const picInfo = await db.getCustomPicByUrl(url);
      if (picInfo) {
        const originalFilename = picInfo.filename.replace(/\.[^.]+$/, "") || "custom";
        const ext = picInfo.blob.type.split("/")[1] || "png";
        const filename = getUniqueFilename(originalFilename, ext);
        assetsFolder?.file(filename, picInfo.blob);
        const relativePath = `./assets/${filename}`;
        assetMap.set(url, relativePath);
        return relativePath;
      }
    } catch (e) {
      console.warn("Failed to export custom image:", url, e);
    }
    return url;
  };

  const nodesToExport = JSON.parse(JSON.stringify(nodes));
  for (const node of nodesToExport) {
    const keys = ["leaderImg", "flagImg", "ideologyImg", "factionImg", "focusImg", "newsImg", "eventImg", "superImg", "url"];
    for (const k of keys) {
      if (node.data && node.data[k]) {
        node.data[k] = await processImage(node.data[k]);
      }
    }
    if (node.data && node.data.spirits) {
      for (const s of node.data.spirits) {
        if (s.url) s.url = await processImage(s.url);
      }
    }
  }

  // Process focus nodes
  const focusNodesToExport = JSON.parse(JSON.stringify(focusNodes));
  for (const node of focusNodesToExport) {
    if (node.data && node.data.icon) {
      node.data.icon = await processImage(node.data.icon);
    }
  }

  zip.file("project.json", JSON.stringify({ nodes: nodesToExport, focusNodes: focusNodesToExport, focusEdges, config }, null, 2));
  return await zip.generateAsync({ type: "blob" });
}
