<script lang="ts">
  import { NodeResizer, useSvelteFlow } from "@xyflow/svelte";

  let { id, data, selected, width, height } = $props();

  const BASE_WIDTH = 512;
  const TOP_HEIGHT = 35;
  const BOTTOM_HEIGHT = 20;
  let scale = $derived(width / BASE_WIDTH);

  // 1. Content-driven height
  let contentHeight = $state(0);

  // 2. Base width is constant, scale is driven by resizer width
  const { updateNode } = useSvelteFlow();

  // Total height calculation
  let totalRefHeight = $derived(TOP_HEIGHT + contentHeight + BOTTOM_HEIGHT);

  // Update actual node height for selection box
  $effect(() => {
    if (totalRefHeight > 0) {
      const realHeight = totalRefHeight * scale + 5;
      if (Math.abs(realHeight - height) > 5) {
        updateNode(id, { height: realHeight });
      }
    }
  });
</script>

{#if selected}
  <NodeResizer minWidth={100} color="#ff0071" keepAspectRatio={false} />
{/if}

<div class="spirit-scaler" style:transform="scale({scale})" style:width="{BASE_WIDTH}px">
  <div class="spirit-window-container">
    <img src="/template/diplo_nat_spirits_bg_top.png" style="position: absolute; top: 0; left: 0; width: 100%;" alt="" />

    <div
      style="position: absolute; top: {TOP_HEIGHT}px; left: 0; width: 100%; height: {contentHeight}px; background-image: url(/template/diplo_nat_spirits_bg_tileable.png); background-repeat: no-repeat; background-size: 100% 100%;"
    ></div>

    <img src="/template/diplo_nat_spirits_bg_bottom.png" style="position: absolute; top: {TOP_HEIGHT + contentHeight}px; left: 0; width: 100%;" alt="" />

    <!-- Icons Container (Determines height) -->
    <div
      class="spirit-icons-container"
      bind:clientHeight={contentHeight}
      style="position: absolute; top: {TOP_HEIGHT}px; left: 15px; width: {BASE_WIDTH - 30}px; display: flex; flex-wrap: wrap; gap: 1px; z-index: 5; padding-bottom: 0px; min-height: 20px;"
    >
      {#each data.spirits || [] as spirit}
        <img src={spirit.url} alt="" style="transform: scale({spirit.scale || 1}); display: block; object-fit: contain; height: 68px;" />
      {/each}
    </div>

    <!-- Title -->
    <div style="position: absolute; left: 15px; top: 12px; z-index: 5; color: #cccccc; text-shadow: 1px 1px 2px black; font-family: 'Cubic', sans-serif; font-size: 16px;">国家精神</div>
  </div>
</div>

<style>
  .spirit-scaler {
    transform-origin: top left;
    pointer-events: none;
  }

  .spirit-window-container {
    position: relative;
    pointer-events: all;
    user-select: none;
    width: 100%;
  }
</style>
