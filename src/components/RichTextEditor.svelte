<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Quill from "quill";
  import "quill/dist/quill.snow.css";

  let { content = $bindable(), placeholder = "请输入内容..." } = $props();
  let editorElement: HTMLElement;
  let quill: Quill;

  let internalChange = false;

  // Helper to strip ONLY the outer <p> tags but keep internal style spans
  function stripParagraphs(html: string) {
    if (html === "<p><br></p>") return "";
    // This regex replaces <p>...</p> with just the content plus a line break if needed
    return html
      .replace(/<p>/gi, "")
      .replace(/<\/p>/gi, "<br>")
      .replace(/(<br>)+$/gi, ""); // Strip trailing breaks
  }

  onMount(() => {
    quill = new Quill(editorElement, {
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"], // toggled buttons
          ["blockquote", "code-block"],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }], // superscript/subscript
          [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
          [{ direction: "rtl" }], // text direction

          [{ size: ["small", false, "large", "huge"] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults
          [{ font: [] }],
          [{ align: [] }],

          ["clean"], // remove formatting button
          ["link", "image", "video"], // media
        ],
      },
      placeholder,
      theme: "snow",
    });

    // We wrap content in <p> internally for Quill, but strip it for the app
    quill.root.innerHTML = content ? `<p>${content.replace(/<br>/gi, "</p><p>")}</p>` : "";

    quill.on("text-change", () => {
      internalChange = true;
      content = stripParagraphs(quill.root.innerHTML);
      setTimeout(() => {
        internalChange = false;
      }, 0);
    });
  });

  $effect(() => {
    if (quill && !internalChange) {
      const wrapped = content ? `<p>${content.replace(/<br>/gi, "</p><p>")}</p>` : "";
      if (wrapped !== quill.root.innerHTML) {
        quill.root.innerHTML = wrapped;
      }
    }
  });
</script>

<div class="quill-wrapper">
  <div bind:this={editorElement}></div>
</div>

<style>
  .quill-wrapper {
    background: #fff;
    color: #333;
    border-radius: 8px;
    height: 400px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  :global(.ql-toolbar) {
    background: #f8f8f8;
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
  }

  :global(.ql-container) {
    flex: 1;
    overflow-y: auto;
    border: none !important;
    font-family: sans-serif;
  }
</style>
