<script lang="ts">
  import { SvelteFlow, Background, Controls, type Node, type Edge, useSvelteFlow, ConnectionMode } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import { toPng } from "html-to-image";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { ImageIcon, HelpCircle, Type, PieChart as PieIcon, Plus, TreePine } from "lucide-svelte";
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
  import FocusNode from "./nodes/FocusNode.svelte";
  import FocusStepEdge from "./edges/FocusStepEdge.svelte";

  import PropertiesPanel from "./components/PropertiesPanel.svelte";
  import Modal from "./components/Modal.svelte";
  import ProjectMenu from "./components/ProjectMenu.svelte";
  import SettingsPanel from "./components/SettingsPanel.svelte";
  import PresetManager from "./components/PresetManager.svelte";

  import { INITIAL_NODES, INITIAL_FOCUS_NODES, INITIAL_FOCUS_EDGES, DEFAULT_CHART_DATA } from "./config/initialData";
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
    focus: FocusNode,
  } as any;

  const edgeTypes = {
    focusStep: FocusStepEdge,
  } as any;

  // Page state
  let activePage = $state<"event" | "focus">("event");

  // Event page data
  let nodes = $state<Node[]>([]);
  let selectedNode = $derived(nodes.find((n) => n.selected));

  // Focus page data
  let focusNodes = $state<Node[]>([]);
  let focusEdges = $state<Edge[]>([]);
  let selectedFocusNode = $derived(focusNodes.find((n) => n.selected));

  // Which node/edge is selected for the properties panel
  let panelNode = $derived(activePage === "focus" ? selectedFocusNode : selectedNode);

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
      focusNodes = saved.focusNodes || [];
      focusEdges = saved.focusEdges || [];
      canvasBgColor = saved.config?.bgColor || "#121212";
      themeColor = saved.config?.themeColor || "#ff0071";
      exportScale = saved.config?.exportScale || 2;
    } else {
      nodes = JSON.parse(JSON.stringify(INITIAL_NODES));
      focusNodes = JSON.parse(JSON.stringify(INITIAL_FOCUS_NODES));
      focusEdges = JSON.parse(JSON.stringify(INITIAL_FOCUS_EDGES));
    }
  });

  let saveTimeout: any;
  $effect(() => {
    if (nodes.length > 0 || focusNodes.length > 0) {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        db.saveAutosave({
          nodes,
          focusNodes,
          focusEdges,
          config: { bgColor: canvasBgColor, themeColor, exportScale },
        });
      }, 1000);
    }
  });

  $effect(() => {
    document.documentElement.style.setProperty("--theme-color", themeColor);
  });

  function deleteNode(id: string) {
    if (activePage === "focus") {
      focusNodes = focusNodes.filter((n) => n.id !== id);
      focusEdges = focusEdges.filter((e) => e.source !== id && e.target !== id);
    } else {
      nodes = nodes.filter((n) => n.id !== id);
    }
  }

  function deleteFocusEdge(id: string) {
    focusEdges = focusEdges.filter((e) => e.id !== id);
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

  function addFocusNode(pos?: { x: number; y: number }) {
    const id = `focus-${Date.now()}`;
    focusNodes.push({
      id,
      type: "focus",
      position: pos || { x: 200 + Math.random() * 100, y: 100 + Math.random() * 100 },
      data: { icon: "", label: "新国策", status: "unavailable" },
    });
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
      const blob = await exportProjectToZip(nodes, config, focusNodes, focusEdges);
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

      const pathMap = new Map<string, string>();

      const restoreImage = async (path: string) => {
        if (!path || !path.startsWith("./assets/")) return path;
        if (pathMap.has(path)) return pathMap.get(path);

        const zipPath = path.replace("./", "");
        const imgFile = zip.file(zipPath);
        if (imgFile) {
          const blob = await imgFile.async("blob");
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
        const keys = ["leaderImg", "flagImg", "ideologyImg", "factionImg", "focusImg", "newsImg", "eventImg", "superImg", "url", "icon"];
        for (const k of keys) if (node.data[k]) node.data[k] = await restoreImage(node.data[k]);
        if (node.data.spirits) {
          for (const s of node.data.spirits) s.url = await restoreImage(s.url);
        }
      }

      nodes = nodesToImport;
      focusNodes = projectData.focusNodes || [];
      focusEdges = projectData.focusEdges || [];

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
                focusNodes = p.focusNodes || [];
                focusEdges = p.focusEdges || [];
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
        if (confirm("清空画布？")) {
          if (activePage === "focus") {
            focusNodes = [];
            focusEdges = [];
          } else {
            nodes = [];
          }
        }
        break;
      case "export-png":
        exportImage();
        break;
    }
  }
</script>

<div class="flow-wrapper" style:background-color={canvasBgColor}>
  <div class="top-left-panel">
    <div class="top-bar-row">
      <ProjectMenu onAction={handleMenuAction} />
      <div class="page-toggle">
        <button class:active={activePage === "event"} onclick={() => (activePage = "event")}>事件</button>
        <button class:active={activePage === "focus"} onclick={() => (activePage = "focus")}>国策树</button>
      </div>
      {#if activePage === "focus"}
        <button class="add-focus-btn" onclick={() => addFocusNode()}>
          <Plus size={14} /> 添加国策
        </button>
      {/if}
    </div>
  </div>

  {#if panelNode}
    <div class="right-panel" transition:fade={{ duration: 150 }}>
      <PropertiesPanel node={panelNode} onDelete={() => deleteNode(panelNode!.id)} focusEdges={activePage === "focus" ? focusEdges : []} onDeleteEdge={(id: string) => deleteFocusEdge(id)} />
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

  {#if activePage === "event"}
    <SvelteFlow bind:nodes {nodeTypes} initialViewport={{ zoom: 1, x: 50, y: 50 }} snapGrid={[10, 10]} connectionMode={ConnectionMode.Loose}>
      <Background gap={20} patternColor="#333" bgColor={canvasBgColor} />
      <Controls position="bottom-left" />
    </SvelteFlow>
  {:else}
    <SvelteFlow
      bind:nodes={focusNodes}
      bind:edges={focusEdges}
      {nodeTypes}
      {edgeTypes}
      initialViewport={{ zoom: 1, x: 50, y: 50 }}
      snapGrid={[10, 10]}
      defaultEdgeOptions={{ type: "focusStep", data: { dashed: false, exclusive: false, completed: false } }}
      fitView
      connectionMode={ConnectionMode.Loose}
    >
      <Background gap={20} patternColor="#333" bgColor={canvasBgColor} />
      <Controls position="bottom-left" />
    </SvelteFlow>
  {/if}

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
  .top-bar-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .page-toggle {
    display: flex;
    gap: 2px;
    background: #111;
    padding: 3px;
    border-radius: 8px;
    border: 1px solid #333;
  }
  .page-toggle button {
    background: transparent;
    border: none;
    color: #888;
    padding: 7px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-family: "Cubic", sans-serif;
    transition: 0.2s;
  }
  .page-toggle button.active {
    background: #333;
    color: var(--theme-color);
  }
  .page-toggle button:hover:not(.active) {
    color: #ccc;
  }
  .add-focus-btn {
    background: #224422;
    color: #88ff88;
    border: 1px solid #336633;
    padding: 7px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-family: "Cubic", sans-serif;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: 0.2s;
  }
  .add-focus-btn:hover {
    background: #2a5a2a;
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
