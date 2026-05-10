<script lang="ts">
  import { NodeResizer, useSvelteFlow } from "@xyflow/svelte";

  let { id, data, selected, width, height } = $props();
  const { updateNode } = useSvelteFlow();

  const TILE_HEIGHT = 80;
  const BASE_WIDTH = 580;
  const BUTTON_HEIGHT = 48;
  const BUTTON_GAP = 8;
  const BUTTON_BOTTOM = 302;
  let scale = $derived((width || BASE_WIDTH) / BASE_WIDTH);

  // Normalize buttonText to array (supports both string and array)
  let buttonTexts = $derived(
    Array.isArray(data.buttonText)
      ? data.buttonText
      : data.buttonText != null
        ? [data.buttonText]
        : [],
  );

  // Content-driven height
  let contentHeight = $state(0);

  // Extra pixel height from buttons beyond the first
  let extraButtonHeight = $derived(
    buttonTexts.length > 1
      ? (buttonTexts.length - 1) * (BUTTON_HEIGHT + BUTTON_GAP)
      : 0,
  );

  // Tiles derived from total content height (body + extra buttons)
  let tiles = $derived(
    Math.max(
      1,
      Math.ceil((contentHeight + extraButtonHeight - 80) / TILE_HEIGHT),
    ),
  );
  let tileArray = $derived(Array.from({ length: tiles }));

  // Total unscaled height
  let totalRefHeight = $derived(360 + (tiles + 1) * TILE_HEIGHT + 100);

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
  <NodeResizer
    minWidth={200}
    color="var(--theme-color)"
    keepAspectRatio={true}
  />
{/if}

<div
  class="event-scaler"
  style:transform="scale({scale})"
  style:width="{BASE_WIDTH}px"
>
  <div class="event-window-container" style="height: {totalRefHeight}px;">
    <!-- Tiled Background -->
    <img
      src="/tfr/template/news/event_report_top_win.png"
      style="position: absolute; top: 2px; left: 0; width: 100%; z-index: 1;"
      alt=""
    />

    {#each tileArray as _, i}
      <img
        src="/tfr/template/news/event_report_tileable_midsection.png"
        style="position: absolute; top: {120 +
          i *
            TILE_HEIGHT}px; left: 0; width: 100%; height: {TILE_HEIGHT}px; z-index: 1;"
        alt=""
      />
    {/each}

    <img
      src="/tfr/template/news/event_report_bottom_win.png"
      style="position: absolute; top: {120 +
        tiles * TILE_HEIGHT}px; left: 0; width: 100%; z-index: 1;"
      alt=""
    />

    <!-- Title -->
    <div
      style="position: absolute; left: 40px; top: 80px; width: 500px; display: flex; justify-content: center; z-index: 5;"
    >
      <p
        style="margin: 0; text-align: center; font-family: 'OldTypeNr', 'FZRui', sans-serif; font-size: 23px; color: #000000; word-break: break-word;"
      >
        {@html data.title}
      </p>
    </div>

    <!-- Body (Determines Height) -->
    <div
      class="event-body-box"
      bind:clientHeight={contentHeight}
      style="position: absolute; left: 43px; top: 120px; width: 500px; z-index: 2; padding-bottom: 30px; word-break: break-word; overflow-wrap: break-word;"
    >
      <span
        style="font-family: 'electrolize', 'FZRui', sans-serif; font-size: 18px; line-height: 1.4; color: #000000;"
      >
        {@html data.body}
      </span>
    </div>

    <!-- Footer Elements -->
    <div
      style="position: absolute; top: {240 +
        tiles * TILE_HEIGHT}px; left: 60px; z-index: 3;"
    >
      <img src={data.eventImg} alt="" style="max-width: 460px;" />
    </div>

    <!-- Button Container (bottom-anchored, buttons stack vertically) -->
    <div
      class="event-button-container"
      style="position: absolute; bottom: {BUTTON_BOTTOM}px; left: 115px; width: 352px; z-index: 4;"
    >
      {#each buttonTexts as btnText}
        <button
          style="width: 100%; height: {BUTTON_HEIGHT}px; border: none; background: url('/tfr/template/news/event_option_entry.png') no-repeat; background-size: 100% 100%; color: #FFFFFF; font-family: 'electrolize', 'FZRui', sans-serif; font-size: 18px; cursor: pointer; margin-bottom: {BUTTON_GAP}px;"
        >
          {@html btnText}
        </button>
      {/each}
    </div>
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

  .event-button-container {
    display: flex;
    flex-direction: column;
  }
</style>
