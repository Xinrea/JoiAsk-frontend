<script>
  import { router } from "tinro";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
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
  const maxDegree = 30;
  let liked = false;
  let cardContentElement;
  let imageList = [];
  let scrollEnd = false;
  onMount(() => {
    scrollEnd =
      cardContentElement.scrollTop + cardContentElement.clientHeight >=
      cardContentElement.scrollHeight;
  });
  function imagePreview(url) {
    window.callPreview(url);
  }
  function postTime() {
    let postTimestamp = new Date(data.created_at) / 1000;
    let unit = "秒";
    let time = Math.floor(Date.now() / 1000 - postTimestamp);
    if (time > 60) {
      time = Math.floor(time / 60);
      unit = "分钟";
      if (time > 60) {
        time = Math.floor(time / 60);
        unit = "小时";
        if (time > 24) {
          // show full formatted time
          return new Date(postTimestamp * 1000).toLocaleString().split(" ")[0];
        }
      }
    }
    return time + unit + " 前";
  }

  let x = 0;
  let y = 0;
  let rx = 0;
  let ry = 0;
  let px = "50%";
  let py = "50%";
  let d = 0;
  let hyp = 0.03;
  let rect;
  let mouseMoveToTransform = (e) => {
    rect = e.currentTarget.getBoundingClientRect();
    x = e.clientX - rect.left; //x position within the element.
    y = e.clientY - rect.top; //y position within the element.
    let w = rect.width;
    let h = rect.height;
    px = (x / w) * 100 + "%";
    py = (y / h) * 100 + "%";
    rx = -((x / w) * maxDegree - maxDegree / 2) + "deg";
    ry = (y / h) * maxDegree - maxDegree / 2 + "deg";
    hyp =
      Math.sqrt(Math.pow(x - w / 2, 2) + Math.pow(y - h / 2, 2)) /
      Math.sqrt(Math.pow(w / 2, 2) + Math.pow(h / 2, 2));

    // Calculate param for rainbow effect
    let dx = x - w / 2;
    let dy = y - h / 2;
    d =
      (Math.atan(dy / dx) * 180) / Math.PI +
      (Math.sqrt(dx * dx + dy * dy) / Math.sqrt(w * w + h * h)) * 180 +
      "deg";
  };

  let recoverInterval;
  let mouseMoveOut = (e) => {
    recoverInterval = setInterval(() => {
      let _rx = parseFloat(rx);
      let _ry = parseFloat(ry);
      let _d = parseFloat(d);
      let complete = true;
      if (_rx > 0) {
        rx = Math.max(_rx - 1, 0) + "deg";
        complete = false;
      } else if (_rx < 0) {
        rx = Math.min(_rx + 1, 0) + "deg";
        complete = false;
      }
      if (_ry > 0) {
        ry = Math.max(_ry - 1, 0) + "deg";
        complete = false;
      } else if (_ry < 0) {
        ry = Math.min(_ry + 1, 0) + "deg";
        complete = false;
      }
      if (_d > 0) {
        d = Math.max(_d - 1, 0) + "deg";
        complete = false;
      } else if (_d < 0) {
        d = Math.min(_d + 1, 0) + "deg";
        complete = false;
      }
      if (hyp > 0.03) {
        hyp = Math.max(hyp - 0.01, 0.03);
        complete = false;
      } else if (hyp < 0.03) {
        hyp = Math.min(hyp + 0.01, 0.03);
        complete = false;
      }
      if (complete) {
        clearInterval(recoverInterval);
      }
    }, 16);
  };

  let mouseMoveIn = (e) => {
    clearInterval(recoverInterval);
  };

  let handleCardMouseMove = (e) => {
    mouseMoveToTransform(e);
  };

  let like = () => {
    fetch(`/api/question/${data.id}/like`, {
      method: "PUT",
    });
  };

  function handleScroll(e) {
    scrollEnd =
      e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight;
  }
</script>

<div
  class="flex flex-row w-full overflow-x-auto overflow-y-visible p-6"
  class:justify-center={imageList.length === 0}
>
  <div
    class="card-wrap relative rotatable rounded-md overflow-hidden w-5/6 min-h-[300px] min-w-[283px] md:h-[346px] md:w-[600px]"
    style="--x: {x}; --y: {y}; --rx: {rx}; --ry: {ry}; --d: {d}; --hyp: {hyp}; --px:{px}; --py:{py}"
    on:mousemove={handleCardMouseMove}
    on:mouseleave={mouseMoveOut}
    on:mouseenter={mouseMoveIn}
  >
    <div class="card h-full w-full" class:special={data.is_rainbow}>
      <div
        class="watermark cursor-pointer"
        on:click={() =>
          router.goto(
            "/tags?tag=" + data.tag_id + "&tag_name=" + data.tag.tag_name
          )}
      >
        #{data.tag.tag_name}
      </div>
      <div class="card-header">{postTime()}</div>
      <div
        class="card-content"
        class:more={!scrollEnd}
        bind:this={cardContentElement}
        on:scroll={handleScroll}
      >
        <div>
          {#if data.images_num > 0}
            <div
              class="stamp"
              on:click={() => {
                if (imageList.length === 0) {
                  imageList = data.images.split(";");
                } else {
                  imageList = [];
                }
              }}
            >
              <div class="stamp__content" />
            </div>
          {/if}
          {data.content}
          {#if data.is_archive}
            <div
              class="watermark archived pointer-events-none"
              style="--watermark-color: red; transform: rotate(10deg) scale(1.2); top: 70%; left: 20%;"
            >
              已归档
            </div>
          {/if}
        </div>
      </div>
      <div class="card-footer">
        #{data.id}
        <span
          class="cursor-pointer"
          on:click={() => {
            liked = !liked;
            liked ? data.likes++ : data.likes--;
            like();
          }}>👍{data.likes}</span
        >
      </div>
    </div>
    {#if data.is_rainbow}
      <div class="texture-illusion" />
      <div class="texture-noise" />
    {/if}
  </div>
  <div class="flex flex-row flex-nowrap overflow-y-visible">
    {#each imageList as image}
      <div class="min-w-[200px]  ml-3 last:mx-3">
        <img
          src={image}
          class="rounded-md shadow-lg max-h-[346px] cursor-pointer"
          transition:fade
          alt=""
          on:click={() => {
            imagePreview(image);
          }}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .card {
    @apply bg-card shadow-lg p-4 text-slate-400 flex flex-col justify-between;
    content-visibility: auto;
  }

  @media (min-width: 720px) {
    .card-wrap {
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
    font-family: system-ui, Fangsong, STFangsong, serif;
    z-index: 3;
  }

  .card-content::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }

  .more {
    border-bottom: 2px dashed theme("colors.primary / 30%");
  }

  .rotatable {
    transform-origin: center;
    transform: perspective(1500px) rotateX(var(--ry)) rotateY(var(--rx));
    transform-style: preserve-3d;
  }

  .watermark {
    position: absolute;
    top: 20px;
    right: 6px;
    font-family: system-ui;
    color: theme("colors.primary / 30%");
    box-shadow: 0 0 0 3px theme("colors.primary / 30%"),
      0 0 0 2px theme("colors.primary / 30%") inset;
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
    box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.4),
      0 0 0 2px rgba(255, 0, 0, 0.4) inset;
  }

  .stamp {
    float: right;
    width: 80px;
    height: 80px;
    cursor: pointer;
    padding: 10px;
    background: white;
    text-align: center;
    -webkit-filter: drop-shadow(-5px -5px 10px rgba(0, 0, 0, 0.1));
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
    content: "";
    position: absolute;
    /*We can shrink the pseudo element here to hide the shadow edges*/
    left: 5px;
    top: 5px;
    right: 5px;
    bottom: 5px;
    z-index: -1;
  }

  .stamp:before {
    position: absolute;
    bottom: 0;
    left: 0;
    font: bold 24px arial;
    color: white;
    opacity: 0.75;
    line-height: 100%;
    padding: 20px;
  }

  .stamp__content {
    @apply bg-white w-full h-full text-slate-400 flex flex-col justify-between;
    background-image: url("../assets/image_stamp.png");
    background-size: cover;
  }

  .special {
    background-image: linear-gradient(
      133deg,
      rgba(220, 93, 231, 0.3) 0%,
      rgba(127, 239, 189, 0.3) 33%,
      rgba(255, 245, 137, 0.3) 66%,
      rgba(236, 11, 67, 0.3) 100%
    );
  }

  .texture-noise {
    @apply absolute w-full h-full top-0 left-0 pointer-events-none;
    background-image: url("../assets/texture.svg");
    mix-blend-mode: color-dodge;
    opacity: 0.3;
  }

  .texture-illusion {
    @apply absolute w-full h-full top-0 left-0 pointer-events-none;
    background-image: url("../assets/vmaxbg.jpg"),
      repeating-linear-gradient(
        0deg,
        rgb(255, 119, 115) 5%,
        rgba(255, 237, 95, 1) 10%,
        rgba(168, 255, 95, 1) 15%,
        rgba(131, 255, 247, 1) 20%,
        rgba(120, 148, 255, 1) 25%,
        rgb(216, 117, 255) 30%,
        rgb(255, 119, 115) 35%
      ),
      repeating-linear-gradient(
        133deg,
        #0e152e 0%,
        hsl(180, 10%, 60%) 7.6%,
        hsl(180, 29%, 66%) 9%,
        hsl(180, 10%, 60%) 10.4%,
        #0e152e 20%,
        #0e152e 24%
      ),
      radial-gradient(
        farthest-corner circle at var(--px) var(--py),
        rgba(0, 0, 0, 0.1) 12%,
        rgba(0, 0, 0, 0.15) 20%,
        rgba(0, 0, 0, 0.25) 120%
      );
    background-position: center, 0% var(--py), var(--px) var(--py),
      var(--px) var(--py);
    filter: brightness(calc((var(--hyp) * 0.3) + 0.3)) contrast(2) saturate(1.5);
    background-blend-mode: exclusion, hue, hard-light;
    background-size: 50%;
    mix-blend-mode: color-dodge;
    opacity: 0.5;
  }
</style>
