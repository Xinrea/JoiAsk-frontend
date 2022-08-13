<script>
  import Navbar from "../components/Navbar.svelte";
  import Card from "../components/Card.svelte";
  import TopButton from "../components/TopButton.svelte";
  import InfiniteLoading from "svelte-infinite-loading";
  let cards = [];
  let page = 1;
  function fetchRainbows({ detail: { loaded, complete } }) {
    fetch(`/api/question?rainbow=true&page=${page}&size=5`)
      .then((res) => res.json())
      .then((res) => {
        cards = cards.concat(res.data.questions);
        page++;
        if (res.data.questions.length < 5) {
          complete();
        } else {
          loaded();
        }
      });
  }
</script>

<Navbar current="彩虹屁" />
<TopButton />
<div class="container">
  <div class="card_list">
    {#each cards as card}
      <Card data={card} />
    {/each}
  </div>
  <InfiniteLoading on:infinite={fetchRainbows}>
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
  .info {
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
  }
</style>
