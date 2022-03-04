<script>
  import TitleButton from './TitleButton.svelte'
  import { router } from 'tinro'
  export let current = '提问'
  let navroutes = {
    提问: '/',
    话题: '/tags',
    彩虹屁: '/rainbow'
  }

  function changeCurrent(event) {
    router.goto(navroutes[event.target.innerText])
    current = event.target.innerText
  }
</script>

<div class="navbar">
  <div id="logo" />
  <TitleButton content="提问" {current} on:click={changeCurrent} />
  <TitleButton content="话题" {current} on:click={changeCurrent} />
  <TitleButton content="彩虹屁" {current} on:click={changeCurrent} />
</div>

<style>
  div {
    display: flex;
  }
  .navbar {
    height: 56px;
    padding: 0 10px;
    align-items: center;
    background-color: #ff9800;
    box-shadow: 0 0 10px #00000044;
    z-index: 999;
  }
  #logo {
    cursor: pointer;
    width: 40px;
    height: 40px;
    background-size: contain;
    background-image: url(/favicon.png);
    margin-right: 10px;
  }
</style>
