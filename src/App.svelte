<script lang="ts">
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import FlowEditor from "./FlowEditor.svelte";
</script>

<main>
  <SvelteFlowProvider>
    <FlowEditor />
  </SvelteFlowProvider>
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>
