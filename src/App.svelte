<script>
  import './app.css'
  import { Route } from "tinro";
  import Main from "./pages/Main.svelte";
  import Tags from "./pages/Tags.svelte";
  import Rainbow from "./pages/Rainbow.svelte";
  import Tagdetail from "./pages/Tagdetail.svelte";
  import Admin from "./admin/admin.svelte";
  import Zoom from 'svelte-zoom';
</script>

<Route path="/"><Main /></Route>
<Route path="/tags" let:meta>
  {#if meta.query["tag"]}
    <Tagdetail
      tag={decodeURI(meta.query["tag"])}
      tag_name={decodeURI(meta.query["tag_name"])}
    />
  {:else}
    <Tags />
  {/if}
</Route>
<Route path="/rainbow"><Rainbow /></Route>
<Route path="/admin"><Admin /></Route>
<Route path="/image" let:meta><Zoom src={meta.query["url"]} alt="" /></Route>
