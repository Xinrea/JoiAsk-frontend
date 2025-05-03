<script>
  import { emojiStore } from "../stores/emojiStore";
  import { onMount } from "svelte";

  let emojis = [
    { id: 0, value: "👍", asset: "emojis/76.png" },
    { id: 1, value: "👎", asset: "emojis/77.png" },
    { id: 2, value: "🤣" },
    { id: 3, value: "😭" },
    { id: 4, value: "😓" },
    { id: 5, value: "😬" },
    { id: 6, value: "🥳" },
    { id: 7, value: "😨" },
    { id: 8, value: "😠" },
    { id: 9, value: "💩", asset: "emojis/59.png" },
    { id: 10, value: "💖", asset: "emojis/66.png" },
    { id: 11, value: "🐵" },
    { id: 12, value: "❓" },
    { id: 13, value: "🫂", asset: "emojis/49.png" },
    { id: 14, value: "🔘", asset: "emojis/424.png" },
    { id: 15, value: "👅", asset: "emojis/339.png" },
    { id: 16, value: "🥺", asset: "emojis/111.png" },
    { id: 17, value: "👻", asset: "emojis/187.png" },
    { id: 18, value: "😅" },
    { id: 19, value: "🌹", asset: "emojis/63.png" },
  ];
  let emojisMap = {
    "👍": "emojis/76.png",
    "👎": "emojis/77.png",
    "🤣": null,
    "😭": null,
    "😓": null,
    "😬": null,
    "🥳": null,
    "😨": null,
    "😠": null,
    "💩": "emojis/59.png",
    "💖": "emojis/66.png",
    "🐵": null,
    "❓": null,
    "🫂": "emojis/49.png",
    "🔘": "emojis/424.png",
    "👅": "emojis/339.png",
    "🥺": "emojis/111.png",
    "👻": "emojis/187.png",
    "😅": null,
    "🌹": "emojis/63.png",
  };
  export let questionID;
  export let data = [];
  let panel = {
    open: false,
  };
  let posted = false;

  // Initialize emoji data in store when component is mounted
  onMount(() => {
    console.log(data);
    emojiStore.subscribe((store) => {
      if (store[questionID]) {
        data = store[questionID];
      }
    });
  });

  function togglePanel() {
    panel.open = !panel.open;
    console.log("toggle emoji panel");
  }

  function doPostEmoji(value) {
    panel.open = false;
    if (posted) {
      return;
    }
    let formData = new FormData();
    formData.append("emoji", value);
    fetch(`/api/question/${questionID}/emoji`, {
      credentials: "include",
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          posted = true;
        } else {
          console.error(res);
        }
      });
  }

  function postEmoji(value) {
    return () => {
      doPostEmoji(value);
    };
  }

  data = data.sort((a, b) => {
    return b.count - a.count;
  });
</script>

<div class="picker inline-block select-none">
  <div class="panel flex flex-row" class:invisible={!panel.open}>
    {#each emojis as { id, value, asset }}
      <div class="emoji-button" on:click={postEmoji(value)}>
        {#if asset}
          <img src={asset} alt={value} height="16px" width="16px" />
        {:else}
          {value}
        {/if}
      </div>
    {/each}
  </div>
  <div class="flex flex-row">
    {#each data as { value, count }}
      <div class="emoji-button" on:click={postEmoji(value)}>
        {#if emojisMap[value]}
          <img src={emojisMap[value]} alt={value} height="16px" width="16px" />
        {:else}
          {value}
        {/if}
        <span class="counter">
          {count}
        </span>
      </div>
    {/each}
    <div class="emoji-button">
      <div class="add-emoji bg-current" on:click={togglePanel}></div>
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
