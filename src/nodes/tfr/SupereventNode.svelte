<script lang="ts">
  import { NodeResizer } from "@xyflow/svelte";

  let { data, selected, width, height } = $props();

  const BASE_WIDTH = 1000;
  let scale = $derived(width / BASE_WIDTH);
</script>

{#if selected}
  <NodeResizer minWidth={200} color="var(--theme-color)" keepAspectRatio={true} />
{/if}

<div class="super-scaler" style:transform="scale({scale})" style:width="{BASE_WIDTH}px">
  <div class="super-window-container">
    <img src="/tfr/template/super_frame.png" class="frame-img" alt="" />

    <!-- Content Image (Z-index 0) -->
    <div class="super-pic-box">
      <img src={data.superImg} class="super-pic" alt="" />
    </div>

    <!-- Title -->
    <div class="super-title-box">
      <p class="super-title">{@html data.title}</p>
    </div>

    <!-- Motto/Quote -->
    <div class="super-motto-box">
      <span class="super-motto">
        {@html data.motto}
      </span>
    </div>

    <!-- Button -->
    <button class="super-button">
      {data.buttonText}
    </button>
  </div>
</div>

<style>
  .super-scaler {
    transform-origin: top left;
    pointer-events: none;
  }

  .super-window-container {
    position: relative;
    pointer-events: all;
    user-select: none;
    color: #cccccc;
    text-shadow: 1px 1px 2px black;
    font-family: "Cubic", sans-serif;
    width: 100%;
  }

  .frame-img {
    position: relative;
    z-index: 10;
    width: 100%;
    height: auto;
    pointer-events: none;
  }

  .super-pic-box {
    position: absolute;
    top: 30px;
    left: 5px;
    width: 98%;
    height: 90%;
    z-index: 0;
    overflow: hidden;
  }

  .super-pic {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .super-title-box {
    position: absolute;
    left: 220px;
    top: 20px;
    width: 570px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 15;
  }

  .super-title {
    margin: 0;
    text-align: center;
    font-size: 24px;
    color: white;
  }

  .super-motto-box {
    position: absolute;
    left: 210px;
    top: 440px;
    width: 580px;
    z-index: 15;
    text-align: center;
  }

  .super-motto {
    font-size: 18px;
    white-space: pre-line;
    line-height: 1.4;
  }

  .super-button {
    position: absolute;
    top: 585px;
    left: 350px;
    width: 300px;
    height: 35px;
    border: none;
    background: url("/tfr/template/spacebar.png") no-repeat;
    background-size: 100% 100%;
    color: #cccccc;
    font-size: 19px;
    z-index: 20;
    cursor: pointer;
    font-family: "Cubic", sans-serif;
  }
</style>
