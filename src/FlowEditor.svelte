<script lang="ts">
  import { SvelteFlow, Background, Controls, type Node, useSvelteFlow } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import { toPng } from "html-to-image";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { ImageIcon, HelpCircle, Type, PieChart as PieIcon } from "lucide-svelte";
  import JSZip from "jszip";
  import { exportProjectToZip } from "./utils/exportUtils";

  import MainWindowNode from "./nodes/MainWindowNode.svelte";
  import NewsNode from "./nodes/NewsNode.svelte";
  import EventNode from "./nodes/EventNode.svelte";
  import SupereventNode from "./nodes/SupereventNode.svelte";
  import SpiritNode from "./nodes/SpiritNode.svelte";
  import DescriptionNode from "./nodes/DescriptionNode.svelte";
  import TextNode from "./nodes/TextNode.svelte";
  import ImageNode from "./nodes/ImageNode.svelte";
  import StandalonePieNode from "./nodes/StandalonePieNode.svelte";

  import PropertiesPanel from "./components/PropertiesPanel.svelte";
  import Modal from "./components/Modal.svelte";
  import ProjectMenu from "./components/ProjectMenu.svelte";
  import SettingsPanel from "./components/SettingsPanel.svelte";
  import PresetManager from "./components/PresetManager.svelte";

  import { INITIAL_NODES, DEFAULT_CHART_DATA } from "./config/initialData";
  import { db } from "./utils/db";

  const nodeTypes = {
    mainWindow: MainWindowNode,
    news: NewsNode,
    event: EventNode,
    super: SupereventNode,
    spirit: SpiritNode,
    desc: DescriptionNode,
    text: TextNode,
    image: ImageNode,
    pie: StandalonePieNode,
  } as any;

  let nodes = $state<Node[]>([]);
  let selectedNode = $derived(nodes.find((n) => n.selected));

  let showAddMenu = $state(false);
  let showSettings = $state(false);
  let showPresets = $state(false);
  let isExporting = $state(false);
  let loadingStatus = $state("");

  // Global settings
  let canvasBgColor = $state("#121212");
  let themeColor = $state("#ff0071");
  let exportScale = $state(2);

  onMount(async () => {
    const saved = await db.getAutosave();
    if (saved && saved.nodes) {
      nodes = saved.nodes;
      canvasBgColor = saved.config?.bgColor || "#121212";
      themeColor = saved.config?.themeColor || "#ff0071";
      exportScale = saved.config?.exportScale || 2;
    } else {
      nodes = JSON.parse(JSON.stringify(INITIAL_NODES));
    }
  });

  let saveTimeout: any;
  $effect(() => {
    if (nodes.length > 0) {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        db.saveAutosave({
          nodes,
          config: { bgColor: canvasBgColor, themeColor, exportScale },
        });
      }, 1000);
    }
  });

  $effect(() => {
    document.documentElement.style.setProperty("--theme-color", themeColor);
  });

  function deleteNode(id: string) {
    nodes = nodes.filter((n) => n.id !== id);
  }

  function addWindow(type: string, pos?: { x: number; y: number }) {
    const id = `${type}-${Date.now()}`;
    let defaultData: any = { alias: "" };

    const initNode = INITIAL_NODES.find((n) => n.type === type);
    if (initNode && !["text", "image", "pie"].includes(type)) {
      defaultData = JSON.parse(JSON.stringify(initNode.data));
      defaultData.alias = "";
    } else {
      switch (type) {
        case "text":
          defaultData = { body: "请输入文本" };
          break;
        case "image":
          defaultData = { url: "", fit: "contain" };
          break;
        case "pie":
          defaultData = { chartData: JSON.parse(JSON.stringify(DEFAULT_CHART_DATA)) };
          break;
        default:
          defaultData = { alias: "" };
      }
    }

    nodes.push({
      id,
      type,
      position: pos || { x: 100, y: 100 },
      data: defaultData,
      width: initNode?.width || (type === "super" ? 800 : 400),
      height: initNode?.height || 400,
    });
    showAddMenu = false;
  }

  async function exportImage() {
    const flowElement = document.querySelector(".svelte-flow") as HTMLElement;
    if (!flowElement) return;
    isExporting = true;
    try {
      await new Promise((r) => setTimeout(r, 300));
      const dataUrl = await toPng(flowElement, {
        backgroundColor: canvasBgColor,
        pixelRatio: exportScale,
        filter: (node: any) =>
          node.classList ? !node.classList.contains("svelte-flow__controls") && !node.classList.contains("svelte-flow__panel") && !node.classList.contains("svelte-flow__handle") : true,
      });
      const link = document.createElement("a");
      link.download = `design-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      isExporting = false;
    }
  }

  async function exportZipProject() {
    isExporting = true;
    loadingStatus = "正在打包资源...";
    try {
      const config = { bgColor: canvasBgColor, themeColor, exportScale };
      const blob = await exportProjectToZip(nodes, config);
      const link = document.createElement("a");
      link.download = `full-project-${Date.now()}.zip`;
      link.href = URL.createObjectURL(blob);
      link.click();
    } catch (e) {
      console.error(e);
      alert("导出失败");
    } finally {
      isExporting = false;
      loadingStatus = "";
    }
  }

  async function importZipProject(file: File) {
    isExporting = true;
    loadingStatus = "正在解析压缩包...";
    try {
      const zip = await JSZip.loadAsync(file);
      const jsonFile = zip.file("project.json");
      if (!jsonFile) throw new Error("无效的项目文件：缺少 project.json");

      const projectData = JSON.parse(await jsonFile.async("string"));
      const nodesToImport = projectData.nodes;

      // Map to track relative path -> new blob URL
      const pathMap = new Map<string, string>();

      const restoreImage = async (path: string) => {
        if (!path || !path.startsWith("./assets/")) return path;
        if (pathMap.has(path)) return pathMap.get(path);

        const zipPath = path.replace("./", "");
        const imgFile = zip.file(zipPath);
        if (imgFile) {
          const blob = await imgFile.async("blob");
          // Save to custom pics so it's permanent
          const id = await db.addCustomPic("imported", imgFile.name, blob);
          const results = await db.getAllCustomPics("imported");
          const newUrl = results.find((r) => r.filename === imgFile.name)?.url;
          if (newUrl) {
            pathMap.set(path, newUrl);
            return newUrl;
          }
        }
        return path;
      };

      for (const node of nodesToImport) {
        const keys = ["leaderImg", "flagImg", "ideologyImg", "factionImg", "focusImg", "newsImg", "eventImg", "superImg", "url"];
        for (const k of keys) if (node.data[k]) node.data[k] = await restoreImage(node.data[k]);
        if (node.data.spirits) {
          for (const s of node.data.spirits) s.url = await restoreImage(s.url);
        }
      }

      nodes = nodesToImport;
      if (projectData.config) {
        canvasBgColor = projectData.config.bgColor || "#121212";
        themeColor = projectData.config.themeColor || "#ff0071";
        exportScale = projectData.config.exportScale || 2;
      }
    } catch (err: any) {
      alert("导入失败: " + err.message);
    } finally {
      isExporting = false;
      loadingStatus = "";
    }
  }

  function handleMenuAction(action: string, payload?: any) {
    switch (action) {
      case "add":
        showAddMenu = true;
        break;
      case "settings":
        showSettings = true;
        break;
      case "save-zip":
        showPresets = true;
        break;
      case "export-file":
        exportZipProject();
        break;
      case "load-zip-file":
        if (payload.name.endsWith(".zip")) {
          importZipProject(payload);
        } else {
          const r = new FileReader();
          r.onload = (e) => {
            try {
              const p = JSON.parse(e.target?.result as string);
              if (p.nodes) {
                nodes = p.nodes;
                if (p.config) {
                  canvasBgColor = p.config.bgColor;
                  themeColor = p.config.themeColor;
                  exportScale = p.config.exportScale;
                }
              } else {
                nodes = p;
              }
            } catch (e) {
              alert("文件错误");
            }
          };
          r.readAsText(payload);
        }
        break;
      case "clear":
        if (confirm("清空画布？")) nodes = [];
        break;
      case "export-png":
        exportImage();
        break;
    }
  }
</script>

<div class="flow-wrapper" style:background-color={canvasBgColor}>
  <div class="top-left-panel">
    <ProjectMenu onAction={handleMenuAction} />
  </div>

  {#if selectedNode}
    <div class="right-panel" transition:fade={{ duration: 150 }}>
      <PropertiesPanel node={selectedNode} onDelete={() => deleteNode(selectedNode!.id)} />
    </div>
  {/if}

  <!-- Modals -->
  <Modal title="添加内容" bind:isOpen={showAddMenu} width="500px" height="auto">
    <div class="add-container">
      <div class="add-section">
        <h4>窗口模板</h4>
        <div class="template-grid">
          <button onclick={() => addWindow("mainWindow")}><ImageIcon size={16} /> 角色主窗口</button>
          <button onclick={() => addWindow("news")}><ImageIcon size={16} /> 新闻窗口</button>
          <button onclick={() => addWindow("event")}><ImageIcon size={16} /> 事件窗口</button>
          <button onclick={() => addWindow("super")}><ImageIcon size={16} /> 超级事件</button>
          <button onclick={() => addWindow("spirit")}><ImageIcon size={16} /> 国家精神栏</button>
          <button onclick={() => addWindow("desc")}><ImageIcon size={16} /> 角色描述</button>
        </div>
      </div>
      <div class="add-section">
        <h4>原子组件</h4>
        <div class="template-grid">
          <button onclick={() => addWindow("text")}><Type size={16} /> 独立文字</button>
          <button onclick={() => addWindow("image")}><ImageIcon size={16} /> 独立图片</button>
          <button onclick={() => addWindow("pie")}><PieIcon size={16} /> 独立饼图</button>
        </div>
      </div>
    </div>
  </Modal>

  <Modal title="本地存档管理" bind:isOpen={showPresets} width="600px">
    <PresetManager
      bind:nodes
      config={{ bgColor: canvasBgColor, themeColor, exportScale }}
      onLoaded={() => (showPresets = false)}
      onConfigLoad={(c: any) => {
        canvasBgColor = c.bgColor || canvasBgColor;
        themeColor = c.themeColor || themeColor;
        exportScale = c.exportScale || exportScale;
      }}
    />
  </Modal>

  <Modal title="系统设置" bind:isOpen={showSettings} width="500px" height="auto">
    <SettingsPanel bind:bgColor={canvasBgColor} bind:themeColor bind:exportScale />
  </Modal>

  <SvelteFlow bind:nodes {nodeTypes} initialViewport={{ zoom: 1, x: 50, y: 50 }} snapGrid={[10, 10]}>
    <Background gap={20} patternColor="#333" bgColor={canvasBgColor} />
    <Controls position="bottom-left" />
  </SvelteFlow>

  {#if isExporting}
    <div class="export-overlay" transition:fade>
      <div class="loader">{loadingStatus || `正在生成 ${exportScale}x 截图...`}</div>
    </div>
  {/if}
</div>

<style>
  .flow-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  .top-left-panel {
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .status-badge {
    background: rgba(0, 0, 0, 0.6);
    color: #888;
    font-size: 10px;
    padding: 4px 10px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #333;
    width: fit-content;
  }
  .dot {
    width: 6px;
    height: 6px;
    background: #44ff44;
    border-radius: 50%;
    box-shadow: 0 0 5px #44ff44;
  }
  .right-panel {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 1000;
    width: 320px;
    background: #1e1e1e;
    border: 1px solid #444;
    border-radius: 12px;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
    padding: 20px;
  }
  .add-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .add-section h4 {
    margin: 0 0 10px 0;
    font-size: 12px;
    color: #666;
    text-transform: uppercase;
  }
  .template-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .template-grid button {
    background: #2a2a2a;
    border: 1px solid #444;
    color: white;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    transition: 0.2s;
  }
  .template-grid button:hover {
    background: #333;
    border-color: var(--theme-color);
    transform: translateX(5px);
  }
  .export-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--theme-color);
    font-family: "Cubic", sans-serif;
    font-size: 20px;
  }
</style>
