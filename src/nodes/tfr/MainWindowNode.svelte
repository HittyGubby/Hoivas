<script lang="ts">
  import { NodeResizer } from "@xyflow/svelte";
  import PieChart from "../../components/PieChart.svelte";

  let { data, selected, width, height } = $props();

  const BASE_WIDTH = 550;
  let scale = $derived((width || BASE_WIDTH) / BASE_WIDTH);

  // Helper for progress bar width
  let progressWidth = $derived((data.progress || 0) + "px");
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
        src="/tfr/template/flag_overlay.png"
        class="fill-img overlay-flag"
        alt=""
      />
    </div>

    <!-- Leader Section -->
    <div class="leader-box">
      <img src="/tfr/template/Leader_Background.png" class="fill-img" alt="" />
      <img src={data.leaderImg} class="fill-img" alt="" />
      <img
        src="/tfr/template/diplo_leader_frame.png"
        class="leader-frame"
        alt=""
      />
    </div>

    <!-- UI Background Frames -->
    <img src="/tfr/template/diplo_upper_win_bg.png" class="upper-bg" alt="" />
    <img src="/tfr/template/diplo_top_bg_diplo_tab.png" class="tab-bg" alt="" />

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
        style:transform="scale({data.factionScale || 1})"
        class="contain-img"
        alt=""
      />
    </div>

    <!-- Pie Chart -->
    <div class="pie-chart-container">
      <img src="/tfr/template/bck_shadow.png" class="pie-shadow" alt="" />
      <div class="pie-wrapper">
        <PieChart data={data.chartData} />
      </div>
      <img
        src="/tfr/template/pol_piechart_overlay_63x63.png"
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
        src={data.focusImg || "/tfr/preset/goal_unknown.png"}
        style:transform="scale({data.focusScale || 0.9})"
        class="focus-img"
        alt=""
      />
    </div>
    <div class="focus-progress-container">
      <img
        src="/tfr/template/pol_goal_progress_frame.png"
        class="progress-frame"
        alt=""
      />
      <img src="/tfr/template/diplo_goal_button.png" class="goal-btn" alt="" />
      <div class="progress-bar-clip" style:width="{data.progress || 0}px">
        <img
          src="/tfr/template/pol_goal_progress.png"
          style:width="235px"
          style:height="10px"
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
    font-family: "Cubic", sans-serif;
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
    top: 17px;
    left: 24px;
    width: 90px;
    height: 55px;
    z-index: 20;
  }
  .overlay-flag {
    transform: scale(1.2);
  }

  .leader-box {
    position: absolute;
    top: 79px;
    left: 12px;
    width: 115px;
    height: 157px;
    z-index: 0;
  }
  .leader-frame {
    position: absolute;
    top: 0;
    height: inherit;
    width: inherit;
    transform: scale(1.1);
    z-index: 10;
  }

  .upper-bg {
    position: absolute;
    left: 125px;
    top: 8px;
    z-index: 2;
  }
  .tab-bg {
    position: absolute;
    left: 125px;
    top: 76px;
    z-index: 2;
  }

  /* Info Groups */
  .info-group-top {
    position: absolute;
    left: 228px;
    top: 14px;
    z-index: 5;
    font-size: 16px;
  }
  .info-group-top p {
    margin: 0;
    white-space: nowrap;
    line-height: 1;
  }
  .info-group-top p + p {
    margin-top: 5px;
  }

  .info-group-mid {
    position: absolute;
    top: 92px;
    left: 238px;
    z-index: 3;
    font-size: 16px;
  }
  .info-group-mid p {
    margin: 0;
    white-space: nowrap;
    line-height: 1;
  }
  .info-group-mid p + p {
    margin-top: 5px;
  }

  /* Icons */
  .ideology-icon-container {
    position: absolute;
    top: 45px;
    left: 180px;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .faction-icon-container {
    position: absolute;
    top: 43px;
    left: 485px;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Pie Chart */
  .pie-chart-container {
    position: absolute;
    top: 72px;
    left: 133px;
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
    width: 70px;
    height: 70px;
    z-index: 4;
    border-radius: 50%;
  }
  .pie-overlay {
    position: absolute;
    transform: scale(0.9);
    z-index: 5;
  }

  /* Focus Progress */
  .focus-icon-container {
    position: absolute;
    top: 153px;
    left: 182px;
    z-index: 5;
    display: flex;
    justify-content: center;
  }
  .focus-img {
    position: absolute;
  }

  .focus-progress-container {
    position: absolute;
    top: 220px;
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
    top: -15px;
    left: -118px;
    overflow: hidden;
  }

  .focus-text-container {
    position: absolute;
    width: 248px;
    left: 249px;
    top: 185px;
    display: flex;
    justify-content: center;
    z-index: 5;
  }
  .focus-title {
    margin: 0;
    text-align: center;
  }
</style>
