<script>
  import Navbar from "../components/Navbar.svelte";
  import TopButton from "../components/TopButton.svelte";
  import Select from "svelte-select";
  import Hashtag from "../components/Hashtag.svelte";
  import PostCard from "../components/PostCard.svelte";
  export let loggedIn = false;
  let tagValue = {value: null, label: "所有话题"};
  let items = [];
  let searchValue = "";
  let searchResult = [];
  function initTagSelection() {
    fetch(`/api/tag`)
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          res.data.reverse();
          items = res.data.map((item) => {
            return { value: item, label: item.tag_name };
          });
          // add all tag option
          items.unshift({ value: null, label: "所有话题" });
        }
      });
  }

  function doSearch() {
    if (searchValue == "") {
      return;
    }
    let request = `/api/question?page=0&size=20&search=${searchValue}&publish=true`
    if (tagValue && tagValue.value) {
      request += `&tag_id=${tagValue.value.id}`
    }
    fetch(request)
      .then((res) => res.json())
      .then((res) => {
        searchResult = res.data.questions;
      });
  }
  initTagSelection();
</script>

<Navbar current="搜索" />
<TopButton />
<div class="title">
  <h1 class="text-4xl text-center pt-16 font-bold">提问搜索</h1>
  <p class="text-center">最多显示 20 条搜索结果</p>
</div>
<div class="themed mt-16 p-2 flex justify-center">
  <div class="w-[140px]">
    <Select
      Icon={Hashtag}
      {items}
      bind:value={tagValue}
      noOptionsMessage="没有相应的话题"
      placeholder="选择话题"
    />
  </div>
  <input
    type="text"
    class="w-1/3 p-2 ml-2 rounded-l-lg"
    maxlength="50"
    bind:value={searchValue}
  />
  <button
    class="search-btn p-2 bg-blue-500 text-white rounded-r-lg"
    on:click={doSearch}>搜索</button
  >
</div>
{#if searchResult.length == 0}
  <div class="title flex justify-center mt-16">没有找到相关的提问(๑´• .̫ •ू`๑)</div>
{/if}
{#each searchResult as card}
  <PostCard data={card} login={loggedIn} />
{/each}

<style>
  .themed {
    @apply text-primary;
    font-size: 12px;
    --inputFontSize: 12px;
    --itemFontSize: 12px;
    --borderRadius: 30px;
    --selectedItemPadding: 0 10px 0 8px;
    --inputPadding: 0 0 0 40px;
    --clearSelectColor: theme("colors.primary / 10%");
    --clearSelectFocusColor: theme("colors.primary");
    --clearSelectHoverColor: theme("colors.primary");
    --clearSelectTop: 5px;
    --clearSelectBottom: 5px;
    --clearSelectWidth: 20px;
    --inputColor: theme("colors.primary");
    --itemColor: theme("colors.primary");
    --itemActiveBackground: theme("colors.primary");
    --itemIsActiveBG: theme("colors.primary");
    --itemIsActiveColor: rgb(255, 255, 255);
    --itemHoverBG: theme("colors.primary / 10%");
    --placeholderColor: theme("colors.primary");
    --indicatorColor: theme("colors.primary");
    --border: none;
    z-index: 9;
  }

  .title {
    color: theme("colors.primary");
  }

  .search-btn {
    margin-left: 0;
    font-size: 14px;
    width: 40px;
    background-color: var(--inputColor) !important;
  }

  .search:hover {
    background-color: theme("colors.primary / 80%") !important;
  }
</style>
