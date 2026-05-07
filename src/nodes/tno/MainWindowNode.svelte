<script lang="ts">
  import { NodeResizer } from "@xyflow/svelte";
  import PieChart from "../../components/PieChart.svelte";
  import { resolveAsset } from "../../utils/assets";

  let { data, selected, width, height } = $props();
  const version = "tno";

  const BASE_WIDTH = 550;
  let scale = $derived((width || BASE_WIDTH) / BASE_WIDTH);

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
  class="main-scaler"
  style:transform="scale({scale})"
  style:width="{BASE_WIDTH}px"
>
  <div class="main-window-container">
    <!-- Flag Section -->
    <div class="flag-box">
      <img src={data.flagImg} class="fill-img" alt="" />
      <img
        src={"/tno/template/flag_overlay.png"}
        class="fill-img overlay-flag"
        alt=""
      />
    </div>

    <!-- Leader Section -->
    <div class="leader-box">
      <img
        src={"/tno/template/Leader_Background.png"}
        class="fill-img"
        alt=""
      />
      <img src={data.leaderImg} class="fill-img" alt="" />
    </div>
    <img
      src={"/tno/template/diplo_leader_frame.png"}
      class="leader-frame"
      alt=""
    />
    <!-- UI Background Frames -->
    <img src={"/tno/template/diplo_upper_win_bg.png"} class="upper-bg" alt="" />

    <!-- Text Info (Top) -->
    <div class="info-group-top">
      <p class="country-name">{@html data.country}</p>
      <p class="faction-name">{@html data.factionText}</p>
      <p class="leader-name">{@html data.leaderName}</p>
    </div>

    <!-- Icons -->
    <div class="ideology-icon-container">
      <img
        src={data.ideologyImg}
        style:transform="scale({data.ideologyScale || 1})"
        class="contain-img"
        alt=""
      />
    </div>
    <div class="faction-icon-container">
      <img
        src={data.factionImg}
        style:transform="scale({data.factionScale || 0.8})"
        class="contain-img"
        alt=""
      />
    </div>

    <!-- Pie Chart -->
    <div class="pie-chart-container">
      <img src={"/tno/template/bck_shadow.png"} class="pie-shadow" alt="" />
      <div class="pie-wrapper">
        <PieChart data={data.chartData} />
      </div>
      <img
        src={"/tno/template/pol_piechart_overlay_63x63.png"}
        class="pie-overlay"
        alt=""
      />
    </div>

    <!-- Party Info (Mid) -->
    <div class="info-group-mid">
      <p class="party-name">{@html data.partyName}</p>
      <p class="ideology-name">{@html data.ideologyName}</p>
      <p class="election-info">{@html data.electionText}</p>
    </div>

    <!-- Focus Section (Bottom) -->
    <div class="focus-icon-container">
      <img
        src={data.focusImg}
        style:transform="scale({data.focusScale || 0.9})"
        class="focus-img"
        alt=""
      />
    </div>
    <div class="focus-progress-container">
      <img
        src={"/tno/template/pol_goal_progress_frame.png"}
        class="progress-frame"
        alt=""
      />
      <img
        src={"/tno/template/diplo_goal_button.png"}
        class="goal-btn"
        alt=""
      />
      <div class="progress-bar-clip" style:width="{data.progress || 0}px">
        <img
          src={"/tno/template/pol_goal_progress.png"}
          style:width="235px"
          style:height="5px"
          alt=""
        />
      </div>
    </div>
    <div class="focus-text-container">
      <p class="focus-title">{@html data.focusText}</p>
    </div>
  </div>
</div>

<style>
  .main-scaler {
    transform-origin: top left;
    pointer-events: none;
  }

  .main-window-container {
    position: relative;
    pointer-events: all;
    user-select: none;
    color: #cccccc;
    text-shadow: 1px 1px 2px black;
    font-family: "Aldrich", "FZRui", sans-serif;
    width: 100%;
    height: 350px;
  }

  /* Layers & Frames */
  .fill-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .contain-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .flag-box {
    position: absolute;
    top: 15px;
    left: 25px;
    width: 85px;
    height: 52px;
    z-index: 10;
  }
  .overlay-flag {
    transform: scale(1.3);
  }

  .leader-box {
    position: absolute;
    top: 79px;
    left: 7px;
    width: 120px;
    height: 160px;
    z-index: 0;
  }
  .leader-frame {
    position: absolute;
    top: 0;
    z-index: 10;
  }

  .upper-bg {
    position: absolute;
    left: 125px;
    top: 4px;
    z-index: 2;
  }

  /* Info Groups */
  .info-group-top {
    position: absolute;
    left: 225px;
    top: 26px;
    z-index: 5;
    font-size: 16px;
    font-family: "Bombard", "FZWH", sans-serif;
  }
  .info-group-top p {
    margin: 0;
    white-space: nowrap;
    line-height: 1;
    position: absolute;
  }
  .country-name {
    top: -11px;
  }
  .faction-name {
    top: 8px;
  }
  .leader-name {
    top: 27px;
  }

  .info-group-mid {
    position: absolute;
    top: 108px;
    left: 238px;
    z-index: 3;
    font-size: 17px;
  }
  .info-group-mid p {
    margin: 0;
    white-space: nowrap;
    line-height: 1;
    position: absolute;
  }
  .party-name {
    top: -9px;
  }
  .ideology-name {
    top: 12px;
  }
  .election-info {
    top: 34px;
  }

  /* Icons */
  .ideology-icon-container {
    position: absolute;
    top: 10px;
    left: 147px;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .faction-icon-container {
    position: absolute;
    top: 8px;
    left: 445px;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Pie Chart */
  .pie-chart-container {
    position: absolute;
    top: 72px;
    left: 129px;
    z-index: 3;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pie-shadow {
    position: absolute;
    transform: scale(0.6);
    z-index: 0;
  }
  .pie-wrapper {
    width: 100px;
    height: 100px;
    z-index: 4;
    border-radius: 50%;
    transform: scale(0.6);
  }
  .pie-overlay {
    position: absolute;
    transform: scale(0.42);
    z-index: 5;
  }

  /* Focus Progress */
  .focus-icon-container {
    position: absolute;
    top: 202px;
    left: 179px;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .focus-img {
    position: absolute;
  }

  .focus-progress-container {
    position: absolute;
    top: 218px;
    left: 373px;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .progress-frame {
    position: absolute;
  }
  .goal-btn {
    position: absolute;
    top: -50px;
  }
  .progress-bar-clip {
    position: absolute;
    top: -12.5px;
    left: -118px;
    overflow: hidden;
  }

  .focus-text-container {
    position: absolute;
    width: 260px;
    left: 244px;
    top: 186px;
    display: flex;
    justify-content: center;
    z-index: 5;
  }
  .focus-title {
    margin: 0;
    text-align: center;
    font-size: 18px;
  }
</style>
