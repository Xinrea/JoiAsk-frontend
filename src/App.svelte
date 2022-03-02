<script>
  import { Route, router } from 'tinro'
  import Main from './pages/Main.svelte'
  import Tags from './pages/Tags.svelte'
  import Rainbow from './pages/Rainbow.svelte'
  import Tagdetail from './pages/Tagdetail.svelte'
  import Admin from './admin/admin.svelte'
</script>

<Route path="/"><Main /></Route>
<Route path="/tags" let:meta>
  {#if meta.query['tag']}
    <Tagdetail tag={decodeURI(meta.query['tag'])} />
  {:else}
    <Tags />
  {/if}
</Route>
<Route path="/rainbow"><Rainbow /></Route>
<Route path="/admin"><Admin /></Route>
