<script>
  function toTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
</script>

<div class="topButton" on:click={toTop}>
  <svg style="width:40px;height:40px" viewBox="0 0 24 24">
    <path
      fill="#ffa726"
      d="M13,18V10L16.5,13.5L17.92,12.08L12,6.16L6.08,12.08L7.5,13.5L11,10V18H13M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"
    />
  </svg>
</div>

<style>
  .topButton {
    cursor: pointer;
    position: fixed;
    width: 40px;
    height: 40px;
    bottom: 20px;
    right: 20px;
    z-index: 900;
    background: #fff;
    border-radius: 50%;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
  .topButton:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
</style>
