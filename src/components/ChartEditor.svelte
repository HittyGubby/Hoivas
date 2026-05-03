<script lang="ts">
  import { flip } from "svelte/animate";

  let { chartData = $bindable() } = $props();

  // Initialize helper structure
  let localItems = $state(
    (chartData.datasets?.[0]?.data || []).map((value, i) => ({
      id: Math.random().toString(36).substr(2, 9), // Stable ID for flip animation
      label: chartData.labels[i] || "Faction",
      data: value,
      backgroundColor: chartData.datasets[0].backgroundColor[i] || "#000000",
    })),
  );

  let rotation = $state(chartData.options?.rotation || 0);

  // Sync back to chartData whenever localItems or rotation changes
  $effect(() => {
    chartData = {
      labels: localItems.map((item) => item.label),
      datasets: [
        {
          data: localItems.map((item) => item.data),
          backgroundColor: localItems.map((item) => item.backgroundColor),
          borderWidth: 0,
          spacing: 0,
        },
      ],
      options: {
        rotation: rotation,
      },
    };
  });

  function addItem() {
    localItems.push({
      id: Math.random().toString(36).substr(2, 9),
      label: "新派系",
      data: 10,
      backgroundColor: "#666666",
    });
  }

  function removeItem(index: number) {
    localItems.splice(index, 1);
  }

  function move(index: number, direction: number) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= localItems.length) return;
    const item = localItems[index];
    localItems.splice(index, 1);
    localItems.splice(newIndex, 0, item);
  }
</script>

<div class="chart-editor">
  <div class="items-list">
    <div class="item-row">
      <label style="white-space: nowrap; min-width: 130px;">旋转角度 (0-360°):</label>
      <input type="range" min="0" max="360" bind:value={rotation} style="flex: 1;" />
      <input type="number" min="0" max="360" bind:value={rotation} class="data-input" />
    </div>
    {#each localItems as item, index (item.id)}
      <div class="item-row" animate:flip={{ duration: 200 }}>
        <div class="drag-handle-placeholder">
          <button class="move-btn" onclick={() => move(index, -1)} disabled={index === 0}>▲</button>
          <button class="move-btn" onclick={() => move(index, 1)} disabled={index === localItems.length - 1}>▼</button>
        </div>
        <input type="color" bind:value={item.backgroundColor} class="color-picker" />
        <input type="text" bind:value={item.label} placeholder="派系名称" class="name-input" />
        <input type="number" bind:value={item.data} class="data-input" />
        <button class="delete-btn" onclick={() => removeItem(index)}>×</button>
      </div>
    {/each}
  </div>

  <button class="add-btn" onclick={addItem}>+ 添加派系</button>
</div>

<style>
  .chart-editor {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 10px;
    background: #111;
    color: #eee;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-size: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid #333;
    color: var(--theme-color);
    flex-wrap: nowrap;
  }
  .header label {
    white-space: nowrap;
  }
  .rotation-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rotation-num {
    width: 50px;
    background: #252525;
    border: 1px solid #333;
    color: var(--theme-color);
    padding: 2px 6px;
    border-radius: 4px;
    outline: none;
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 5px;
    scrollbar-width: none;
  }

  .item-row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #1e1e1e;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #333;
    flex-wrap: nowrap;
  }

  .drag-handle-placeholder {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex-shrink: 0;
  }

  .move-btn {
    background: #333;
    border: none;
    color: #666;
    font-size: 10px;
    padding: 2px 4px;
    cursor: pointer;
    border-radius: 2px;
  }
  .move-btn:hover:not(:disabled) {
    color: #fff;
    background: #444;
  }

  .move-btn:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  .color-picker {
    width: 24px;
    height: 24px;
    border: none;
    padding: 0;
    background: none;
    cursor: pointer;
    flex-shrink: 0;
  }

  .name-input {
    flex: 1;
    min-width: 0;
    background: #252525;
    border: 1px solid #333;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    outline: none;
  }
  .name-input:focus {
    border-color: var(--theme-color);
  }

  .data-input {
    color: white;
    width: 50px;
    background: #252525;
    border: 1px solid #333;
    padding: 4px 6px;
    border-radius: 4px;
    outline: none;
    flex-shrink: 0;
  }
  .data-input:focus {
    border-color: var(--theme-color);
  }

  .delete-btn {
    background: transparent;
    color: #555;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 4px 8px;
    font-size: 18px;
    line-height: 1;
    flex-shrink: 0;
  }

  .delete-btn:hover {
    color: #ff8888;
    background: #442222;
  }

  .add-btn {
    color: white;
    background-color: var(--theme-color);
    border: none;
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
    font-family: "Cubic", sans-serif;
    font-size: 14px;
  }

  .add-btn:hover {
    filter: brightness(1.2);
  }
</style>
