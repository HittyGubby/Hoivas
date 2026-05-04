<script lang="ts">
  import { NodeResizer } from "@xyflow/svelte";
  import { resolveAsset } from "../../utils/assets";

  let { data, selected, width, height } = $props();
  const version = "tno";

  const BASE_WIDTH = 1000;
  let scale = $derived(width / BASE_WIDTH);

  const r = (path: string) => resolveAsset(path, version);
</script>

{#if selected}
  <NodeResizer minWidth={200} color="var(--theme-color)" keepAspectRatio={true} />
{/if}

<div class="super-scaler" style:transform="scale({scale})" style:width="{BASE_WIDTH}px">
  <div class="super-window-container">
    <img src={"/tno/template/super_frame.png"} class="frame-img" alt="" />

    <!-- Content Image -->
    <div class="super-pic-box">
      <img src={data.superImg} class="super-pic" alt="" />
    </div>

    <!-- Text Underlay -->
    <div class="super-underlay-box">
      <img src={"/tno/template/superevent_text_underlay.png"} class="underlay-img" alt="" />
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
    top: 85px;
    left: 8px;
    width: 985px;
    height: 673px;
    z-index: 0;
    overflow: hidden;
  }

  .super-pic {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .super-underlay-box {
    position: absolute;
    top: 530px;
    left: 60px;
    width: 940px;
    height: 230px;
    z-index: 1;
  }
  .underlay-img {
    width: 100%;
    height: 100%;
  }

  .super-title-box {
    position: absolute;
    display: flex;
    left: 220px;
    top: 22px;
    justify-content: center;
    align-items: center;
    inline-size: 570px;
    z-index: 15;
  }

  .super-title {
    margin: 0;
    text-align: center;
    font-family: "Aldrich", "FZRui", sans-serif;
    font-size: 32px;
    color: white;
  }

  .super-motto {
    position: absolute;
    right: 10px;
    top: 535px;
    z-index: 15;
    inline-size: 900px;
    font-family: "Bombard", "FZWH", sans-serif;
    font-size: 35px;
    text-align: right;
    white-space: pre-line;
  }

  .super-button {
    position: absolute;
    top: 790px;
    left: 330px;
    width: 359px;
    height: 36px;
    scale: 1.6;
    border: none;
    background: url("/tno/template/spacebar.png") no-repeat;
    background-size: 100% 100%;
    color: #cccccc;
    font-family: "Bombard", "FZWH", sans-serif;
    font-size: 21px;
    z-index: 20;
    cursor: pointer;
    text-shadow: 1px 1px 2px black;
  }
</style>
