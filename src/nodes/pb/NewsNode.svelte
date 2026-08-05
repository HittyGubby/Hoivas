<script lang="ts">
  import { NodeResizer } from "@xyflow/svelte";
  import { resolveAsset } from "../../utils/assets";

  let { data, selected, width, height } = $props();
  const version = "pb";

  const BASE_WIDTH = 550; // PB news bg is smaller than TFR
  let scale = $derived(width / BASE_WIDTH);

  const r = (path: string) => resolveAsset(path, version);
</script>

{#if selected}
  <NodeResizer
    minWidth={200}
    color="var(--theme-color)"
    keepAspectRatio={true}
  />
{/if}

<div
  class="news-scaler"
  style:transform="scale({scale})"
  style:width="{BASE_WIDTH}px"
>
  <div class="news-window-container">
    <img src={"/pb/template/news/event_news_bg.png"} class="bg-img" alt="" />

    <!-- News sidebar image -->
    <div class="news-sidebar-pic">
      <img src={data.newsImg} alt="" />
    </div>

    <!-- Title -->
    <div class="news-title-container">
      <p class="news-title">{@html data.title}</p>
    </div>

    <!-- Body Text -->
    <span class="news-body">{@html data.body}</span>

    <!-- Button -->
    <button class="news-button">
      {@html data.buttonText || "帝国的终结。"}
    </button>
  </div>
</div>

<style>
  .news-scaler {
    transform-origin: top left;
    pointer-events: none;
  }

  .news-window-container {
    position: relative;
    pointer-events: all;
    user-select: none;
    color: black;
    width: 100%;
  }

  .bg-img {
    display: block;
    width: 100%;
    height: auto;
  }

  .news-sidebar-pic {
    position: absolute;
    top: 160px;
    left: 30px;
    width: 350px;
    height: 120px;
  }
  .news-sidebar-pic img {
    width: 100%;
    height: 100%;
  }

  .news-header-pic {
    position: absolute;
    top: 10px;
    left: 25px;
    width: 492px;
    height: 75px;
  }
  .news-header-pic img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .news-title-container {
    position: absolute;
    display: flex;
    left: -40px;
    top: 150px;
    justify-content: center;
    align-items: center;
    inline-size: 500px;
  }

  .news-title {
    position: absolute;
    margin: 0;
    text-align: center;
    font-family: "OldTypeNr", sans-serif;
    font-size: 20px;
    color: #000000;
  }

  .news-body {
    font-family: "OldTypeNr", sans-serif;
    position: absolute;
    left: 40px;
    top: 280px;
    color: #000000;
    inline-size: 330px;
    text-align: left;
    font-size: 15px;
    white-space: pre-line;
  }

  .news-button {
    position: absolute;
    top: 570px;
    left: 27px;
    width: 352px;
    height: 52px;
    border: none;
    background: url("/pb/template/news/event_option_entry.png") no-repeat;
    background-size: 100% 100%;
    color: #000000;
    font-family: "OldTypeNr", sans-serif;
    font-size: 16px;
    cursor: pointer;
    transition: 0.2s;
  }
</style>
