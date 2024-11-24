<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let label = "";
  export let value = false;
  function handleChange(event) {
    let value = event.target.value;
    dispatch("change", value);
  }
</script>

<div class="flex items-center text-sm">
  <span>{label}</span>
  <label class="switch ml-1">
    <input type="checkbox" bind:checked={value} on:change={handleChange} />
    <span class="slider round"></span>
  </label>
</div>

<style>
  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #0000008f;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: theme("colors.primary") !important;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #ffb45f;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(23px);
    -ms-transform: translateX(23px);
    transform: translateX(23px);
  }
  .slider.round {
    border-radius: 26px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>
