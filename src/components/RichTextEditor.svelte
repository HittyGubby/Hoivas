<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Quill from "quill";
  import "quill/dist/quill.snow.css";

  let { content = $bindable(), placeholder = "请输入内容..." } = $props();
  let editorElement: HTMLElement;
  let quill: Quill;

  let internalChange = false;

  function wrap(html: string) {
    return `<p>${html}</p>`;
  }

  function unwrap(html: string) {
    //strip eall surrounding p tags and double br tags
    return html.replace(/<\/p><p>/g, "<br>").replace(/^<p>|<\/p>$/g, "");
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

    quill.on("text-change", () => {
      internalChange = true;
      content = unwrap(quill.root.innerHTML);
      setTimeout(() => {
        internalChange = false;
      }, 0);
    });
  });

  $effect(() => {
    if (quill && !internalChange) {
      const wrapped = unwrap(content);
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
