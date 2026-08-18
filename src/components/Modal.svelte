<script lang="ts">
  import { fade, scale } from "svelte/transition";

  let { title, isOpen = $bindable(), width = "70vw", height = "85vh", children } = $props();

  let modalElement = $state<HTMLElement>();
  let isDragging = $state(false);
  let pos = $state({ x: 0, y: 0 });
  let lastPointer = $state({ x: 0, y: 0 });

  function close() {
    isOpen = false;
  }

  // Unified mouse + touch drag via Pointer Events.
  function handlePointerDown(e: PointerEvent) {
    if ((e.target as HTMLElement).closest(".modal-header")) {
      isDragging = true;
      lastPointer = { x: e.clientX, y: e.clientY };
      e.preventDefault();
      // Keep tracking / move events flowing even when the finger leaves the element.
      if (e.pointerType !== "mouse") {
        modalElement?.setPointerCapture(e.pointerId);
      }
    }
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) return;
    // movementX/movementY is unreliable on touch, so compute the delta manually.
    pos.x += e.clientX - lastPointer.x;
    pos.y += e.clientY - lastPointer.y;
    lastPointer = { x: e.clientX, y: e.clientY };
  }

  function handlePointerUp(e: PointerEvent) {
    if (isDragging && modalElement?.hasPointerCapture(e.pointerId)) {
      modalElement.releasePointerCapture(e.pointerId);
    }
    isDragging = false;
  }
</script>

<svelte:window on:pointermove={handlePointerMove} on:pointerup={handlePointerUp} />

{#if isOpen}
  <div class="modal-backdrop" transition:fade={{ duration: 150 }}>
    <div
      class="modal-content"
      bind:this={modalElement}
      style:width
      style:height
      style:transform="translate({pos.x}px, {pos.y}px)"
      transition:scale={{ duration: 200, start: 0.95 }}
    >
      <div class="modal-header" role="group" on:pointerdown={handlePointerDown}>
        <h2>{title}</h2>
        <button class="close-btn" on:click={close}>×</button>
      </div>
      <div class="modal-body">
        {@render children()}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4); /* Lower opacity so you see the canvas behind */
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none; /* Let clicks pass through to background if not on modal */
  }

  .modal-content {
    background: #1e1e1e;
    border: 1px solid #444;
    border-radius: 8px;
    height: 85vh;
    max-height: 95vh; /* fallback for browsers without dvh */
    max-height: 95dvh; /* accounts for mobile / iPad URL bars */
    max-width: calc(100vw - 24px);
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
    pointer-events: all; /* Modal itself handles clicks */
  }

  .modal-header {
    padding: 12px 20px;
    border-bottom: 1px solid #333;
    display: flex;
    justify-content: space-between;
    color: var(--theme-color);
    align-items: center;
    cursor: move;
    user-select: none;
    touch-action: none; /* Let the header be dragged with a finger too */
    background: #252525;
    border-radius: 8px 8px 0 0;
    flex-shrink: 0;
  }

  .modal-header h2 {
    margin: 0;
    font-family: "Cubic", sans-serif;
    font-size: 16px;
  }

  .close-btn {
    background: transparent;
    border: none;
    color: #888;
    font-size: 24px;
    cursor: pointer;
    line-height: 1;
  }

  .modal-body {
    padding: 20px;
    overflow: hidden;
    flex: 1;
    min-height: 0; /* Let overlong content shrink so inner lists can scroll instead of clipping */
    display: flex;
    flex-direction: column;
  }
</style>