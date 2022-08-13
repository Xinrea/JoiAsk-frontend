<script>
  import LikeIcon from "./LikeIcon.svelte";
  import { router } from "tinro";
  import FullCarousel from "../components/FullCarousel.svelte";
  import moment from "moment";
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
  let liked = false;
  let hasImage = data.images != "";
  function like() {
    fetch(`/api/question/${data.id}/like`, {
      method: "PUT",
    }).then((res) => {});
  }
  let imagePreview = false;
</script>

<div class="card__wrap" class:hasImage>
  <div
    class="card"
    class:rainbow={data.is_rainbow}
    class:archive={data.is_archived}
  >
    <div class="card__front">
      <div class="card__content" class:hide={data.is_hide}>
        {data.content}
      </div>
      <div class="card__footer">
        <div class="card__footer__id">#{data.id}</div>
        <div
          class="card__footer__tag"
          on:click={() => router.goto("/tags?tag=" + data.tag_id)}
        >
          #{data.tag.tag_name}
        </div>
        <div
          class="card__footer__likes"
          on:click={() => {
            liked = !liked;
            liked ? data.likes++ : data.likes--;
            like();
          }}
        >
          <LikeIcon {liked} />
          <div class="card__footer__likes__num">{data.likes}</div>
        </div>
      </div>
      <div class="card__footer__time">
        {moment(data.created_at).format("YYYY/MM/DD HH:mm")}{data.is_archive
          ? " | 已归档"
          : ""}
      </div>
    </div>
  </div>
  {#if hasImage}
    <div class="pic_indicator" on:click={() => (imagePreview = true)}>
      <div class="indicator__content">附图</div>
    </div>
  {/if}
</div>
{#if imagePreview}
  <FullCarousel
    exit={() => {
      imagePreview = false;
    }}
    images={data.images.split(";").map((u) => {
      return {
        src: u,
      };
    })}
  />
{/if}

<style>
  div {
    display: flex;
  }
  .card__wrap {
    width: 600px;
    position: relative;
    margin: 30px 0;
    flex-direction: column;
  }
  .card {
    position: relative;
    flex-direction: column;
    border: 1px solid #e6510024;
    border-radius: 6px;
    background-color: #ffa726;
    transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
    z-index: 2;
  }

  .card.archive {
    background-color: #ffcc80;
  }

  @media (max-width: 740px) {
    .card__wrap.hasImage {
      margin: 90px 0 30px 0;
      width: 90%;
    }
    .card__wrap {
      width: 90%;
    }
    .pic_indicator {
      transform: rotateZ(-90deg) !important;
      top: -20px !important;
      left: 0;
    }
    .pic_indicator:hover {
      top: -40px !important;
    }
  }

  .card:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.219);
  }

  .rainbow {
    background-image: linear-gradient(
      130deg,
      #dc5de783 0%,
      #7fefbd8e 33%,
      #fff5898c 66%,
      #ec0b4398 100%
    );
    background-color: #f8ddb4;
  }

  .pic_indicator {
    position: absolute;
    top: 10px;
    right: -50px;
    cursor: pointer;
    align-items: center;
    justify-content: flex-end;
    padding: 0 10px;
    width: 100px;
    height: 40px;
    color: white;
    background-color: #e65100;
    border: 1px solid #e6510024;
    border-left: none;
    border-radius: 0 5px 5px 0;
    transition: all 0.2s ease-in-out;
    z-index: 1;
  }

  .pic_indicator:hover {
    right: -70px;
  }

  .card__front {
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  .card__content {
    line-height: normal;
    position: relative;
    white-space: pre-wrap;
    word-break: break-word;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: white;
    margin: 20px 20px 0 20px;
    padding: 30px;
    border-radius: 10px;
    transition: all 2s ease-in-out;
  }

  .card__content.hide {
    opacity: 0;
  }

  .card__content.hide:hover {
    opacity: 1;
  }

  .card__footer {
    color: white;
    position: relative;
    padding: 20px 0;
    margin: 0 20px;
    align-items: center;
    justify-content: center;
  }
  .card__footer__tag {
    cursor: pointer;
  }
  .card__footer__id {
    position: absolute;
    left: 0;
  }
  .card__footer__time {
    margin-top: -10px;
    margin-bottom: 10px;
    color: rgba(255, 255, 255, 0.822);
    font-size: small;
    align-items: center;
    justify-content: center;
  }
  .card__footer__likes {
    position: absolute;
    right: 0;
    cursor: pointer;
    align-items: center;
    justify-content: end;
  }
  .card__footer__likes__num {
    margin-left: 5px;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background-color: #ffffff;
    border: 1px solid orange;
    border-radius: 100px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: orange;
    border-radius: 100px;
  }
</style>
