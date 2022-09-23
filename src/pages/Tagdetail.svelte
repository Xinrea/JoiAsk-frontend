<script>
  import Navbar from "../components/Navbar.svelte";
  import Card from "../components/Card.svelte";
  import TopButton from "../components/TopButton.svelte";
  import InfiniteLoading from "svelte-infinite-loading";
  export let tag = 1;
  export let tag_name = "";
  let cards = [];
  let page = 1;
  function queryCards({ detail: { loaded, complete } }) {
    fetch(`/api/question?tag_id=${tag}&page=${page}&size=5&publish=true`)
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
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
<div class="container">
  <div class="card_list">
    <div class="tagname">
      #{tag_name}
    </div>
    {#each cards as card}
      <Card data={card} />
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
  .tagname {
    font-size: 40px;
    padding: 10px 20px;
    display: flex;
    margin-top: 20px;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: #ff9800;
    border-radius: 10px;
  }
</style>
