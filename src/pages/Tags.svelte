<script>
  import Navbar from "../components/Navbar.svelte";
  import TopButton from "../components/TopButton.svelte";
  let taglist = [];
  getTagDetailList();
  function getTagDetailList() {
    return fetch("/api/tag")
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          if (res.data !== null) {
            taglist = res.data;
          }
        }
      });
  }
</script>

<Navbar current="话题" />
<TopButton />
<div class="container">
  <div class="taglist">
    {#each taglist as tag}
      <div class="taglist__item">
        <div class="taglist__item__header">
          <a href="/tags?tag={tag.id}&tag_name={tag.tag_name}"
            >#{tag.tag_name}</a
          >
          <span class="taglist__count">投稿数：{tag.question_count}</span>
        </div>
        <div class="taglist_item_desc">{tag.description}</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
  }
  .taglist {
    display: flex;
    width: 600px;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    border: 1px solid orange;
    border-radius: 6px;
    background-color: white;
    transition: all 0.3s ease-in-out;
  }
  .taglist:hover {
    box-shadow: 0 0 20px #ffb74d;
  }
  @media (max-width: 620px) {
    .taglist {
      width: 95%;
    }
  }
  .taglist__item {
    border-bottom: 1px solid orange;
  }
  .taglist__item__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
  }
  .taglist_item_desc {
    font-size: 14px;
    color: #ff9900d8;
    padding: 0px 20px 10px 20px;
  }
  .taglist__item:last-child {
    border-bottom: none;
  }
  .taglist a {
    color: #ff9800;
  }
  .taglist__count {
    color: #ffa726;
    font-size: 12px;
    margin-left: 0.5rem;
  }
</style>
