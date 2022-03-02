<script>
  export let content
  export let current
  export let style = ''
</script>

<div class="title-button" class:active={current == content} {style} on:click>
  {content}
</div>

<style>
  div {
    display: flex;
  }
  .title-button {
    cursor: pointer;
    padding: 0 10px;
    height: 100%;
    font: 14px -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica,
      Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif;
    align-items: center;
    color: white;
    transition: all 0.2s ease-in-out;
  }
  .title-button:hover {
    background: #ffa726;
  }
</style>
