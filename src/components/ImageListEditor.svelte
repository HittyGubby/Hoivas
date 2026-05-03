<script lang="ts">
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import PicManager from "./PicManager.svelte";
  import { Trash2, ChevronUp, ChevronDown, Plus, LayoutGrid } from "lucide-svelte";

  let { images = $bindable(), category = "spirit" } = $props();

  function removeImage(index: number) {
    images.splice(index, 1);
  }

  function move(index: number, direction: number) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    const item = images[index];
    images.splice(index, 1);
    images.splice(newIndex, 0, item);
  }

  function handleSelect(url: string) {
    images.push({ url, scale: 1.0 });
  }
</script>

<div class="split-manager">
  <!-- Left Side: Current List -->
  <div class="list-section">
    <div class="section-title">
      <LayoutGrid size={16} />
      <span>当前已选图标 ({images.length})</span>
    </div>

    <div class="scroll-area">
      {#each images as img, index (img.url + index)}
        <div class="image-item" animate:flip={{ duration: 200 }}>
          <div class="item-controls">
            <button class="m-btn" onclick={() => move(index, -1)} disabled={index === 0}><ChevronUp size={12} /></button>
            <button class="m-btn" onclick={() => move(index, 1)} disabled={index === images.length - 1}><ChevronDown size={12} /></button>
          </div>

          <div class="item-preview">
            <img src={img.url} alt="" />
          </div>

          <div class="item-settings">
            <label>缩放</label>
            <input type="number" step="0.1" bind:value={img.scale} />
          </div>

          <button class="item-del" onclick={() => removeImage(index)} title="移除"><Trash2 size={14} /></button>
        </div>
      {/each}

      {#if images.length === 0}
        <div class="empty-list">
          <p>列表为空</p>
          <p class="sub">请从右侧点击添加图标</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Right Side: Library -->
  <div class="library-section">
    <div class="library-content">
      <PicManager {category} onSelect={handleSelect} onClose={() => {}} />
    </div>
  </div>
</div>

<style>
  .split-manager {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 20px;
    height: 100%;
    min-height: 0;
    color: #eee;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: "Cubic";
    font-size: 14px;

    padding-bottom: 15px;
    border-bottom: 1px solid #333;
    margin-bottom: 15px;
  }

  /* List Section */
  .list-section {
    display: flex;
    flex-direction: column;
    background: #1a1a1a;
    border-radius: 12px;
    padding: 15px;
    border: 1px solid #333;
  }

  .scroll-area {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 5px;
  }

  .image-item {
    background: #252525;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: 0.2s;
  }

  .image-item:hover {
    border-color: #444;
    background: #2a2a2a;
  }

  .item-controls {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .m-btn {
    background: #333;
    border: none;
    color: #888;
    padding: 2px 4px;
    cursor: pointer;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .m-btn:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
  .m-btn:hover:not(:disabled) {
    color: #fff;
    background: #444;
  }

  .item-preview {
    width: 44px;
    height: 44px;
    background: #111;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px solid #333;
  }

  .item-preview img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .item-settings {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .item-settings label {
    font-size: 10px;
    color: #666;
  }
  .item-settings input {
    background: #111;
    color: white;
    border: 1px solid #333;

    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
    width: 60px;
  }

  .item-del {
    background: transparent;
    border: none;
    color: #444;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: 0.2s;
  }

  .item-del:hover {
    color: #ff8888;
    background: #442222;
  }

  .empty-list {
    text-align: center;
    color: #555;
    padding: 50px 0;
    border: 1px dashed #333;
    border-radius: 10px;
    font-size: 13px;
  }

  .empty-list .sub {
    font-size: 11px;
    margin-top: 5px;
  }

  /* Library Section */
  .library-section {
    background: #1a1a1a;
    border-radius: 12px;
    padding: 15px;
    border: 1px solid #333;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .library-content {
    flex: 1;
    overflow: hidden;
  }
</style>
