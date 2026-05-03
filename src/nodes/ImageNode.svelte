<script lang="ts">
  import { NodeResizer } from "@xyflow/svelte";

  let { data, selected, width, height } = $props();
</script>

{#if selected}
  <NodeResizer minWidth={50} color="#ff0071" keepAspectRatio={true} />
{/if}

<div class="image-node-container" style:width="{width}px" style:height="{height}px">
  {#if data.url}
    <img src={data.url} alt="" style:width="100%" style:height="100%" style:object-fit={data.fit || "contain"} />
  {:else}
    <div class="placeholder">请在侧边栏选择图片</div>
  {/if}
</div>

<style>
  .image-node-container {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px dashed #666;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #888;
    font-size: 12px;
    text-align: center;
    padding: 10px;
  }
</style>
