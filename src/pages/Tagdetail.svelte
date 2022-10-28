<script>
  import Navbar from "../components/Navbar.svelte";
  import TopButton from "../components/TopButton.svelte";
  import InfiniteLoading from "svelte-infinite-loading";
  import PostCard from "../components/PostCard.svelte";
  export let tag = 1;
  export let tag_name = "";
  let cards = [];
  let page = 1;
  function queryCards({ detail: { loaded, complete } }) {
    fetch(`/api/question?tag_id=${tag}&page=${page}&size=5&publish=true`)
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
    {#each cards as card}
      <PostCard data={card} />
    {/each}
  </div>
  <InfiniteLoading on:infinite={queryCards}>
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
    box-shadow: 0 0 0 3px orange, 0 0 0 2px orange inset;
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
</style>
