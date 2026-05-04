<script lang="ts">
  import { NodeResizer, useSvelteFlow } from "@xyflow/svelte";

  let { id, data, selected, width, height } = $props();
  const { updateNode } = useSvelteFlow();

  const TILE_HEIGHT = 80;
  const BASE_WIDTH = 580;
  let scale = $derived((width || BASE_WIDTH) / BASE_WIDTH);

  // Content-driven height
  let contentHeight = $state(0);

  // Calculate required tiles
  let tiles = $derived(Math.max(1, Math.ceil((contentHeight - 20) / TILE_HEIGHT)));
  let tileArray = $derived(Array.from({ length: tiles }));

  // Total unscaled height
  let totalRefHeight = $derived(340 + (tiles + 1) * TILE_HEIGHT);

  // Update actual node height for selection box
  $effect(() => {
    if (totalRefHeight > 0) {
      const realHeight = totalRefHeight * scale;
      if (Math.abs(realHeight - height) > 5) {
        updateNode(id, { height: realHeight });
      }
    }
  });
</script>

{#if selected}
  <NodeResizer minWidth={200} color="var(--theme-color)" keepAspectRatio={true} />
{/if}

<div class="event-scaler" style:transform="scale({scale})" style:width="{BASE_WIDTH}px">
  <div class="event-window-container" style="height: {totalRefHeight}px;">
    <!-- Tiled Background -->
    <img src="/tno/template/news/event_report_top_win.png" style="position: absolute; top: 2px; left: 0; width: 100%; z-index: 1;" alt="" />

    {#each tileArray as _, i}
      <img
        src="/tno/template/news/event_report_tileable_midsection.png"
        style="position: absolute; top: {200 + i * TILE_HEIGHT}px; left: 0; width: 100%; height: {TILE_HEIGHT}px; z-index: 1;"
        alt=""
      />
    {/each}

    <img src="/tno/template/news/event_report_bottom_win.png" style="position: absolute; top: {200 + tiles * TILE_HEIGHT}px; left: 1px; width: 100%; z-index: 1;" alt="" />

    <!-- Title -->
    <div style="position: absolute; left: 45px; top: 120px; width: 500px; display: flex; justify-content: center; z-index: 5;">
      <p style="margin: 0; text-align: center; font-family: 'OldTypeNr', 'FZRui', sans-serif; font-size: 20px; color: #000000; word-break: break-word;">
        {@html data.title}
      </p>
    </div>

    <!-- Body (Determines Height) -->
    <div
      class="event-body-box"
      bind:clientHeight={contentHeight}
      style="position: absolute; left: 64px; top: 180px; width: 479px; z-index: 2; padding-bottom: 30px; word-break: break-word; overflow-wrap: break-word;"
    >
      <span style="font-family: 'electrolize', 'FZRui', sans-serif; font-size: 16px; line-height: 1.4; color: #000000;">
        {@html data.body}
      </span>
    </div>

    <!-- Footer Elements -->
    <div style="position: absolute; top: {160 + tiles * TILE_HEIGHT}px; left: 20px; z-index: 3;">
      <img src={data.eventImg} alt="" style="max-width: 460px;" />
    </div>

    <button
      style="position: absolute; top: {250 +
        tiles *
          TILE_HEIGHT}px; left: 215px; width: 352px; height: 55px; border: none; background: url('/tno/template/news/event_option_entry.png') no-repeat; background-size: 100% 100%; color: black; font-family: 'electrolize', 'FZRui', sans-serif; font-size: 17px; cursor: pointer; z-index: 4;"
    >
      {@html data.buttonText}
    </button>
  </div>
</div>

<style>
  .event-scaler {
    transform-origin: top left;
    pointer-events: none;
  }

  .event-window-container {
    position: relative;
    pointer-events: all;
    user-select: none;
    width: 100%;
  }
</style>
