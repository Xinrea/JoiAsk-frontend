<script>
  import Navbar from "../components/Navbar.svelte";
  import TopButton from "../components/TopButton.svelte";
  import InfiniteLoading from "svelte-infinite-loading";
  import PostCard from "../components/PostCard.svelte";
  import Select from "svelte-select";
  import Toggle from "../components/Toggle.svelte";
  export let tag = 1;
  export let tag_name = "";
  export let loggedIn = false;

  // Filter params
  const Order = {
    ASC: "asc",
    DESC: "desc",
  };
  const OrderItems = [
    { label: "从新到旧", value: Order.DESC },
    { label: "从旧到新", value: Order.ASC },
  ];
  let filter = {
    hideArchive: false,
    order: OrderItems[0],
  };
  let cards = [];
  let page = 1;
  function queryCards({ detail: { loaded, complete } }) {
    fetch(
      `/api/question?tag_id=${tag}&page=${page}&size=5&publish=true&order_by=id&order=${filter.order.value}${filter.hideArchive ? "&archive=false" : ""}`,
    )
      .then((response) => response.json())
      .then((res) => {
        if (res.code === 200) {
          page++;
          if (res.data.questions.length < 5) {
            cards = cards.concat(res.data.questions);
            complete();
          } else {
            cards = cards.concat(res.data.questions);
            loaded();
          }
        } else {
          cards = [];
          complete();
        }
      });
  }
</script>

<Navbar current="Tags" />
<TopButton />
<div class="infinite-container">
  <div class="card_list">
    <div class="watermark">
      #{tag_name}
    </div>
    <div class="themed max-w-[600px] w-5/6 flex justify-between order-select">
      <Toggle
        label="隐藏归档卡片"
        bind:value={filter.hideArchive}
        on:change={() => {
          page = 1;
          cards = [];
        }}
      />
      <Select
        items={OrderItems}
        bind:value={filter.order}
        isClearable={false}
        on:select={() => {
          page = 1;
          cards = [];
        }}
        isSearchable={false}
      ></Select>
    </div>
    {#each cards as card}
      <PostCard data={card} login={loggedIn} />
    {/each}
  </div>
  <InfiniteLoading on:infinite={queryCards} identifier={filter}>
    <div class="info" slot="noMore">已经到底啦( ´･･)ﾉ(._.`)</div>
    <div class="info" slot="noResults">已经到底啦( ´･･)ﾉ(._.`)</div>
  </InfiniteLoading>
</div>

<style>
  .card_list {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .watermark {
    font-family: system-ui;
    margin: 50px 0;
    color: orange;
    box-shadow:
      0 0 0 3px orange,
      0 0 0 2px orange inset;
    border: 2px solid transparent;
    border-radius: 4px;
    display: inline-block;
    padding: 5px 2px;
    line-height: 50px;
    font-size: 50px;
    text-transform: uppercase;
    text-align: center;
    opacity: 0.8;
    width: 300px;
    transform: rotate(5deg);
    z-index: 5;
  }
  .themed {
    @apply block w-[140px] mb-[10px] text-primary;
    font-size: 12px;
    --height: 30px;
    --inputFontSize: 12px;
    --itemFontSize: 12px;
    --background: theme("colors.primary / 10%");
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

  .order-select {
    --background: white;
    --indicatorTop: 5px;
    --indicatorRight: 5px;
    --selectedItemPadding: 0 10px 0 0;
  }
</style>
