<script lang="ts">
  import ChartEditor from "./ChartEditor.svelte";
  import PicManager from "./PicManager.svelte";
  import ImageListEditor from "./ImageListEditor.svelte";
  import RichTextEditor from "./RichTextEditor.svelte";
  import Modal from "./Modal.svelte";
  import {
    Type,
    ImageIcon,
    PieChart as PieIcon,
    Settings,
    Trash2,
    Maximize,
  } from "lucide-svelte";

  let { node, onDelete, focusEdges = [], onDeleteEdge = undefined } = $props();

  // Helper for direct binding to nested data
  let data = $derived(node.data);

  let showChartEditor = $state(false);
  let showSpiritEditor = $state(false);
  let showRichTextEditor = $state(false);
  let richTextTargetKey = $state("");
  let richTextTitle = $state("");

  let showPicManager = $state(false);
  let currentPicCategory = $state("");
  let currentPicKey = $state("");

  function openRichText(key: string, title: string) {
    richTextTargetKey = key;
    richTextTitle = title;
    showRichTextEditor = true;
  }

  function openPicManager(category: string, key: string) {
    currentPicCategory = category;
    currentPicKey = key;
    showPicManager = true;
  }

  function handlePicSelect(url: string) {
    data[currentPicKey] = url;
    showPicManager = false;
  }
</script>

<div class="props-form">
  <div class="form-header">
    <div class="alias-group">
      <Settings size={12} />
      <input
        type="text"
        bind:value={node.data.alias}
        placeholder="设置窗口别名..."
        class="alias-input"
      />
    </div>
    <button class="delete-node-btn" onclick={onDelete} title="删除此窗口"
      ><Trash2 size={14} /></button
    >
  </div>

  {#if node.type === "mainWindow"}
    <div class="section">
      <label>国家名称</label>
      <div class="input-group">
        <input type="text" bind:value={data.country} />
        <button
          class="rich-trigger"
          onclick={() => openRichText("country", "编辑国家名称")}>+</button
        >
      </div>
    </div>
    <div class="section">
      <label>领袖姓名</label>
      <div class="input-group">
        <input type="text" bind:value={data.leaderName} />
        <button
          class="rich-trigger"
          onclick={() => openRichText("leaderName", "编辑领袖姓名")}>+</button
        >
      </div>
    </div>

    <div class="section">
      <label>阵营名称</label>
      <div class="input-group">
        <input type="text" bind:value={data.factionText} />
        <button
          class="rich-trigger"
          onclick={() => openRichText("factionText", "编辑阵营名称")}>+</button
        >
      </div>
    </div>
    <div class="section">
      <label>政党名称</label>
      <div class="input-group">
        <input type="text" bind:value={data.partyName} />
        <button
          class="rich-trigger"
          onclick={() => openRichText("partyName", "编辑政党名称")}>+</button
        >
      </div>
    </div>
    <div class="section">
      <label>意识形态名称</label>
      <div class="input-group">
        <input type="text" bind:value={data.ideologyName} />
        <button
          class="rich-trigger"
          onclick={() => openRichText("ideologyName", "编辑阵营名称")}>+</button
        >
      </div>
    </div>
    <div class="section">
      <label>选举</label>
      <div class="input-group">
        <input type="text" bind:value={data.electionText} />
        <button
          class="rich-trigger"
          onclick={() => openRichText("electionText", "编辑选举")}>+</button
        >
      </div>
    </div>
    <div class="section">
      <label>国策</label>
      <div class="input-group">
        <input type="text" bind:value={data.focusText} />
        <button
          class="rich-trigger"
          onclick={() => openRichText("focusText", "编辑国策")}>+</button
        >
      </div>
    </div>

    <div class="section-row">
      <div class="sub-col">
        <button
          class="editor-trigger secondary"
          onclick={() => openPicManager("leader", "leaderImg")}>更换头像</button
        >
      </div>
      <div class="sub-col">
        <button
          class="editor-trigger secondary"
          onclick={() => openPicManager("flag", "flagImg")}>更换国旗</button
        >
      </div>
    </div>

    <!-- Ideology with Scale -->
    <div class="section icon-scale-row">
      <div class="sub-col">
        <label>意识形态图标</label>
        <button
          class="editor-trigger secondary"
          onclick={() => openPicManager("ideology", "ideologyImg")}
          >更换意识形态图标</button
        >
      </div>
      <div class="sub-col narrow">
        <label>缩放</label>
        <input
          type="number"
          step="0.1"
          bind:value={data.ideologyScale}
          placeholder="1.0"
          class="styled-input"
        />
      </div>
    </div>

    <!-- Faction with Scale -->
    <div class="section icon-scale-row">
      <div class="sub-col">
        <label>阵营图标</label>
        <button
          class="editor-trigger secondary"
          onclick={() => openPicManager("faction", "factionImg")}
          >更换阵营图标</button
        >
      </div>
      <div class="sub-col narrow">
        <label>缩放</label>
        <input
          type="number"
          step="0.1"
          bind:value={data.factionScale}
          placeholder="1.0"
          class="styled-input"
        />
      </div>
    </div>

    <!-- Focus with Scale -->
    <div class="section icon-scale-row">
      <div class="sub-col">
        <label>国策图标</label>
        <button
          class="editor-trigger secondary"
          onclick={() => openPicManager("focus", "focusImg")}
          >更换国策图标</button
        >
      </div>
      <div class="sub-col narrow">
        <label>缩放</label>
        <input
          type="number"
          step="0.1"
          bind:value={data.focusScale}
          placeholder="0.9"
          class="styled-input"
        />
      </div>
    </div>

    <div class="section">
      <label>国策进度</label>
      <input type="range" min="0" max="235" bind:value={data.progress} />
    </div>

    <div class="section">
      <button class="editor-trigger" onclick={() => (showChartEditor = true)}
        >编辑饼图数据</button
      >
    </div>
  {:else if node.type === "news" || node.type === "event"}
    <div class="section">
      <label>标题</label>
      <div class="input-group">
        <input type="text" bind:value={data.title} class="styled-input" />
        <button
          class="rich-trigger"
          onclick={() => openRichText("title", "编辑标题")}>+</button
        >
      </div>
    </div>
    <div class="section">
      <button
        class="editor-trigger secondary"
        onclick={() => openPicManager(node.type, node.type + "Img")}
        >更换图片</button
      >
    </div>
    <div class="section">
      <label>正文内容</label>
      <div class="input-group">
        <textarea rows="4" bind:value={data.body} class="styled-input"
        ></textarea>
        <button
          class="rich-trigger"
          onclick={() => openRichText("body", "编辑正文内容")}>+</button
        >
      </div>
    </div>
    <div class="section">
      <label>按钮文字</label>
      <div class="input-group">
        <input type="text" bind:value={data.buttonText} class="styled-input" />
        <button
          class="rich-trigger"
          onclick={() => openRichText("buttonText", "编辑按钮文字")}>+</button
        >
      </div>
    </div>
  {:else if node.type === "super"}
    <div class="section">
      <label>标题</label>
      <div class="input-group">
        <input type="text" bind:value={data.title} class="styled-input" />
        <button
          class="rich-trigger"
          onclick={() => openRichText("title", "编辑标题")}>+</button
        >
      </div>
    </div>
    <div class="section">
      <button
        class="editor-trigger secondary"
        onclick={() => openPicManager("super", "superImg")}>更换背景图</button
      >
    </div>
    <div class="section">
      <label>格言 / 引用</label>
      <div class="input-group">
        <textarea rows="4" bind:value={data.motto} class="styled-input"
        ></textarea>
        <button
          class="rich-trigger"
          onclick={() => openRichText("motto", "编辑格言")}>+</button
        >
      </div>
    </div>
    <div class="section">
      <label>按钮文字</label>
      <div class="input-group">
        <input type="text" bind:value={data.buttonText} class="styled-input" />
        <button
          class="rich-trigger"
          onclick={() => openRichText("buttonText", "编辑按钮文字")}>+</button
        >
      </div>
    </div>
  {:else if node.type === "spirit"}
    <div class="section">
      <button class="editor-trigger" onclick={() => (showSpiritEditor = true)}
        >管理图标阵列</button
      >
    </div>
  {:else if node.type === "desc"}
    <div class="section">
      <label>正文内容</label>
      <div class="input-group">
        <textarea rows="4" bind:value={data.body} class="styled-input"
        ></textarea>
        <button
          class="rich-trigger"
          onclick={() => openRichText("body", "编辑正文内容")}>+</button
        >
      </div>
    </div>
  {:else if node.type === "text"}
    <div class="section">
      <label>文字内容</label>
      <div class="input-group">
        <textarea rows="6" bind:value={data.body} class="styled-input"
        ></textarea>
        <button
          class="rich-trigger"
          onclick={() => openRichText("body", "高级编辑")}>+</button
        >
      </div>
    </div>
  {:else if node.type === "image"}
    <div class="section">
      <button class="editor-trigger" onclick={() => openPicManager("", "url")}
        >选择图片</button
      >
    </div>
    <div class="section">
      <label>填充方式</label>
      <select bind:value={data.fit} class="styled-input">
        <option value="contain">比例缩放 (Contain)</option>
        <option value="cover">裁剪填充 (Cover)</option>
        <option value="fill">拉伸填满 (Fill)</option>
      </select>
    </div>
  {:else if node.type === "pie"}
    <div class="section">
      <button class="editor-trigger" onclick={() => (showChartEditor = true)}
        >配置独立饼图</button
      >
    </div>
  {:else if node.type === "focus"}
    <div class="section">
      <label>国策名称</label>
      <div class="input-group">
        <input type="text" bind:value={data.label} class="styled-input" />
        <button
          class="rich-trigger"
          onclick={() => openRichText("label", "编辑国策名称")}>+</button
        >
      </div>
    </div>
    <div class="section">
      <button
        class="editor-trigger secondary"
        onclick={() => openPicManager("focus", "icon")}>更换图标</button
      >
    </div>
    <div class="section">
      <label>状态</label>
      <select bind:value={data.status} class="styled-input">
        <option value="completed">已完成</option>
        <option value="inProgress">进行中</option>
        <option value="unavailable">不可用</option>
      </select>
    </div>
    {#if focusEdges.length > 0}
      {@const nodeEdges = focusEdges.filter(
        (e: any) => e.source === node.id || e.target === node.id,
      )}
      {@const topEdges = nodeEdges.filter(
        (e: any) =>
          (e.source === node.id && e.sourceHandle === "top") ||
          (e.target === node.id && e.targetHandle === "top"),
      )}
      {@const bottomEdges = nodeEdges.filter(
        (e: any) =>
          (e.source === node.id && e.sourceHandle === "bottom") ||
          (e.target === node.id && e.targetHandle === "bottom"),
      )}
      {@const leftEdges = nodeEdges.filter(
        (e: any) =>
          (e.source === node.id && e.sourceHandle === "left") ||
          (e.target === node.id && e.targetHandle === "left"),
      )}
      {@const rightEdges = nodeEdges.filter(
        (e: any) =>
          (e.source === node.id && e.sourceHandle === "right") ||
          (e.target === node.id && e.targetHandle === "right"),
      )}
      <div class="edge-section">
        <span class="edge-title">连线</span>
        {#each [{ handle: "上", edges: topEdges }, { handle: "下", edges: bottomEdges }, { handle: "左", edges: leftEdges }, { handle: "右", edges: rightEdges }] as group}
          {#if group.edges.length > 0}
            <div class="handle-group">
              <span class="handle-label">{group.handle}</span>
              {#each group.edges as edge}
                {@const edgeData = edge.data ?? {
                  dashed: false,
                  exclusive: false,
                  completed: false,
                }}
                <div class="edge-item">
                  <select
                    value={edgeData.dashed ? "true" : "false"}
                    onchange={(e) => {
                      if (!edge.data)
                        edge.data = {
                          dashed: false,
                          exclusive: false,
                          completed: false,
                        };
                      edge.data.dashed = e.currentTarget.value === "true";
                    }}
                    class="edge-style-select"
                  >
                    <option value="false">实线</option>
                    <option value="true">虚线</option>
                  </select>
                  <label class="checkbox-label compact">
                    <input
                      type="checkbox"
                      checked={edgeData.exclusive}
                      onchange={(e) => {
                        if (!edge.data)
                          edge.data = {
                            dashed: false,
                            exclusive: false,
                            completed: false,
                          };
                        edge.data.exclusive = e.currentTarget.checked;
                      }}
                    />
                    互斥
                  </label>
                  <label class="checkbox-label compact">
                    <input
                      type="checkbox"
                      checked={edgeData.completed}
                      onchange={(e) => {
                        if (!edge.data)
                          edge.data = {
                            dashed: false,
                            exclusive: false,
                            completed: false,
                          };
                        edge.data.completed = e.currentTarget.checked;
                      }}
                    />
                    已完成
                  </label>
                  <button
                    class="delete-node-btn"
                    onclick={() => onDeleteEdge?.(edge.id)}
                    title="删除"><Trash2 size={12} /></button
                  >
                </div>
              {/each}
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  {/if}

  <!-- Common Modals -->
  <Modal title="饼图数据编辑器" bind:isOpen={showChartEditor} width="500px">
    <ChartEditor bind:chartData={data.chartData} />
  </Modal>

  {#if showRichTextEditor}
    <Modal title={richTextTitle} bind:isOpen={showRichTextEditor} width="800px">
      <RichTextEditor bind:content={data[richTextTargetKey]} />
    </Modal>
  {/if}

  <Modal
    title="图片管理器 - {currentPicCategory || '全选'}"
    bind:isOpen={showPicManager}
  >
    <PicManager
      category={currentPicCategory}
      onSelect={handlePicSelect}
      onClose={() => (showPicManager = false)}
    />
  </Modal>

  <Modal title="图标管理器" bind:isOpen={showSpiritEditor} width="80vw">
    <ImageListEditor bind:images={data.spirits} category="spirit" />
  </Modal>
</div>

<style>
  .props-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #333;
    padding-bottom: 10px;
  }

  .alias-group {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    color: #666;
  }
  .alias-input {
    background: transparent;
    border: none;
    color: white;
    font-size: 13px;
    font-family: "Cubic";
    width: 100%;
    outline: none;
  }

  .delete-node-btn {
    background: transparent;
    border: none;
    color: #ff8888;
    cursor: pointer;
    opacity: 0.6;
  }
  .delete-node-btn:hover {
    opacity: 1;
  }

  .section {
    display: flex;
    flex-direction: column;
  }
  .section-row {
    display: flex;
    gap: 8px;
  }
  .sub-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .icon-scale-row {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: flex-end;
    flex-wrap: nowrap;
  }
  .sub-col.narrow {
    flex: 0 0 50px;
  }
  .sub-col.narrow input {
    text-align: center;
    padding: 6px 2px;
  }

  .input-group {
    display: flex;
    gap: 5px;
  }
  .styled-input,
  .input-group input,
  .input-group textarea,
  select {
    flex: 1;
    background: #111;
    border: 1px solid #333;
    color: white;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }
  .styled-input:focus,
  .input-group input:focus,
  .input-group textarea:focus,
  select:focus {
    border-color: var(--theme-color);
  }

  .rich-trigger {
    background: #333;
    border: 1px solid #444;
    color: var(--theme-color);
    width: 30px;
    cursor: pointer;
    border-radius: 4px;
    font-weight: bold;
    flex-shrink: 0;
  }

  label {
    font-size: 11px;
    color: #888;
    font-family: sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .editor-trigger {
    background-color: var(--theme-color);
    color: white;
    border: none;
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
    font-family: "Cubic", sans-serif;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .editor-trigger.secondary {
    background: #252525;
    border: 1px solid #333;
    font-size: 11px;
    padding: 6px;
    margin-top: 2px;
  }
  .editor-trigger:hover {
    filter: brightness(1.2);
  }

  .edge-section {
    border-top: 1px solid #333;
    padding-top: 12px;
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
    min-width: 0;
  }
  .edge-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .edge-title {
    font-size: 12px;
    color: var(--theme-color);
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    color: #ccc;
  }
  .checkbox-label input[type="checkbox"] {
    accent-color: var(--theme-color);
    width: 16px;
    height: 16px;
  }
  .handle-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .handle-label {
    font-size: 11px;
    color: #aaa;
    font-weight: bold;
  }
  .edge-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 6px;
    background: #1a1a1a;
    border-radius: 6px;
    overflow: hidden;
    min-width: 0;
  }
  .edge-style-select {
    flex: 1 1 0;
    min-width: 0;
    background: #111;
    border: 1px solid #333;
    color: white;
    padding: 3px 6px;
    border-radius: 4px;
    font-size: 11px;
    outline: none;
  }
  .checkbox-label.compact {
    font-size: 11px;
    gap: 4px;
    white-space: nowrap;
  }
  .checkbox-label.compact input[type="checkbox"] {
    width: 13px;
    height: 13px;
  }
</style>
