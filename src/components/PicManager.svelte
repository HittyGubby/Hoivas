<script lang="ts">
  import { onMount } from "svelte";
  import { db } from "../utils/db";
  import { Trash2, Edit3, Check, X, Search, Upload, GripVertical } from "lucide-svelte";

  let { category, onSelect, onClose } = $props();

  let activeTab = $state<"vanilla" | "custom">("vanilla");
  let vanillaPics = $state<string[]>([]);
  let customPics = $state<any[]>([]);
  let searchQuery = $state("");
  let isLoading = $state(true);

  // Selection & Editing
  let selectedIds = $state<Set<number>>(new Set());
  let editingId = $state<number | null>(null);
  let editName = $state("");

  // Pagination
  let currentPage = $state(1);
  const ITEMS_PER_PAGE = 40;

  async function loadData() {
    isLoading = true;
    try {
      const response = await fetch("/data/index.json");
      const data = await response.json();
      if (category) {
        if (data && data[category]) vanillaPics = data[category].sort();
        customPics = await db.getAllCustomPics(category);
      } else {
        let allVanilla: string[] = [];
        for (const cat in data) {
          allVanilla = [...allVanilla, ...data[cat].map((p: string) => `${cat}/${p}`)];
        }
        vanillaPics = allVanilla.sort();
        customPics = await db.getAllCustomPics("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      isLoading = false;
    }
  }

  onMount(loadData);

  let filteredVanilla = $derived(
    vanillaPics.filter((p) => {
      const terms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
      if (terms.length === 0) return true;
      const lower = p.toLowerCase();
      return terms.every((t) => lower.includes(t));
    }),
  );
  let filteredCustom = $derived(
    customPics.filter((p) => {
      const terms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
      if (terms.length === 0) return true;
      const lower = p.filename.toLowerCase();
      return terms.every((t) => lower.includes(t));
    }),
  );
  let currentList = $derived(activeTab === "vanilla" ? filteredVanilla : filteredCustom);
  let totalPages = $derived(Math.ceil(currentList.length / ITEMS_PER_PAGE));
  let paginatedItems = $derived(currentList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE));

  $effect(() => {
    searchQuery;
    activeTab;
    currentPage = 1;
  });

  async function handleUpload(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;
    for (const file of Array.from(files)) {
      await db.addCustomPic(category || "all", file.name, file);
    }
    customPics = await db.getAllCustomPics(category);
  }

  async function deleteOne(id: number) {
    if (confirm("删除图片？")) {
      await db.deleteCustomPic(id);
      customPics = await db.getAllCustomPics(category);
    }
  }

  async function deleteSelected() {
    if (confirm(`确定删除选中的 ${selectedIds.size} 张图片吗？`)) {
      for (const id of selectedIds) await db.deleteCustomPic(id);
      selectedIds = new Set();
      customPics = await db.getAllCustomPics(category);
    }
  }

  function startRename(item: any) {
    editingId = item.id;
    editName = item.filename;
  }

  async function saveRename() {
    if (editingId && editName) {
      await db.renamePic(editingId, editName);
      editingId = null;
      customPics = await db.getAllCustomPics(category);
    }
  }

  function toggleSelect(id: number, e: Event) {
    e.stopPropagation();
    if (selectedIds.has(id)) selectedIds.delete(id);
    else selectedIds.add(id);
    selectedIds = new Set(selectedIds);
  }

  // Drag & Drop Reordering
  let dragId = $state<number | null>(null);

  function handleDragStart(id: number) {
    dragId = id;
  }

  async function handleDrop(targetId: number) {
    if (dragId === null || dragId === targetId) return;

    const dragIdx = customPics.findIndex((p) => p.id === dragId);
    const dropIdx = customPics.findIndex((p) => p.id === targetId);

    if (dragIdx === -1 || dropIdx === -1) return;

    const newPics = [...customPics];
    const [movedItem] = newPics.splice(dragIdx, 1);
    newPics.splice(dropIdx, 0, movedItem);

    // Update orders in DB in batch
    const updates = newPics.map((p, i) => ({ id: p.id, order: i + 1 }));
    await db.batchUpdatePicOrder(updates);

    customPics = await db.getAllCustomPics(category);
    dragId = null;
  }
</script>

<div class="pic-manager">
  <header class="manager-header">
    <div class="tabs">
      <button class:active={activeTab === "vanilla"} onclick={() => (activeTab = "vanilla")}>内置素材 ({vanillaPics.length})</button>
      <button class:active={activeTab === "custom"} onclick={() => (activeTab = "custom")}>我的上传 ({customPics.length})</button>
    </div>

    <div class="actions">
      {#if activeTab === "custom"}
        {#if selectedIds.size > 0}
          <button class="batch-del-btn" onclick={deleteSelected}><Trash2 size={14} /> 删除选中 ({selectedIds.size})</button>
        {/if}
        <label class="upload-btn">上传<input type="file" multiple accept="image/*" onchange={handleUpload} style="display: none;" /></label>
      {/if}
      <div class="search-box">
        <Search size={14} />
        <input type="text" bind:value={searchQuery} placeholder="搜索图片（空格分割关键词）" />
      </div>
    </div>
  </header>

  {#if isLoading}
    <div class="center-msg">载入中...</div>
  {:else}
    <div class="pic-content">
      {#if activeTab === "vanilla"}
        <div class="pic-grid">
          {#each paginatedItems as item}
            <button class="pic-card" onclick={() => onSelect(item.includes("/") ? `/data/${item}` : `/data/${category}/${item}`)}>
              <div class="img-box"><img src={item.includes("/") ? `/data/${item}` : `/data/${category}/${item}`} alt="" loading="lazy" /></div>
              <p class="name" title={item as string}>{item.split("/").pop()}</p>
            </button>
          {/each}
        </div>
      {:else}
        <div class="pic-list">
          {#each customPics as item (item.id)}
            <div
              class="list-item"
              class:selected={selectedIds.has(item.id)}
              class:dragging={dragId === item.id}
              draggable="true"
              ondragstart={() => handleDragStart(item.id)}
              ondragover={(e) => {
                e.preventDefault();
                e.dataTransfer!.dropEffect = "move";
              }}
              ondrop={() => handleDrop(item.id)}
              onclick={() => onSelect(item.url)}
            >
              <div class="item-drag" onclick={(e) => e.stopPropagation()}><GripVertical size={16} /></div>
              <div class="item-check" onclick={(e) => toggleSelect(item.id, e)}>
                <div class="check-box" class:checked={selectedIds.has(item.id)}></div>
              </div>
              <div class="item-preview"><img src={item.url} alt="" /></div>
              <div class="item-info">
                {#if editingId === item.id}
                  <div class="edit-row" onclick={(e) => e.stopPropagation()}>
                    <input type="text" bind:value={editName} onkeydown={(e) => e.key === "Enter" && saveRename()} />
                    <button class="save" onclick={saveRename}><Check size={14} /></button>
                    <button class="cancel" onclick={() => (editingId = null)}><X size={14} /></button>
                  </div>
                {:else}
                  <span class="filename">{item.filename}</span>
                  <span class="filesize">{(item.size / 1024).toFixed(1)} KB</span>
                {/if}
              </div>
              <div class="item-actions">
                <button
                  onclick={(e) => {
                    e.stopPropagation();
                    startRename(item);
                  }}><Edit3 size={14} /></button
                >
                <button
                  onclick={(e) => {
                    e.stopPropagation();
                    deleteOne(item.id);
                  }}
                  class="del"><Trash2 size={14} /></button
                >
              </div>
            </div>
          {/each}
          {#if customPics.length === 0}
            <div class="center-msg">暂无上传图片</div>
          {/if}
        </div>
      {/if}
    </div>

    {#if activeTab === "vanilla" && totalPages > 1}
      <footer class="pagination">
        <button disabled={currentPage === 1} onclick={() => currentPage--}>上一页</button>
        <div class="page-info">第 <input type="number" bind:value={currentPage} min="1" max={totalPages} /> / {totalPages} 页</div>
        <button disabled={currentPage === totalPages} onclick={() => currentPage++}>下一页</button>
      </footer>
    {/if}
  {/if}
</div>

<style>
  .pic-manager {
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 100%;
    min-height: 0;
    color: #eee;
  }
  .manager-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #333;
    padding-bottom: 12px;
    flex-shrink: 0;
  }
  .tabs {
    display: flex;
    gap: 4px;
    background: #111;
    padding: 4px;
    border-radius: 8px;
  }
  .tabs button {
    background: transparent;
    border: none;
    color: var(--theme-color);
    padding: 6px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-family: "Cubic";
  }
  .tabs button.active {
    background: #333;
  }

  .actions {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .upload-btn {
    background: #224422;
    color: #88ff88;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .batch-del-btn {
    background: #442222;
    color: #ff8888;
    border: 1px solid #662222;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .search-box {
    position: relative;
    display: flex;
    align-items: center;
    background: #252525;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 0 10px;
  }
  .search-box input {
    background: transparent;
    border: none;
    color: white;
    padding: 8px;
    font-size: 13px;
    width: 150px;
    outline: none;
  }
  .search-box :global(svg) {
    color: #666;
  }

  .pic-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .pic-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
    padding: 4px;
  }

  .pic-card {
    background: #252525;
    border: 1px solid #333;
    padding: 8px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
    transition: 0.2s;
  }
  .pic-card:hover {
    background: #2a2a2a;
    transform: translateY(-2px);
  }

  .img-box {
    width: 100%;
    height: 90px;
    background: #111;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }
  .img-box img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .name {
    font-size: 11px;
    color: #aaa;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
  }

  /* List View Styles */
  .pic-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 4px;
  }
  .list-item {
    background: #252525;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: 0.2s;
  }
  .list-item:hover {
    background: #2a2a2a;
    border-color: #444;
  }
  .list-item.selected {
    border-color: var(--theme-color);
    background: rgba(255, 0, 113, 0.05);
  }
  .list-item.dragging {
    opacity: 0.5;
    border: 1px dashed var(--theme-color);
  }

  .item-drag {
    color: #555;
    cursor: grab;
  }
  .item-drag:active {
    cursor: grabbing;
  }

  .check-box {
    width: 18px;
    height: 18px;
    border: 2px solid #444;
    border-radius: 4px;
    background: #111;
    position: relative;
  }
  .check-box.checked {
    background: var(--theme-color);
    border-color: var(--theme-color);
  }
  .check-box.checked::after {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
  }

  .item-preview {
    width: 48px;
    height: 48px;
    background: #111;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }
  .item-preview img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .filename {
    font-size: 14px;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .filesize {
    font-size: 11px;
    color: #666;
  }

  .item-actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: 0.2s;
  }
  .list-item:hover .item-actions {
    opacity: 1;
  }
  .item-actions button {
    background: #333;
    border: none;
    color: #aaa;
    padding: 6px;
    border-radius: 6px;
    cursor: pointer;
  }
  .item-actions button:hover {
    background: #444;
    color: white;
  }
  .item-actions button.del:hover {
    background: #662222;
    color: #ff8888;
  }

  .edit-row {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .edit-row input {
    flex: 1;
    background: #111;
    border: 1px solid #444;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    outline: none;
    font-size: 13px;
  }
  .edit-row button {
    border: none;
    padding: 4px;
    border-radius: 4px;
    cursor: pointer;
  }
  .edit-row button.save {
    background: #224422;
    color: #88ff88;
  }
  .edit-row button.cancel {
    background: #442222;
    color: #ff8888;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    border-top: 1px solid #333;
    padding-top: 15px;
    flex-shrink: 0;
  }
  .pagination button {
    background: #333;
    border: 1px solid #444;
    color: white;
    padding: 6px 15px;
    border-radius: 6px;
    cursor: pointer;
  }
  .page-info input {
    width: 50px;
    background: #111;
    border: 1px solid #333;
    color: white;
    text-align: center;
    border-radius: 4px;
  }

  .center-msg {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
  }
</style>
