<script lang="ts">
  import { onMount } from "svelte";
  export let nodes: Array<{ id: string; x: number; y: number; w: number; h: number; z: number }>;
  export let selectedIds: string[] = [];

  let container: HTMLElement;

  let box = { x: 0, y: 0, w: 0, h: 0, active: false };
  let start = { x: 0, y: 0 };

  function isInside(node: any, x: number, y: number, w: number, h: number) {
    return !(node.x + node.w < x || node.x > x + w || node.y + node.h < y || node.y > y + h);
  }

  function pointerDown(e: PointerEvent) {
    box.active = true;
    start = { x: e.clientX, y: e.clientY };
    box = { x: e.clientX, y: e.clientY, w: 0, h: 0, active: true };
  }

  function pointerMove(e: PointerEvent) {
    if (!box.active) return;
    box.w = e.clientX - start.x;
    box.h = e.clientY - start.y;

    // compute selection
    const x = Math.min(start.x, start.x + box.w);
    const y = Math.min(start.y, start.y + box.h);
    const w = Math.abs(box.w);
    const h = Math.abs(box.h);

    selectedIds = nodes.filter((n) => isInside(n, x, y, w, h)).map((n) => n.id);
  }

  function pointerUp() {
    box.active = false;
  }

  onMount(() => {
    container.addEventListener("pointerdown", pointerDown);
    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);
  });
</script>

<div bind:this={container} class="canvas-layer">
  {#if box.active}
    <div
      class="selection-box"
      style="
        left: {Math.min(start.x, start.x + box.w)}px;
        top: {Math.min(start.y, start.y + box.h)}px;
        width: {Math.abs(box.w)}px;
        height: {Math.abs(box.h)}px;
      "
    ></div>
  {/if}
</div>

<style>
  .canvas-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: all;
  }
  .selection-box {
    position: absolute;
    border: 1px dashed #00f;
    background: rgba(0, 0, 255, 0.2);
    pointer-events: none;
  }
</style>
