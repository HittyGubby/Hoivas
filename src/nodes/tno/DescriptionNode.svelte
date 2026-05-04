<script lang="ts">
  import { NodeResizer, useSvelteFlow } from "@xyflow/svelte";
  import { onMount } from "svelte";

  let { id, data, selected, width, height } = $props();
  const { updateNodeData, updateNode } = useSvelteFlow();

  const BASE_WIDTH = 320;
  let scale = $derived((width || BASE_WIDTH) / BASE_WIDTH);

  // Content-driven height logic
  let contentHeight = $state(0);

  // Update the actual node height in Svelte Flow to make selection box match
  $effect(() => {
    if (contentHeight > 0) {
      const realHeight = contentHeight * scale + 10; // Add small buffer for border
      if (Math.abs(realHeight - height) > 2) {
        updateNode(id, { height: realHeight });
      }
    }
  });
</script>

{#if selected}
  <NodeResizer minWidth={200} color="var(--theme-color)" keepAspectRatio={true} />
{/if}

<div class="desc-scaler" style:transform="scale({scale})" style:width="{BASE_WIDTH}px">
  <div class="desc-window-container" bind:clientHeight={contentHeight}>
    <div class="desc-content">
      <div class="desc-body">
        {@html data.body}
      </div>
    </div>
  </div>
</div>

<style>
  .desc-scaler {
    transform-origin: top left;
    pointer-events: none;
  }

  .desc-window-container {
    pointer-events: all;
    user-select: none;
    background-color: #000c13;
    border: 1px solid;
    border-color: #7caaaa;
    width: 100%;
    box-sizing: border-box;
  }

  .desc-content {
    padding: 7px;
    display: flex;
    flex-direction: column;
  }

  .desc-body {
    font-family: "Aldrich", "FZRui", sans-serif;
    font-size: 12px;
    line-height: 16px;
    color: #8aadbe;
    white-space: pre-line;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  /* Support for colored text inside body via <span> */
  :global(.desc-body span) {
    display: inline;
  }
</style>
