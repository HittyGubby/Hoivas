<script lang="ts">
  import { NodeResizer } from "@xyflow/svelte";

  let { data, selected, width, height } = $props();

  const BASE_WIDTH = 700;
  let scale = $derived(width / BASE_WIDTH);
</script>

{#if selected}
  <NodeResizer minWidth={200} color="var(--theme-color)" keepAspectRatio={true} />
{/if}

<div class="news-scaler" style:transform="scale({scale})" style:width="{BASE_WIDTH}px">
  <div class="news-window-container">
    <img src="/tfr/template/news/event_news_bg.png" class="bg-img" alt="" />

    <!-- News Image -->
    <div class="news-pic-box">
      <img src={data.newsImg} class="news-pic" alt="News" />
    </div>

    <!-- Title -->
    <div class="news-title-box">
      <p class="news-title">{data.title}</p>
    </div>

    <!-- Body Text -->
    <div class="news-body-box">
      <span class="news-body">{@html data.body}</span>
    </div>
    <!-- Button -->
    <button class="news-button">
      {data.buttonText || "Understood."}
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

  .news-pic-box {
    position: absolute;
    top: 160px;
    left: 140px;
    width: 410px;
    height: 150px;
    overflow: hidden;
  }

  .news-pic {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .news-title-box {
    position: absolute;
    left: 100px;
    top: 110px;
    width: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .news-title {
    margin: 0;
    text-align: center;
    font-family: "kenyan", "huangyouti", sans-serif;
    font-size: 28px;
    color: #000000;
  }

  .news-body-box {
    position: absolute;
    left: 75px;
    top: 330px;
    width: 550px;
    max-height: 350px;
    overflow: hidden;
  }

  .news-body {
    font-family: "electrolize", "FZRui", sans-serif;
    font-size: 18px;
    line-height: 1.4;
    white-space: pre-line;
    text-align: left;
  }

  .news-button {
    position: absolute;
    top: 700px;
    left: 180px;
    width: 352px;
    height: 48px;
    border: none;
    background: url("/tfr/template/news/event_option_entry.png") no-repeat;
    background-size: 100% 100%;
    color: #ffffff;
    font-family: "electrolize", "FZRui", sans-serif;
    font-size: 18px;
    cursor: pointer;
  }
</style>
