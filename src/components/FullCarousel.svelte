<script>
  import { onMount } from 'svelte'
  import { Images } from 'svelte-images'
  export let exit
  export let images = [
    { src: 'https://via.placeholder.com/180x200/1' },
    { src: 'https://via.placeholder.com/180x200/1' },
    { src: 'https://via.placeholder.com/180x200/1' },
    { src: 'https://via.placeholder.com/180x200/1' }
  ]
  function quit() {
    exit()
    document.body.style.overflowY = 'scroll'
  }
  onMount(() => {
    document.body.style.overflowY = 'hidden'
    console.log(images)
  })
</script>

<div class="full-carousel">
  <div class="close" on:click={quit}>退出</div>
  <Images {images} gutter={5} />
</div>

<style>
  .full-carousel {
    display: block;
    overflow-y: auto;
    align-items: center;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    padding: 80px 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.9);
  }

  .close {
    cursor: pointer;
    color: white;
    position: fixed;
    padding: 10px;
    top: 20px;
    right: 20px;
    transition: background-color 0.3s ease;
    z-index: 9999;
  }
  .close:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
</style>
