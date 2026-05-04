<script lang="ts">
  import { Handle, Position } from "@xyflow/svelte";

  let { data, selected } = $props();

  const BG_PATHS: Record<string, string> = {
    completed: "/template/focus_completed_bg.png",
    inProgress: "/template/focus_can_start_bg.png",
    unavailable: "/template/focus_unavailable_bg.png",
  };

  let bgPath = $derived(BG_PATHS[data.status] || BG_PATHS.unavailable);
</script>

<div class="focus-node-container" class:selected>
  <div class="focus-frame">
    <Handle type="target" position={Position.Top} id="top" />
    <Handle type="source" position={Position.Top} id="top" />
    
    <Handle type="target" position={Position.Bottom} id="bottom" />
    <Handle type="source" position={Position.Bottom} id="bottom" />
    
    <Handle type="target" position={Position.Left} id="left" />
    <Handle type="source" position={Position.Left} id="left" />
    
    <Handle type="target" position={Position.Right} id="right" />
    <Handle type="source" position={Position.Right} id="right" />
    
    <img class="bg" src={bgPath} alt="" />
    {#if data.icon}
      <img class="icon" src={data.icon} alt="" />
    {/if}
    {#if data.label}
      <div class="label-wrapper">
        <span class="label">{data.label}</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .focus-node-container {
    width: 120px;
    height: 32px;
    position: relative;
    overflow: visible;
    user-select: none;
  }

  .focus-frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .bg {
    position: absolute;
    bottom: 0px;
    left: 4px;
    width: 112px;
    object-fit: fill;
    z-index: 7;
    cursor: grab;
  }

  .icon {
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 8;
    pointer-events: none;
  }

  .label-wrapper {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 110px;
    text-align: center;
    z-index: 10;
    pointer-events: none;
  }

  .label {
    font-family: "Cubic", "FZRui", sans-serif;
    font-size: 11px;
    color: #ffffff;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 1);
  }

  .focus-node-container :global(.svelte-flow__handle) {
    width: 8px;
    height: 8px;
    background: rgba(200, 200, 200, 0.8);
    border: 1px solid #333;
    border-radius: 50%;
    z-index: 10;
  }

  .focus-node-container :global(.svelte-flow__handle:hover) {
    background: var(--theme-color);
    border-color: #fff;
  }

  .selected .bg {
    outline: 2px solid var(--theme-color);
    outline-offset: 2px;
  }
</style>
