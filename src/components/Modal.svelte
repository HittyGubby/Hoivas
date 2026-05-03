<script lang="ts">
  import { fade, scale } from "svelte/transition";

  let { title, isOpen = $bindable(), width = "70vw", height = "auto", children } = $props();

  let modalElement = $state<HTMLElement>();
  let isDragging = $state(false);
  let pos = $state({ x: 0, y: 0 });

  function close() {
    isOpen = false;
  }

  function handleMouseDown(e: MouseEvent) {
    if ((e.target as HTMLElement).closest(".modal-header")) {
      isDragging = true;
      e.preventDefault();
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    pos.x += e.movementX;
    pos.y += e.movementY;
  }

  function handleMouseUp() {
    isDragging = false;
  }
</script>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} />

{#if isOpen}
  <div class="modal-backdrop" transition:fade={{ duration: 150 }}>
    <div class="modal-content" bind:this={modalElement} style:width style:height style:transform="translate({pos.x}px, {pos.y}px)" transition:scale={{ duration: 200, start: 0.95 }}>
      <div class="modal-header" on:mousedown={handleMouseDown}>
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
    max-height: 95vh;
    height: 85vh;
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
    background: #252525;
    border-radius: 8px 8px 0 0;
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
    display: flex;
    flex-direction: column;
  }
</style>
