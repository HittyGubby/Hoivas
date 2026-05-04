<script lang="ts">
  import { setVersion, type ProjectVersion } from "./utils/version";
  import { fade, fly } from "svelte/transition";
  import { Settings } from "lucide-svelte";
  import { globalSettings } from "./utils/settings";

  let { onOpenSettings } = $props();

  function selectVersion(v: ProjectVersion) {
    setVersion(v);
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (link) {
      link.href = `${v}/favicon.png`;
    }
  }
</script>

<div class="welcome-container" in:fade={{ duration: 500 }}>
  <!-- Background Image Placeholder (usually HOI4 artwork) -->
  <div class="bg-overlay"></div>

  <div class="main-menu" in:fly={{ x: -50, duration: 1000, delay: 200 }}>
    <div class="logo-area">
      <h1 class="title">HOIVAS</h1>
      <p class="subtitle">ALL IN ONE</p>
    </div>

    <div class="menu-list">
      <button class="menu-btn" onclick={() => selectVersion("tfr")}>
        <span class="btn-text">THE FIRE RISES</span>
      </button>

      <button class="menu-btn" onclick={() => selectVersion("tno")}>
        <span class="btn-text">THE NEW ORDER</span>
      </button>

      <div class="divider"></div>

      <button class="menu-btn secondary" onclick={onOpenSettings}>
        <Settings size={18} />
        <span class="btn-text">SETTINGS</span>
      </button>
    </div>

    <div class="footer">
      <p>HOIVAS PROJECT SERIES</p>
      <p>PROUDLY PRESENTS</p>
      <p>© <a href="https://github.com/HittyGubby/Hoivas" style="color:blueviolet">HOIVAS</a></p>
    </div>
  </div>

  <div class="side-info" in:fade={{ delay: 800 }}>
    <div class="news-box">
      <h3>最新更新</h3>
      <ul>
        <li>整合TNO/TFR</li>
        <li>国策树支持</li>
        <li>画板化重构</li>
      </ul>
      <br />
      <h3>敬请期待</h3>
      <ul>
        <li>Pax Brittanica</li>
        <li>决议界面</li>
        <li>甚至...地图？</li>
      </ul>
    </div>
  </div>
</div>

<style>
  .welcome-container {
    width: 100vw;
    height: 100vh;
    background: #050505;
    background-image: radial-gradient(circle at 70% 30%, #1a1a2e 0%, #050505 100%);
    display: flex;
    align-items: center;
    gap: 100px;
    padding: 0 10%;
    color: white;
    font-family: "FZRui", "Aldrich", sans-serif;
    overflow: hidden;
    position: relative;
  }

  .bg-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 50%);
    pointer-events: none;
  }

  .main-menu {
    position: relative;
    z-index: 10;
    width: 400px;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .logo-area {
    border-left: 4px solid var(--theme-color);
    padding-left: 20px;
  }

  .title {
    font-size: 72px;
    margin: 0;
    letter-spacing: 8px;
    line-height: 1;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }

  .subtitle {
    font-size: 18px;
    color: #888;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-top: 5px;
  }

  .menu-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .menu-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ccc;
    padding: 15px 25px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .menu-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--theme-color);
    color: white;
    transform: translateX(10px);
  }

  .menu-btn::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0;
    background: var(--theme-color);
    transition: width 0.2s;
    opacity: 0.3;
  }

  .menu-btn:hover::before {
    width: 100%;
  }

  .btn-text {
    font-size: 20px;
    letter-spacing: 2px;
    font-weight: bold;
    z-index: 1;
  }

  .btn-desc {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
    z-index: 1;
  }

  .menu-btn.secondary {
    flex-direction: row;
    align-items: center;
    gap: 15px;
    padding: 12px 25px;
    background: transparent;
    opacity: 0.7;
  }

  .menu-btn.secondary:hover {
    opacity: 1;
    transform: translateX(5px);
  }

  .menu-btn.secondary .btn-text {
    font-size: 16px;
  }

  .divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 10px 0;
  }

  .footer {
    color: #444;
    font-size: 12px;
    line-height: 1.6;
  }

  .side-info {
    z-index: 10;
    width: 300px;
  }

  .news-box {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 25px;
  }

  .news-box h3 {
    font-size: 14px;
    color: var(--theme-color);
    margin: 0 0 15px 0;
    letter-spacing: 2px;
  }

  .news-box ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .news-box li {
    font-size: 13px;
    color: #aaa;
    line-height: 1.4;
  }
</style>
