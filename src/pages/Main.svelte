<script>
  import Navbar from "../components/Navbar.svelte";
  import Select from "svelte-select";
  import autosize from "autosize";
  import Hashtag from "../components/Hashtag.svelte";
  import TopButton from "../components/TopButton.svelte";
  import PostCard from "../components/PostCard.svelte";
  import Toggle from "../components/Toggle.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  let askContent = "";
  let items = [];

  let tagValue;
  let checkedHide = false;
  let checkedRainbow = false;
  let checkedImage = false;
  let submitInfo = false;
  let isUploading = false;
  export let loggedIn = false;

  $: previewCard = {
    id: 0,
    created_at: new Date(),
    updated_at: new Date(),
    tag_id: tagValue ? tagValue.value.id : 0,
    tag: tagValue ? tagValue.value : {},
    content: "[卡片预览]\n" + askContent,
    images_num: 0,
    images: "",
    is_rainbow: checkedRainbow,
    emojis: [],
  };

  let announcement = "";
  onMount(() => {
    askContent = localStorage.getItem("ask_content") || "";
    autosize(document.querySelector("textarea"));
    initTagSelection();
    getConfig();
  });

  function contentChange(e) {
    localStorage.setItem("ask_content", e.target.value);
  }

  // FilePond
  import FilePond, { registerPlugin } from "svelte-filepond";
  import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
  import FilePondPluginImagePreview from "filepond-plugin-image-preview";
  import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
  import "filepond/dist/filepond.min.css";
  import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType
  );
  let pond;
  let name = "filepond";

  // Filter params
  const Order = {
    ASC: "asc",
    DESC: "desc",
  };
  const OrderItems = [
    { label: "从新到旧", value: Order.DESC },
    { label: "从旧到新", value: Order.ASC },
  ];
  let filter = {
    hideArchive: false,
    order: OrderItems[0],
  };

  // Cards Fetch
  import InfiniteLoading from "svelte-infinite-loading";
  let cards = [];
  let page = 1;
  function fetchCards({ detail: { loaded, complete } }) {
    fetch(
      `/api/question?page=${page}&size=5&publish=true&order_by=id&order=${filter.order.value}${filter.hideArchive ? "&archive=false" : ""}`
    )
      .then((res) => res.json())
      .then((res) => {
        cards = cards.concat(res.data.questions);
        page++;
        if (res.data.questions.length < 5) {
          complete();
        } else {
          loaded();
        }
      });
  }
  function initTagSelection() {
    fetch(`/api/tag`)
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          // reverse the order except the first one
          res.data = [res.data[0], ...res.data.slice(1).reverse()];
          items = res.data.map((item) => {
            return { value: item, label: item.tag_name };
          });
        }
      });
  }
  function submitQuestion() {
    // Check Content
    let postContent = askContent.replace(/^\s+|\s+$/g, "");
    // Replace full-width {}
    postContent = postContent.replaceAll("｛", "{").replaceAll("｝", "}");
    if (postContent.length === 0) {
      alert("请输入有效的提问内容");
      return;
    }
    let data = new FormData();
    if (tagValue) {
      data.append("tag_id", tagValue.value.id);
    } else {
      alert("请选择话题");
      return;
    }
    data.append("content", postContent);
    if (checkedHide) {
      data.append("hide", "true");
    }
    if (checkedRainbow) {
      data.append("rainbow", "true");
    }
    if (checkedImage) {
      let fs = pond.getFiles();
      for (let i = 0; i < fs.length; i++) {
        data.append("files[]", fs[i].file);
      }
    }

    isUploading = true;
    fetch(`/api/question`, {
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        if (res.status === 413) {
          alert("图片太大，请缩小图片体积或者分开投稿");
          isUploading = false;
          throw "size of images is exceed the limit";
        }
        alert("投稿出现错误，Code: ", res.status);
        throw "submit failed";
      })
      .then((res) => {
        if (res.code === 200) {
          submitInfo = true;
          askContent = "";
          localStorage.setItem("ask_content", "");
          tagValue = null;
          checkedRainbow = false;
          checkedImage = false;
          setTimeout(() => {
            submitInfo = false;
          }, 4000);
        } else {
          alert(res.message);
        }
        isUploading = false;
      });
  }
  function getConfig() {
    fetch("/api/config", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          announcement = res.data.announcement;
        }
      });
  }
  // handle to process image list for local preview
  function handlePreview() {
    let fs = pond.getFiles();
    previewCard.images_num = fs.length;
    previewCard.images = fs
      .map((f) => {
        return URL.createObjectURL(new Blob([f.file], { type: f.file.type }));
      })
      .join(";");
    console.log(previewCard.images);
  }
  // Image preview
  function handleImagePreview(event) {
    console.log("image triggered");
    const url = event.detail.url;
    console.log(url);
  }
</script>

<Navbar current="提问" />
<TopButton />
<div class="infinite-container flex flex-col w-full">
  <div class="card_list">
    <div class="ask max-w-[600px] w-5/6 relative">
      <div class="tag_select">
        <div class="themed">
          <Select
            id="topic"
            Icon={Hashtag}
            {items}
            bind:value={tagValue}
            noOptionsMessage="没有相应的话题"
            placeholder="选择话题"
          />
        </div>
        {#if tagValue}
          <pre>{tagValue.value.description}</pre>
        {/if}
      </div>
      <div class="ask__content" class:rainbow={checkedRainbow}>
        <textarea
          id="content"
          class="ask__textarea p-4 text-slate-500 min-h-[128px]"
          maxlength="800"
          bind:value={askContent}
          class:rainbow={checkedRainbow}
          on:input={contentChange}
        />
      </div>
      <div class="checks">
        <div class="announcement">
          <pre>{announcement}</pre>
        </div>
        <div class="allchecks">
          <label>
            <input type="checkbox" bind:checked={checkedRainbow} />
            彩虹屁
          </label>
          <label>
            <input type="checkbox" bind:checked={checkedImage} />
            附图
          </label>
        </div>
      </div>
      {#if checkedImage}
        <FilePond
          bind:this={pond}
          {name}
          allowMultiple={true}
          credits={false}
          labelIdle="拖拽/点击添加图片(最多6张)"
          acceptedFileTypes={["image/*"]}
          maxFiles={6}
          maxFileSize={1048576}
          onaddfile={handlePreview}
          onremovefile={handlePreview}
        />
      {/if}
      {#if isUploading}
        <button class="ask__submit disabled"> 上传中，请稍等 </button>
      {:else}
        <button class="ask__submit" on:click={submitQuestion}> 提交 </button>
      {/if}
      {#if submitInfo}
        <div
          class="absolute top-0 left-0 right-0 bottom-0 flex bg-orange-50 text-slate-500 text-center items-center justify-center z-10"
          transition:fade
        >
          提问已提交审核，内容将会在审核通过后放出
        </div>
      {/if}
    </div>
    {#if askContent.length > 0 && tagValue}
      <PostCard data={previewCard} login={false} />
    {/if}
    <div class="themed max-w-[600px] w-5/6 flex justify-between order-select">
      <Toggle
        label="隐藏归档卡片"
        bind:value={filter.hideArchive}
        on:change={() => {
          page = 1;
          cards = [];
        }}
      />
      <Select
        items={OrderItems}
        bind:value={filter.order}
        isClearable={false}
        on:select={() => {
          page = 1;
          cards = [];
        }}
        isSearchable={false}
      ></Select>
    </div>
    {#each cards as card}
      <PostCard data={card} login={loggedIn} on:message={handleImagePreview} />
    {/each}
  </div>
  <InfiniteLoading on:infinite={fetchCards} identifier={filter}>
    <div class="info" slot="noMore">已经到底啦( ´･･)ﾉ(._.`)</div>
    <div class="info" slot="noResults">已经到底啦( ´･･)ﾉ(._.`)</div>
  </InfiniteLoading>
</div>

<style>
  div {
    display: flex;
  }

  .info {
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
  }
  .announcement {
    padding: 5px 0;
  }
  .rainbow textarea {
    background: linear-gradient(
      130deg,
      rgba(220, 93, 231, 0.33) 0%,
      rgba(127, 239, 189, 0.33) 33%,
      rgba(255, 245, 137, 0.33) 66%,
      rgba(236, 11, 67, 0.33) 100%
    );
  }

  .tag_select {
    @apply flex flex-col mb-[10px] text-primary;
  }

  .themed {
    @apply block w-[140px] mb-[10px] text-primary;
    font-size: 12px;
    --height: 30px;
    --inputFontSize: 12px;
    --itemFontSize: 12px;
    --background: theme("colors.primary / 10%");
    --borderRadius: 30px;
    --selectedItemPadding: 0 10px 0 8px;
    --inputPadding: 0 0 0 40px;
    --clearSelectColor: theme("colors.primary / 10%");
    --clearSelectFocusColor: theme("colors.primary");
    --clearSelectHoverColor: theme("colors.primary");
    --clearSelectTop: 5px;
    --clearSelectBottom: 5px;
    --clearSelectWidth: 20px;
    --inputColor: theme("colors.primary");
    --itemColor: theme("colors.primary");
    --itemActiveBackground: theme("colors.primary");
    --itemIsActiveBG: theme("colors.primary");
    --itemIsActiveColor: rgb(255, 255, 255);
    --itemHoverBG: theme("colors.primary / 10%");
    --placeholderColor: theme("colors.primary");
    --indicatorColor: theme("colors.primary");
    --border: none;
    z-index: 9;
  }

  .order-select {
    --background: white;
    --indicatorTop: 5px;
    --indicatorRight: 5px;
    --selectedItemPadding: 0 10px 0 0;
  }

  .ask {
    position: relative;
    margin: 30px 0;
    padding: 20px;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 6px;
    background-color: white;
    transition: all 0.4s ease-in-out;
  }

  .ask__content {
    position: relative;
  }
  .ask__textarea {
    position: relative;
    font-family: 宋体, Fangsong, STFangsong, sans-serif;
    resize: none;
    word-break: break-word;
    text-align: left;
    background-color: theme("colors.primary / 10%");
    border: none;
    border-radius: 10px;
    width: 100%;
  }
  .ask__textarea:focus {
    background-color: white;
    outline: 1px solid theme("colors.primary");
  }
  .checks {
    font-size: small;
    margin: 16px 0;
    color: rgb(0, 0, 0);
    justify-content: space-between;
  }
  .allchecks {
    @apply flex flex-col justify-start items-start text-primary;
  }
  label {
    font-size: small;
    cursor: pointer;
    align-items: center;
    justify-content: space-between;
    display: flex;
    word-break: keep-all;
    margin-bottom: 3px;
  }
  input[type="checkbox"] {
    cursor: pointer;
    /* Add if not using autoprefixer */
    -webkit-appearance: none;
    appearance: none;
    /* For iOS < 15 to remove gradient background */
    background-color: #fff;
    border: 2px solid theme("colors.primary");
    /* Not removed via appearance */
    margin-right: 5px;
    font: inherit;
    color: theme("colors.primary");
    width: 1.4em;
    height: 1.4em;
    border-radius: 0.15em;
    display: grid;
    place-content: center;
  }

  input[type="checkbox"]::before {
    content: "";
    width: 0.8em;
    height: 0.8em;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em theme("colors.primary");
  }

  input[type="checkbox"]:checked::before {
    transform: scale(1);
  }

  button {
    @apply bg-primary/75;
    cursor: pointer;
    border: 1px solid rgba(128, 128, 128, 0.315);
    border-radius: 5px;
    padding: 5px 0;
    color: white;
    font-size: medium;
  }
  button:hover {
    @apply bg-primary;
  }

  button:disabled {
    @apply bg-primary/50;
    cursor: not-allowed;
  }
  .card_list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  pre {
    @apply text-primary;
    font-size: small;
    line-height: normal;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
