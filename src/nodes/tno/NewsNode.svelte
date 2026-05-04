<script lang="ts">
  import { NodeResizer } from "@xyflow/svelte";
  import { resolveAsset } from "../../utils/assets";

  let { data, selected, width, height } = $props();
  const version = "tno";

  const BASE_WIDTH = 550; // TNO news bg is smaller than TFR
  let scale = $derived(width / BASE_WIDTH);

  const r = (path: string) => resolveAsset(path, version);
</script>

{#if selected}
  <NodeResizer minWidth={200} color="var(--theme-color)" keepAspectRatio={true} />
{/if}

<div class="news-scaler" style:transform="scale({scale})" style:width="{BASE_WIDTH}px">
  <div class="news-window-container">
    <img src={"/tno/template/news/event_news_bg.png"} class="bg-img" alt="" />

    <!-- News sidebar image -->
    <div class="news-sidebar-pic">
      <img src={data.newsImg} alt="" />
    </div>

    <!-- News header image -->
    <div class="news-header-pic">
      <img src={data.headerImg} alt="" />
    </div>

    <!-- Title -->
    <div class="news-title-container">
      <p class="news-title">{data.title}</p>
    </div>

    <!-- Body Text -->
    <span class="news-body">{@html data.body}</span>

    <!-- Button -->
    <button class="news-button">
      {data.buttonText || "帝国的终结。"}
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
    top: 145px;
    left: 28px;
    width: 168px;
    height: 438px;
  }
  .news-sidebar-pic img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .news-header-pic {
    position: absolute;
    top: 20px;
    left: 25px;
    width: 480px;
    height: 70px;
  }
  .news-header-pic img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .news-title-container {
    position: absolute;
    display: flex;
    left: 20px;
    top: 125px;
    justify-content: center;
    align-items: center;
    inline-size: 500px;
  }

  .news-title {
    position: absolute;
    margin: 0;
    text-align: center;
    font-family: "OldTypeNr", "FZRui", sans-serif;
    font-size: 20px;
    color: #000000;
  }

  .news-body {
    font-family: "OldTypeNr", "FZRui", sans-serif;
    position: absolute;
    left: 200px;
    top: 150px;
    color: #000000;
    inline-size: 325px;
    text-align: left;
    font-size: 15px;
    white-space: pre-line;
  }

  .news-button {
    position: absolute;
    top: 520px;
    left: 180px;
    width: 352px;
    height: 52px;
    border: none;
    background: url("/tno/template/news/event_option_entry.png") no-repeat;
    background-size: 100% 100%;
    color: #000000;
    font-family: "OldTypeNr", "FZRui", sans-serif;
    font-size: 16px;
    cursor: pointer;
    transition: 0.2s;
  }
</style>
