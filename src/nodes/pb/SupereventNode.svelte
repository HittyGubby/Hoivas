<script lang="ts">
  import { NodeResizer } from "@xyflow/svelte";
  import { resolveAsset } from "../../utils/assets";

  let { data, selected, width, height } = $props();
  const version = "pb";

  const BASE_WIDTH = 1000;
  let scale = $derived(width / BASE_WIDTH);

  const r = (path: string) => resolveAsset(path, version);
</script>

{#if selected}
  <NodeResizer minWidth={200} color="var(--theme-color)" keepAspectRatio={true} />
{/if}

<div class="super-scaler" style:transform="scale({scale})" style:width="{BASE_WIDTH}px">
  <div class="super-window-container">
    <img src={"/pb/template/Pax_Super_Event_Window_Frame.png"} class="frame-img" alt="" />

    <!-- Content Image -->
    <div class="super-pic-box">
      <img src={data.superImg} class="super-pic" alt="" />
    </div>

    <!-- Title -->
    <div class="super-title-box">
      <p class="super-title">{@html data.title}</p>
    </div>

    <!-- Motto/Quote -->
    <span class="super-motto">
      {@html data.motto}
    </span>

    <!-- Button -->
    <button class="super-button">
      {@html data.buttonText}
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
    color: #ffffff;
    text-shadow: 1px 1px 2px black;
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
    top: 200px;
    left: 50px;
    width: 870px;
    height: 600px;
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
    display: flex;
    left: 193px;
    top: 150px;
    justify-content: center;
    align-items: center;
    inline-size: 570px;
    z-index: 15;
  }

  .super-title {
    margin: 0;
    text-align: center;
    font-family: "Pure", sans-serif;
    font-size: 32px;
    color: white;
  }

  .super-motto {
    position: absolute;
    left: 60px;
    top: 580px;
    z-index: 15;
    inline-size: 900px;
    font-family: "Ubuntu", sans-serif;
    font-weight: 600;
    font-size: 26px;
    text-align: left;
    white-space: pre-line;
  }

  .super-button {
    position: absolute;
    top: 810px;
    left: 330px;
    width: 359px;
    height: 36px;
    scale: 1.6;
    border: none;
    background: url("/pb/template/Pax_Super_Event_Close_Button.png") no-repeat;
    background-size: 100% 100%;
    color: #cccccc;
    font-family: "Ubuntu", sans-serif;
    font-weight: 600;
    z-index: 20;
    cursor: pointer;
    margin: 0px;
    padding: 5px;
    display: inline-flex;
    align-items: flex-start;
    justify-content: center;
    text-shadow: 1px 1px 2px black;
  }
</style>
