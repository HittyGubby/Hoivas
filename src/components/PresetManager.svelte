<script lang="ts">
  import { onMount } from "svelte";
  import JSZip from "jszip";
  import { db } from "../utils/db";
  import { Trash2, RotateCcw, Save, FileJson, Clock, Download, Upload } from "lucide-svelte";
  import { exportProjectToZip } from "../utils/exportUtils";

  let {
    nodes = $bindable(),
    focusNodes = $bindable([]),
    focusEdges = $bindable([]),
    config = {},
    onLoaded,
    onConfigLoad,
  } = $props();
  let projects = $state<any[]>([]);
  let newName = $state("");
  let isExporting = $state(false);

  async function refresh() {
    projects = await db.getAllProjects();
  }

  onMount(refresh);

  async function handleSave() {
    if (!newName) return;
    await db.saveProject(newName, nodes, focusNodes, focusEdges, config);
    newName = "";
    await refresh();
  }

  async function handleLoad(p: any) {
    if (confirm(`载入项目 "${p.name}"？这会覆盖当前画布。`)) {
      nodes = JSON.parse(JSON.stringify(p.nodes));
      focusNodes = JSON.parse(JSON.stringify(p.focusNodes || []));
      focusEdges = JSON.parse(JSON.stringify(p.focusEdges || []));
      if (p.config && onConfigLoad) onConfigLoad(p.config);
      onLoaded?.();
    }
  }

  async function handleDelete(id: number) {
    if (confirm("确定删除此存档？")) {
      await db.deleteProject(id);
      await refresh();
    }
  }

  async function handleExport(p: any) {
    if (isExporting) return;
    isExporting = true;
    try {
      const cfg = {
        bgColor: p.config?.bgColor || "#121212",
        themeColor: p.config?.themeColor || "#ff0071",
        exportScale: p.config?.exportScale || 2,
      };
      const blob = await exportProjectToZip(
        p.nodes,
        cfg,
        p.focusNodes || [],
        p.focusEdges || [],
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${p.name}_${new Date(p.timestamp).toISOString().split("T")[0]}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("导出失败");
    } finally {
      isExporting = false;
    }
  }

  async function handleImportZip(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".zip")) {
      alert("请选择 .zip 文件");
      return;
    }

    isExporting = true;
    try {
      const zip = await JSZip.loadAsync(file);
      const jsonFile = zip.file("project.json");
      if (!jsonFile) throw new Error("无效的项目文件：缺少 project.json");

      const projectData = JSON.parse(await jsonFile.async("string"));
      const nodesToImport = projectData.nodes || [];

      // Restore ./assets/ paths to blob URLs by importing to IndexedDB
      const pathMap = new Map<string, string>();
      const restoreImage = async (path: string) => {
        if (!path || !path.startsWith("./assets/")) return path;
        if (pathMap.has(path)) return pathMap.get(path)!;

        const zipPath = path.replace("./", "");
        const imgFile = zip.file(zipPath);
        if (imgFile) {
          const blob = await imgFile.async("blob");
          await db.addCustomPic("imported", imgFile.name, blob);
          const results = await db.getAllCustomPics("imported");
          const newUrl = results.find((r: any) => r.filename === imgFile.name)?.url;
          if (newUrl) {
            pathMap.set(path, newUrl);
            return newUrl;
          }
        }
        return path;
      };

      for (const node of nodesToImport) {
        const keys = ["leaderImg", "flagImg", "ideologyImg", "factionImg", "focusImg", "newsImg", "eventImg", "superImg", "url"];
        for (const k of keys) {
          if (node.data?.[k]) node.data[k] = await restoreImage(node.data[k]);
        }
        if (node.data?.spirits) {
          for (const s of node.data.spirits) {
            if (s.url) s.url = await restoreImage(s.url);
          }
        }
      }

      const focusNodesToImport = projectData.focusNodes || [];
      for (const node of focusNodesToImport) {
        if (node.data?.icon) node.data.icon = await restoreImage(node.data.icon);
      }

      // Save as a new project
      const name = file.name.replace(/\.zip$/, "");
      await db.saveProject(
        name,
        nodesToImport,
        focusNodesToImport,
        projectData.focusEdges || [],
        projectData.config || {},
      );
      await refresh();
    } catch (err: any) {
      alert("导入失败: " + err.message);
    } finally {
      isExporting = false;
    }
  }
</script>

<div class="preset-manager">
  <div class="save-bar">
    <div class="input-box">
      <FileJson size={16} />
      <input type="text" bind:value={newName} placeholder="输入新存档名称..." />
    </div>
    <button class="save-btn" onclick={handleSave} disabled={!newName}>
      <Save size={14} /> 保存当前画布
    </button>
    <label class="import-btn">
      <Upload size={14} /> 导入ZIP
      <input type="file" accept=".zip" onchange={handleImportZip} style="display: none;" />
    </label>
  </div>

  <div class="project-grid">
    {#each projects as p}
      <div class="project-card">
        <div class="card-info">
          <p class="name">{p.name}</p>
          <p class="time"><Clock size={10} /> {new Date(p.timestamp).toLocaleString()}</p>
        </div>
        <div class="card-ops">
          <button class="export-btn-styled" onclick={() => handleExport(p)} disabled={isExporting}>
            <Download size={14} />
            {isExporting ? "正在导出..." : "导出"}
          </button>
          <button class="load-btn" onclick={() => handleLoad(p)}><RotateCcw size={14} /> 载入</button>
          <button class="del-btn" onclick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
        </div>
      </div>
    {/each}
    {#if projects.length === 0}
      <div class="empty">暂无本地项目存档</div>
    {/if}
  </div>
</div>

<style>
  .preset-manager {
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: #eee;
    height: 100%;
    min-height: 0;
  }
  .save-bar {
    display: flex;
    gap: 10px;
    background: #111;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #333;
  }
  .input-box {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    background: #222;
    padding: 0 12px;
    border-radius: 6px;
    border: 1px solid #444;
  }
  .input-box input {
    background: transparent;
    border: none;
    color: white;
    padding: 8px 0;
    outline: none;
    width: 100%;
    font-size: 14px;
  }
  .input-box :global(svg) {
    color: #666;
  }

  .save-btn {
    color: white;
    border: none;
    padding: 0 20px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: bold;
    background: var(--theme-color);
  }
  .save-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .import-btn {
    background: #224422;
    color: #88ff88;
    border: 1px solid #336633;
    padding: 0 16px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: bold;
    white-space: nowrap;
  }
  .import-btn:hover {
    background: #2a5a2a;
  }

  .project-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    flex: 1;
    padding-right: 5px;
    align-content: start;
  }

  .project-card {
    background: #252525;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 12px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: 0.2s;
  }
  .project-card:hover {
    border-color: #555;
    background: #2a2a2a;
  }

  .card-info .name {
    font-size: 15px;
    color: #fff;
    margin: 0 0 4px 0;
    font-family: "Cubic";
  }
  .card-info .time {
    font-size: 11px;
    color: #666;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .card-ops {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-shrink: 0;
  }
  .load-btn {
    background: #333;
    color: #ccc;
    border: 1px solid #444;
    padding: 6px 15px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    white-space: nowrap;
  }
  .load-btn:hover {
    background: #444;
    color: white;
    border-color: var(--theme-color);
  }

  .export-btn-styled {
    background: #333;
    color: #ccc;
    border: 1px solid #444;
    padding: 6px 15px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    white-space: nowrap;
  }
  .export-btn-styled:hover {
    background: #444;
    color: white;
    border-color: #4a9eff;
  }
  .export-btn-styled:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .del-btn {
    background: transparent;
    color: #666;
    border: none;
    padding: 8px;
    cursor: pointer;
    border-radius: 6px;
  }
  .del-btn:hover {
    color: #ff8888;
    background: #442222;
  }

  .empty {
    text-align: center;
    color: #555;
    padding: 40px;
    border: 1px dashed #333;
    border-radius: 10px;
  }
</style>
