<script lang="ts">
  import { NodeResizer } from "@xyflow/svelte";
  import PieChart from "../../components/PieChart.svelte";
  import { resolveAsset } from "../../utils/assets";

  let { data, selected, width, height } = $props();
  const version = "pb";

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
      <div class="flag-container">
      <img src={data.flagImg} class="fill-img" alt="" />
      <img
        src={"/pb/template/flag_overlay.png"}
        class="fill-img overlay-flag"
        alt=""
      /></div>
      <img src="/pb/template/diplo_flag_frame.png" class="flag-frame" alt="" />
    </div>

    <!-- Leader Section -->
    <div class="leader-box">
      <img
        src={"/pb/template/Leader_Background.png"}
        class="fill-img"
        alt=""
      />
      <img src={data.leaderImg} class="fill-img" alt="" />
    </div>
    <img
      src={"/pb/template/diplo_leader_frame.png"}
      class="leader-frame"
      alt=""
    />
    <!-- UI Background Frames -->
    <img src={"/pb/template/diplo_top_bg_diplo_tab.png"} class="upper-bg" alt="" />
    <img src={"/pb/template/diplo_upper_win_bg.png"} class="top-bg" alt="" />

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
        style:transform="scale({data.factionScale || 1.0})"
        class="contain-img"
        alt=""
      />
    </div>

    <!-- Pie Chart -->
    <div class="pie-chart-container">
      <div class="pie-wrapper">
        <PieChart data={data.chartData} />
      </div>
      <img
        src={"/pb/template/pol_piechart_overlay_63x63.png"}
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
        src={"/pb/template/pol_goal_progress_frame.png"}
        class="progress-frame"
        alt=""
      />
      <img
        src={"/pb/template/diplo_goal_button.png"}
        class="goal-btn"
        alt=""
      />
      <div class="progress-bar-clip" style:width="{data.progress || 0}px">
        <img
          src={"/pb/template/pol_goal_progress.png"}
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
    font-family: "Ubuntu", sans-serif;
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
    position: absolute;
  }

  .flag-box {
    position: absolute;
    top: 1px;
    left: 0px;
    width: 85px;
    height: 52px;
    z-index: 7;
  }

  .flag-container{
    position: absolute;
    top: 11px;
    left: 25px;
    width: 85px;
    height: 54px;
    z-index: -1;
  }

  .flag-frame {
    z-index: 8;
  }

  .leader-box {
    position: absolute;
    top: 77px;
    left: 7px;
    width: 120px;
    height: 160px;
    z-index: 0;
  }
  .leader-frame {
    position: absolute;
    top: 71px;
    z-index: 10;
  }

  .top-bg {
    position: absolute;
    left: 126px;
    top: 8px;
    z-index: 2;
  }

  .upper-bg {
    position: absolute;
    left: 125px;
    top: 75px;
    z-index: 2;
  }

  /* Info Groups */
  .info-group-top {
    position: absolute;
    left: 230px;
    top: 28px;
    z-index: 5;
    font-size: 15px;
    font-family: "Ubuntu", sans-serif;
    font-weight: 600;
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
    left: 245px;
    z-index: 3;
    font-size: 15.5px;
    font-weight: 600;
  }
  .info-group-mid p {
    margin: 0;
    white-space: nowrap;
    line-height: 1;
    position: absolute;
  }
  .party-name {
    top: -14px;
  }
  .ideology-name {
    top: 6px;
  }
  .election-info {
    top: 26px;
  }

  /* Icons */
  .ideology-icon-container {
    position: absolute;
    top: 43px;
    left: 180px;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .faction-icon-container {
    position: absolute;
    top: 122px;
    left: 476px;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .focus-img {
    position: absolute;
  }

  /* Pie Chart */
  .pie-chart-container {
    position: absolute;
    top: 70px;
    left: 129px;
    z-index: 3;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
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
    transform: scale(1.1);
    z-index: 5;
  }

  /* Focus Progress */
  .focus-icon-container {
    position: absolute;
    top: 202px;
    left: 182px;
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
    z-index: 5;
  }
  .goal-btn {
    position: absolute;
    top: -50px;
    filter: brightness(0.6);
  }
  .progress-bar-clip {
    position: absolute;
    top: -10px;
    left: -118px;
    height:100px;
    overflow: hidden;
    z-index: 4;
  }

  .focus-text-container {
    position: absolute;
    width: 260px;
    left: 244px;
    top: 182px;
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
