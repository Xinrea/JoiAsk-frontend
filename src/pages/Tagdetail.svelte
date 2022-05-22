<script>
  import Navbar from '../components/Navbar.svelte'
  import Card from '../components/Card.svelte'
  import TopButton from '../components/TopButton.svelte'
  import InfiniteLoading from 'svelte-infinite-loading'
  export let tag = 1
  let tagname = ''
  let cards = []
  let page = 1
  queryQuestions()
  function queryQuestions() {
    fetch('/api/tag?tag_id=' + tag)
      .then((response) => response.json())
      .then((res) => {
        if (res.code === 0) {
          tagname = res.data.name
        } else {
          tagname = '该话题不存在'
        }
      })
  }
  function queryCards({ detail: { loaded, complete } }) {
    fetch(`/api/questions?tag_id=${tag}&page=${page}&size=5`)
      .then((response) => response.json())
      .then((res) => {
        console.log(res)
        if (res.code === 0) {
          page++
          if (res.data.length < 5) {
            cards = cards.concat(res.data)
            complete()
          } else {
            cards = cards.concat(res.data)
            loaded()
          }
        } else {
          cards = []
        }
      })
  }
</script>

<Navbar current="Tags" />
<TopButton />
<div class="container">
  <div class="card_list">
    <div class="tagname">
      #{tagname}
    </div>
    {#each cards as card}
      <Card data={card} />
    {/each}
  </div>
  <InfiniteLoading on:infinite={queryCards}>
    <div class="info" slot="noMore">🍊已经到底啦🍊</div>
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
