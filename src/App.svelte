<script lang="ts">
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import FlowEditor from "./FlowEditor.svelte";
  import Welcome from "./Welcome.svelte";
  import Modal from "./components/Modal.svelte";
  import SettingsPanel from "./components/SettingsPanel.svelte";
  import { currentVersion, getVersion } from "./utils/version";
  import { db } from "./utils/db";
  import { globalSettings } from "./utils/settings";
  import { onMount } from "svelte";

  let showSettings = $state(false);

  $effect(() => {
    if ($currentVersion) {
      db.setDbName($currentVersion.toUpperCase());
    }
  });

  onMount(() => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (link) {
      link.href = `${getVersion()}/favicon.png`;
    }
  });

  function handleOpenSettings() {
    showSettings = true;
  }
</script>

<main>
  {#if !$currentVersion}
    <Welcome onOpenSettings={handleOpenSettings} />
  {:else}
    <SvelteFlowProvider>
      <FlowEditor version={$currentVersion} />
    </SvelteFlowProvider>
  {/if}

  <Modal title="系统设置" bind:isOpen={showSettings} width="500px" height="auto">
    <SettingsPanel bind:bgColor={$globalSettings.bgColor} bind:themeColor={$globalSettings.themeColor} bind:exportScale={$globalSettings.exportScale} />
  </Modal>
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #000;
  }
</style>
