<script lang="ts">
  import { db } from "../utils/db";
  import { Trash2, PaintBucket, Palette, Sliders } from "lucide-svelte";

  let { bgColor = $bindable(), themeColor = $bindable(), exportScale = $bindable() } = $props();

  async function clearAutosave() {
    if (confirm("清空自动保存数据？这会重置下次打开时的画布。")) {
      await db.clearStore("autosave");
      alert("自动保存已清空");
    }
  }

  async function clearPresets() {
    if (confirm("清空所有本地项目存档？")) {
      await db.clearStore("projects");
      alert("存档已清空");
    }
  }

  async function clearImages() {
    if (confirm("清空所有自定义上传图片？")) {
      await db.clearStore("customPics");
      alert("图片库已清空");
    }
  }
</script>

<div class="settings-container">
  <!-- Appearance -->
  <section class="config-group">
    <div class="group-title"><Palette size={16} /> 外观与主题</div>
    <div class="control-row">
      <div class="label">
        <span>画布背景色</span>
        <p class="hint">调节工作区的底色</p>
      </div>
      <input type="color" bind:value={bgColor} />
    </div>
    <div class="control-row">
      <div class="label">
        <span>控件强调色</span>
        <p class="hint">按钮和边框的主色调</p>
      </div>
      <input type="color" bind:value={themeColor} />
    </div>
  </section>

  <!-- Export -->
  <section class="config-group">
    <div class="group-title"><Sliders size={16} /> 导出设置</div>
    <div class="control-row">
      <div class="label">
        <span>导出放大倍数</span>
        <p class="hint">数值越高图片越清晰 (推荐 2-4)</p>
      </div>
      <div class="num-input">
        <input type="number" min="1" max="5" bind:value={exportScale} />
      </div>
    </div>
  </section>

  <!-- Database Maintenance -->
  <section class="config-group">
    <div class="group-title"><Trash2 size={16} /> 数据库维护</div>
    <div class="maintenance-grid">
      <button onclick={clearAutosave}>
        <span class="btn-text">清空自动保存</span>
      </button>
      <button onclick={clearPresets}>
        <span class="btn-text danger">清空所有存档</span>
      </button>
      <button onclick={clearImages}>
        <span class="btn-text danger">清空图片库</span>
      </button>
    </div>
    <p class="warning-hint">注意：这些操作不可撤销，请谨慎操作。</p>
  </section>
</div>

<style>
  .settings-container {
    display: flex;
    flex-direction: column;
    gap: 25px;
    color: #eee;
  }
  .config-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .group-title {
    font-family: "Cubic";
    font-size: 14px;
    color: var(--theme-color);
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0.8;
  }

  .control-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #252525;
    padding: 12px 15px;
    border-radius: 8px;
    border: 1px solid #333;
  }
  .label span {
    display: block;
    font-size: 14px;
    color: #fff;
  }
  .label .hint {
    font-size: 11px;
    color: #666;
    margin: 4px 0 0 0;
  }

  input[type="color"] {
    width: 50px;
    height: 30px;
    border: none;
    background: none;
    cursor: pointer;
  }

  .num-input {
    color: white;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #111;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid #444;
  }
  .num-input input {
    background: transparent;
    border: none;
    color: white;
    width: 40px;
    text-align: center;
    font-weight: bold;
  }
  .num-input span {
    color: #666;
    font-size: 12px;
  }

  .maintenance-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 5px;
  }
  .maintenance-grid button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: #2a2a2a;
    border: 1px solid #333;
    color: #ccc;
    padding: 15px 5px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s;
  }
  .maintenance-grid button:hover {
    background: #333;
    border-color: #555;
    color: #fff;
  }
  .maintenance-grid button.danger:hover {
    background: #442222;
    border-color: #662222;
    color: #ff8888;
  }
  .btn-icon {
    font-size: 18px;
  }
  .btn-text {
    font-size: 11px;
  }

  .warning-hint {
    font-size: 11px;
    color: #ff8888;
    text-align: center;
    margin-top: 5px;
  }

  .danger {
    color: #ff8888;
  }
</style>
