<script>
  import "./app.css";
  import { Route } from "tinro";
  import Main from "./pages/Main.svelte";
  import Tags from "./pages/Tags.svelte";
  import Rainbow from "./pages/Rainbow.svelte";
  import Tagdetail from "./pages/Tagdetail.svelte";
  import Admin from "./admin/admin.svelte";
  import Zoom from "svelte-zoom";
  import Search from "./pages/Search.svelte";
  import { emojiStore } from "./stores/emojiStore";
  import { archiveStore } from "./stores/archiveStore";
  import { onDestroy } from "svelte";

  let previewURL = "";
  let mousedownPosX;
  let mousedownPosY;
  window.callPreview = (url) => {
    previewURL = url;
  };
  let loggedIn = false;
  function auth() {
    fetch("/api/info", {
      credentials: "include",
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.code === 200) {
          loggedIn = true;
        } else {
          loggedIn = false;
        }
      });
  }
  auth();

  // Create SSE connection
  const sse = new EventSource("/api/sse");
  sse.onopen = () => {
    console.log("SSE connection opened");
  };
  sse.addEventListener("emoji", (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.Type == 1) {
        emojiStore.update((store) => ({
          ...store,
          [data.Data.card_id]: data.Data.emojis,
        }));
      } else {
        archiveStore.update((store) => ({
          ...store,
          [data.Data]: true,
        }));
      }
    } catch (e) {
      console.error("Failed to parse SSE message:", e);
    }
  });

  // Cleanup on component destroy
  onDestroy(() => {
    sse.close();
  });
</script>

<Route path="/"><Main {loggedIn} /></Route>
<Route path="/tags" let:meta>
  {#if meta.query["tag"]}
    <Tagdetail
      tag={decodeURI(meta.query["tag"])}
      tag_name={decodeURI(meta.query["tag_name"])}
      {loggedIn}
    />
  {:else}
    <Tags />
  {/if}
</Route>
<Route path="/rainbow"><Rainbow /></Route>
<Route path="/search"><Search {loggedIn} /></Route>
<Route path="/admin"><Admin /></Route>
{#if previewURL.length > 0}
  <div
    class="w-screen h-screen fixed top-0 left-0 bg-black z-[9999] cursor-grab"
    on:mousedown={(e) => {
      mousedownPosX = e.clientX;
      mousedownPosY = e.clientY;
    }}
    on:mouseup={(e) => {
      if (e.clientX == mousedownPosX && e.clientY == mousedownPosY) {
        previewURL = "";
      }
    }}
  >
    <Zoom src={previewURL} alt="" />
  </div>
{/if}
