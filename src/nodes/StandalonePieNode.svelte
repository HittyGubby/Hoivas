<script lang="ts">
  import { NodeResizer } from "@xyflow/svelte";
  import PieChart from "../components/PieChart.svelte";

  let { data, selected, width, height } = $props();
</script>

{#if selected}
  <NodeResizer minWidth={50} color="#ff0071" keepAspectRatio={true} />
{/if}

<div class="pie-node-container" style:width="{width}px" style:height="{height}px">
  <PieChart data={data.chartData} />
</div>

<style>
  .pie-node-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
