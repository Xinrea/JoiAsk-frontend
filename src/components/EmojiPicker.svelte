<script>
  let emojis = [
    { id: 0, value: "👍"},
    { id: 1, value: "👎"},
    { id: 2, value: "🤣"},
    { id: 3, value: "😭"},
    { id: 4, value: "😓"},
    { id: 5, value: "😬"},
    { id: 6, value: "🥳"},
    { id: 7, value: "😨"},
    { id: 8, value: "😠"},
    { id: 9, value: "💩"},
    { id: 10, value: "💖"},
    { id: 11, value: "🐵"},
  ];
  export let questionID;
  export let data = [];
  let panel = {
    open: false,
  };
  let posted = false;
  function togglePanel() {
    panel.open = !panel.open;
    console.log("toggle emoji panel");
  };
  function doPostEmoji(value) {
    panel.open = false;
    if (posted) {
      return;
    }
    let formData = new FormData();
    formData.append("emoji", value)
    fetch(`/api/question/${questionID}/emoji`, {
      credentials: "include",
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          posted = true;
          let added = false;
          for (var i = 0; i < data.length; i++) {
            if (data[i].value == value) {
              data[i].count++;
              added = true;
            }
          }
          if (!added) {
            data.push({ value: value, count: 1 });
          }
          data = data.sort((a, b)=>{
            return b.count - a.count;
          });
        } else {
          console.error(res)
        }
      });
  }
  function postEmoji(value) {
    return ()=>{
      doPostEmoji(value);
    }
  }
  data = data.sort((a, b)=>{
    return b.count - a.count;
  });
</script>

<div class="picker inline-block select-none">
  <div class="panel flex flex-row" class:invisible={!panel.open}>
    {#each emojis as {id, value}}
      <div class="emoji-button" on:click={postEmoji(value)}>
        {value}
      </div>
    {/each}
  </div>
  <div class="flex flex-row">
    {#each data as {value, count}}
      <div class="emoji-button" on:click={postEmoji(value)}>
        {value}
        <span class="counter">
          {count}
        </span>
      </div>
    {/each}
    <div class="emoji-button">
      <div class="add-emoji bg-current" on:click={togglePanel}>
      </div>
    </div>
  </div>
</div>

<style>
  .emoji-button {
    display: flex;
    font-size: 16px;
    align-items: center;
    cursor: pointer;
    margin: 2px;
    padding: 0 4px;
    border: 1px dotted gray;
    border-radius: 4px;
  }

  .emoji-button:hover {
    background-color: #ffffff78;
  }

  .counter {
    font-size: 12px;
  }

  .add-emoji {
    height: 24px;
    width: 24px;
    mask-image: url("../assets/emoji_add.svg");
  }

  .panel {
    @apply rounded border border-current border-solid flex-wrap justify-between;
    position: absolute;
    bottom: 48px;
    right: 1rem;
    max-width: 180px;
    z-index: 999;
    background-color: white;
    padding: 0.6rem;
  }

</style>
