<script lang="ts">
  import Moveable from "svelte-moveable";

  export let nodes: Array<{ id: string; x: number; y: number; w: number; h: number; z: number }>;
  export let selectedIds: string[];

  // nodeRefs map
  let nodeRefs: Record<string, HTMLElement> = {};
  $: moveableTargets = selectedIds.map((id) => nodeRefs[id]).filter((el): el is HTMLElement => !!el);

  function updateNode(id: string, patch: Partial<(typeof nodes)[0]>) {
    nodes = nodes.map((n) => (n.id === id ? { ...n, ...patch } : n));
  }

  // action to register element refs
  function registerNode(node: HTMLElement, id: string) {
    if (node) nodeRefs[id] = node;
    return {
      update(newId: string) {
        if (node) nodeRefs[newId] = node;
      },
      destroy() {
        if (node && id) delete nodeRefs[id];
      },
    };
  }
</script>

<div class="canvas">
  {#each nodes as node (node.id)}
    <div
      use:registerNode={node.id}
      class="target {selectedIds.includes(node.id) ? 'selected' : ''}"
      data-id={node.id}
      style="
        transform: translate({node.x}px, {node.y}px);
        width: {node.w}px;
        height: {node.h}px;
        z-index: {node.z};
      "
    >
      {node.id}
    </div>
  {/each}
</div>

<Moveable
  target={moveableTargets}
  draggable
  resizable
  scalable
  snappable
  snapThreshold={5}
  elementGuidelines={[".target"]}
  on:drag={({ detail }) => {
    const { target, beforeTranslate } = detail;
    const id = target.dataset.id!;
    const [x, y] = beforeTranslate;
    updateNode(id, { x, y });
  }}
  on:resize={({ detail }) => {
    const { target, width, height, drag } = detail;
    const id = target.dataset.id!;
    const [x, y] = drag.beforeTranslate;
    updateNode(id, { x, y, w: width, h: height });
  }}
  on:scale={({ detail }) => {
    const { target, scale, drag } = detail;
    const id = target.dataset.id!;
    const [x, y] = drag.beforeTranslate;
    const node = nodes.find((n) => n.id === id)!;
    updateNode(id, { x, y, w: node.w * scale[0], h: node.h * scale[1] });
  }}
/>

<style>
  .canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .target {
    position: absolute;
    background: white;
    border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    user-select: none;
  }
  .target.selected {
    border: 2px solid #00f;
  }
</style>
