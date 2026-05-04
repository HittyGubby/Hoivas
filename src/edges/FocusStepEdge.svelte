<script lang="ts">
  import { BaseEdge, EdgeLabel, type EdgeProps } from "@xyflow/svelte";

  let { id, sourceX, sourceY, targetX, targetY, data }: EdgeProps = $props();

  const centerY = $derived((targetY - sourceY) / 2 + sourceY);

  const edgePath = $derived(`M ${sourceX} ${sourceY} L ${sourceX} ${centerY} L ${targetX} ${centerY} L ${targetX} ${targetY}`);

  let isDashed = $derived(data?.dashed ?? false);
  let isExclusive = $derived(data?.exclusive ?? false);
  let isCompleted = $derived(data?.completed ?? false);

  // Midpoint of the full path for label placement
  let labelX = $derived((sourceX + targetX) / 2);
  let labelY = $derived(centerY);
</script>

<BaseEdge {id} path={edgePath} style={(isDashed ? "stroke-dasharray: 2 2;" : "") + (isCompleted ? "stroke: #397d3f;" : "stroke: #aaa;") + "stroke-width: 2;"} />

{#if isExclusive}
  <EdgeLabel x={labelX} y={labelY} style="background:transparent">
    <img class="exclusive-icon" src="/template/focus_link_exclusive.png" alt="exclusive" draggable={false} />
  </EdgeLabel>
{/if}

<style>
  .exclusive-icon {
    object-fit: contain;
    pointer-events: none;
  }
</style>
