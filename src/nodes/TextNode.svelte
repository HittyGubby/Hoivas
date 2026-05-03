<script lang="ts">
  import { NodeResizer } from "@xyflow/svelte";

  let { data, selected, width, height } = $props();

  // Reference for content height
  let contentHeight = $state(0);

  const BASE_WIDTH = 200;
  let scale = $derived(width / BASE_WIDTH);
</script>

{#if selected}
  <NodeResizer minWidth={50} color="#ff0071" keepAspectRatio={true} />
{/if}

<div class="text-node-scaler" style:transform="scale({scale})" style:width="{BASE_WIDTH}px">
  <div class="text-container" bind:clientHeight={contentHeight}>
    {@html data.body || "双击编辑文字..."}
  </div>
</div>

<style>
  .text-node-scaler {
    transform-origin: top left;
    pointer-events: none;
  }

  .text-container {
    pointer-events: all;
    color: #eee;
    font-family: "Cubic", sans-serif;
    word-break: break-word;
    text-shadow: 1px 1px 2px black;
  }
</style>
