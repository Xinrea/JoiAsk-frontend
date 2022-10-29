<script>
  import {router} from "tinro";
  import { createEventDispatcher } from "svelte"
  import {fade} from 'svelte/transition'
  import {onMount} from "svelte";
  export let data = {
    id: 1,
    created_at: "2022-08-08T02:43:52.064917+08:00",
    updated_at: "2022-08-08T02:44:58.217927+08:00",
    tag_id: 1,
    tag: {
      id: 1,
      created_at: "2022-08-08T02:11:39.740543+08:00",
      updated_at: "2022-08-08T02:11:39.740543+08:00",
      tag_name: "提问箱",
      description: "默认话题",
    },
    content: "test content",
    images_num: 0,
    images: "",
    likes: 1,
    is_hide: true,
    is_rainbow: true,
    is_archive: false,
    is_publish: false,
  };
  const maxDegree = 20
  let liked = false
  let cardContentElement
  let card
  let imageList = []
  let scrollEnd = false
  let randDegree = () =>{
    let r = Math.random()*maxDegree - maxDegree/2
    return r+'deg'
  }
  onMount(()=>{
    card.style.transform = `perspective(1500px) rotateX(${randDegree()}) rotateY(${randDegree()})`;
    scrollEnd = cardContentElement.scrollTop + cardContentElement.clientHeight >= cardContentElement.scrollHeight;
  })
  let rainbowParam = 'linear-gradient(\n' +
    '      130deg,\n' +
    '      rgba(220, 93, 231, 0.2) 0%,\n' +
    '      rgba(127, 239, 189, 0.2) 33%,\n' +
    '      rgba(255, 245, 137, 0.2) 66%,\n' +
    '      rgba(236, 11, 67, 0.2) 100%\n' +
    '    )'
  function postTime() {
    let postTimestamp = new Date(data.created_at)/1000
    let unit = '秒'
    let time = Math.floor((Date.now() / 1000) - postTimestamp)
    if (time > 60) {
      time = Math.floor(time / 60)
      unit = '分钟'
      if (time > 60) {
        time = Math.floor(time / 60)
        unit = '小时'
        if (time > 24) {
          // show full formatted time
          return new Date(postTimestamp * 1000).toLocaleString().split(' ')[0]
        }
      }
    }
    return time + unit + ' 前'
  }

  let mouseMoveToTransform = (e) => {
    let rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left; //x position within the element.
    let y = e.clientY - rect.top;  //y position within the element.
    let w = rect.width
    let h = rect.height
    let xPercent = (x / w) * maxDegree - maxDegree/2;
    let yPercent = (y / h) * maxDegree - maxDegree/2;
    e.currentTarget.style.transform = `perspective(1500px) rotateX(${yPercent}deg) rotateY(${-xPercent}deg)`;

    // Calculate param for rainbow effect
    let dx = x - w/2
    let dy = y - h/2
    let d = Math.atan(dy/dx) * 180 / Math.PI + Math.sqrt(dx*dx + dy*dy)/Math.sqrt(w*w + h*h) * 180
    rainbowParam = `linear-gradient(${d}deg, rgba(220, 93, 231, 0.2) 0%, rgba(127, 239, 189, 0.2) 33%, rgba(255, 245, 137, 0.2) 66%, rgba(236, 11, 67, 0.2) 100%)`
  }

  let handleCardMouseMove = (e) => {
    mouseMoveToTransform(e)
  }

  let like = () => {
    fetch(`/api/question/${data.id}/like`, {
      method: "PUT",
    })
  }

  function handleScroll(e) {
    scrollEnd = e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight;
  }
</script>

<div class="flex flex-row w-full overflow-x-auto overflow-y-visible p-6" class:justify-center={imageList.length === 0}>
  <div class="card rotatable" style="--rainbow:{rainbowParam}; --rand-degree: {randDegree()}" class:special={data.is_rainbow} on:mousemove={handleCardMouseMove} bind:this={card}>
    <div class="watermark cursor-pointer" on:click={() => router.goto("/tags?tag=" + data.tag_id + "&tag_name=" + data.tag.tag_name)}>#{data.tag.tag_name}</div>
    <div class="card-header">{postTime()}</div>
    <div class="card-content" class:more={!scrollEnd} bind:this={cardContentElement} on:scroll={handleScroll}>
      <div>
        {#if data.images_num > 0}
          <div class="stamp" on:click={()=>{
            if (imageList.length === 0) {
            imageList = data.images.split(';')
            } else {
              imageList = []
            }
          }}>
            <div class="stamp__content">
            </div>
          </div>
        {/if}
      {data.content}
      {#if data.is_archive}
      <div class="watermark archived" style="--watermark-color: red; transform: rotate(10deg) scale(1.2); top: 70%; left: 20%;">已归档</div>
      {/if}
      </div>
    </div>
    <div class="card-footer">#{data.id} <span class="cursor-pointer" on:click={() => {
    liked = !liked;
    liked ? data.likes++ : data.likes--;
    like();
  }}
    >👍{data.likes}</span></div>
  </div>
  <div class="flex flex-row flex-nowrap overflow-y-visible">
  {#each imageList as image}
    <div class="min-w-[200px]  ml-3 last:mx-3">
      <img src={image} class="rounded-md shadow-lg max-h-[346px] cursor-pointer" transition:fade on:mousemove={handleCardMouseMove} alt="" on:click={()=>{
        // Open in new tab
        window.open('/image?url=' + image, '_blank')
      }}/>
    </div>
  {/each}
  </div>
</div>

<style>
  .card {
    @apply bg-card rounded-md shadow-lg w-5/6 min-h-[300px] min-w-[283px] p-4 text-slate-400 flex flex-col justify-between;
    content-visibility: auto;
  }

  @media (min-width: 720px) {
    .card {
      height: 346px;
      width: 600px;
    }
  }

  .card-header {
    @apply text-left text-sm h-6;
  }

  .card-footer {
    @apply text-right text-sm h-6;
  }

  .card-content {
    @apply flex flex-col my-4 justify-start overflow-y-auto relative text-left text-slate-500 h-full resize-none bg-transparent text-base;
    -ms-overflow-style: none;
    white-space: pre-wrap;
    font-family: 宋体, Fangsong, STFangsong, serif ;
    z-index: 3;
  }

  .card-content::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }

  .more {
    border-bottom: 2px dashed theme('colors.primary / 30%');
  }

  .rotatable {
    transform-style: preserve-3d;
  }

  .watermark {
    position: absolute;
    top: 20px;
    right: 6px;
    font-family: system-ui;
    color: theme('colors.primary / 30%');
    box-shadow: 0 0 0 3px theme('colors.primary / 30%'), 0 0 0 2px theme('colors.primary / 30%') inset;
    border: 2px solid transparent;
    border-radius: 4px;
    display: inline-block;
    padding: 5px 2px;
    line-height: 22px;
    font-size: 24px;
    text-transform: uppercase;
    text-align: center;
    width: 155px;
    transform: rotate(-5deg);
    z-index: 5;
  }

  .archived {
    color: rgba(255, 0, 0, 0.51);
    box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.4), 0 0 0 2px rgba(255, 0, 0, 0.4) inset;
  }

  /* special card with rainbow color background*/
  .special {
    background-image: var(--rainbow);
  }

  .stamp {
    float: right;
    width: 80px;
    height: 80px;
    cursor: pointer;
    display: inline-block;
    padding: 10px;
    background: white;
    text-align:center;
    -webkit-filter: drop-shadow(-5px -5px 10px rgba(0,0,0,0.1));
    background: radial-gradient(
      transparent 0px,
      transparent 4px,
      white 4px,
      white
    );
    background-size: 20px 20px;
    background-position: -10px -10px;
    transition: 0.5s transform ease;
    z-index: 1;
  }
  .stamp:hover {
    transform: translate(-10px, 10px);
  }
  .stamp:after {
    content: '';
    position: absolute;
    /*We can shrink the pseudo element here to hide the shadow edges*/
    left: 5px; top: 5px; right: 5px; bottom: 5px;
    z-index: -1;
  }

  .stamp:before {
    position: absolute;
    bottom: 0; left: 0;
    font: bold 24px arial;
    color: white;
    opacity: 0.75;
    line-height: 100%;
    padding: 20px;
  }

  .stamp__content {
    @apply bg-white w-full h-full text-slate-400 flex flex-col justify-between;
    background-image: url('../assets/image_stamp.png');
    background-size: cover;
  }
</style>