<script lang="ts">
  import { fade } from "svelte/transition";
  import { Menu, Plus, ImageIcon, Download, FileJson, Upload, Trash2, Settings } from "lucide-svelte";

  let { onAction } = $props();
  let isOpen = $state(false);

  const menuItems = [
    { id: "add", label: "添加新窗口", icon: Plus },
    { id: "divider-1", label: "-", icon: null },
    { id: "settings", label: "系统设置", icon: Settings },
    { id: "save-zip", label: "项目存档管理", icon: Download },
    { id: "divider-2", label: "-", icon: null },
    { id: "export-png", label: "导出为PNG", icon: ImageIcon },
    { id: "export-file", label: "导出为项目文件（ZIP）", icon: FileJson },
    { id: "load-zip", label: "导入项目文件", icon: Upload },
    { id: "divider-3", label: "-", icon: null },
    { id: "clear", label: "清空当前画布", icon: Trash2, danger: true },
  ];

  function handleAction(id: string) {
    if (id === "load-zip") {
      triggerFileInput();
    } else {
      onAction(id);
    }
    isOpen = false;
  }

  let fileInput: HTMLInputElement;
  function triggerFileInput() {
    fileInput.click();
  }

  function handleFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      onAction("load-zip-file", file);
      isOpen = false;
    }
  }
</script>

<div class="project-menu">
  <button class="menu-trigger" onclick={() => (isOpen = !isOpen)}>
    <Menu size={16} /> 菜单
  </button>

  {#if isOpen}
    <div class="menu-dropdown" transition:fade={{ duration: 100 }}>
      {#each menuItems as item}
        {#if item.label === "-"}
          <div class="divider"></div>
        {:else}
          <button class="menu-item" class:danger={item.danger} onclick={() => handleAction(item.id)}>
            <span class="icon">
              {#if item.icon}
                <item.icon size={14} />
              {/if}
            </span>
            {item.label}
          </button>
        {/if}
      {/each}
    </div>
  {/if}

  {#if isOpen}
    <div class="backdrop" onclick={() => (isOpen = false)}></div>
  {/if}

  <input type="file" accept=".zip" bind:this={fileInput} onchange={handleFileChange} style="display: none;" />
</div>

<style>
  .project-menu {
    position: relative;
    pointer-events: all;
  }
  .menu-trigger {
    background: #333;
    border: 1px solid #444;
    color: white;
    padding: 10px 18px;
    border-radius: 8px;
    cursor: pointer;
    font-family: "Cubic", sans-serif;
    font-size: 14px;
    transition: 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .menu-trigger:hover {
    background: #444;
  }

  .menu-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 240px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 10px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
    z-index: 1100;
    display: flex;
    flex-direction: column;
    padding: 6px;
  }

  .menu-item {
    background: transparent;
    border: none;
    color: #aaa;
    padding: 10px 12px;
    text-align: left;
    cursor: pointer;
    font-size: 13px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: 0.2s;
  }
  .menu-item:hover {
    background: #252525;
    color: #fff;
  }
  .menu-item.danger {
    color: #ff8888;
  }
  .menu-item.danger:hover {
    background: #442222;
  }

  .icon {
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .menu-item.danger .icon {
    color: #ff8888;
  }

  .divider {
    height: 1px;
    background: #2a2a2a;
    margin: 6px 8px;
  }
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1050;
  }
</style>
