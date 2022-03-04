<script>
  import Navbar from '../components/Navbar.svelte'
  import Select from 'svelte-select'
  import autosize from 'autosize'
  import Hashtag from '../components/Hashtag.svelte'
  import TopButton from '../components/TopButton.svelte'
  import Card from '../components/Card.svelte'
  import { onMount } from 'svelte'
  let askContent = ''
  let items = [{ value: '轴问箱', label: '轴问箱' }]

  let tagValue
  let checkedHide = false
  let checkedRainbow = false
  let checkedImage = false

  let announcement = ''
  onMount(() => {
    autosize(document.querySelector('textarea'))
    initTagSelection()
    getConfig()
  })

  // FilePond
  import FilePond, { registerPlugin, supported } from 'svelte-filepond'
  import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
  import 'filepond/dist/filepond.min.css'
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType
  )
  let pond
  let name = 'filepond'

  // Cards Fetch
  import InfiniteLoading from 'svelte-infinite-loading'
  let cards = []
  let page = 1
  function fetchCards({ detail: { loaded, complete } }) {
    fetch(`ENDPOINT/questions?page=${page}&size=5`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        cards = cards.concat(res.data)
        page++
        if (res.data.length < 5) {
          complete()
        } else {
          loaded()
        }
      })
  }
  function initTagSelection() {
    fetch(`ENDPOINT/tags`)
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 0) {
          res.data.reverse()
          items = res.data.map((item) => {
            return { value: item.tag_name, label: item.tag_name }
          })
        }
      })
  }
  function submitQuestion() {
    // Check Content
    let postContent = askContent.replace(/^\s+|\s+$/g, '')
    if (postContent.length === 0) {
      alert('请输入有效的提问内容')
      return
    }
    let data = new FormData()
    console.log(tagValue)
    if (tagValue) {
      data.append('tag', tagValue.value)
    } else {
      data.append('tag', '轴问箱')
    }
    data.append('content', postContent)
    if (checkedHide) {
      data.append('hide', 'true')
    }
    if (checkedRainbow) {
      data.append('rainbow', 'true')
    }
    if (checkedImage) {
      let fs = pond.getFiles()
      for (let i = 0; i < fs.length; i++) {
        data.append('files[]', fs[i].file)
      }
    }
    fetch(`ENDPOINT/questions`, {
      method: 'POST',
      body: data
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 0) {
          alert('问题提交成功')
          window.location.reload()
        } else {
          alert(res.message)
        }
      })
  }
  function getConfig() {
    fetch('ENDPOINT/config', {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res.code === 0) {
          announcement = res.data.announcement
        }
      })
  }
</script>

<Navbar current="提问" />
<TopButton />
<div class="container">
  <div class="card_list">
    <div class="ask">
      <div class="ask__content" class:rainbow={checkedRainbow}>
        <div class="themed">
          <Select
            id="topic"
            Icon={Hashtag}
            {items}
            bind:value={tagValue}
            placeholder="输入/选择话题"
            isCreatable
            getOptionLabel={(option, filterText) => {
              return option.isCreator
                ? `新话题 \"${filterText}\"`
                : option.label
            }}
          />
        </div>
        <textarea
          id="content"
          class="ask__textarea"
          bind:value={askContent}
          class:rainbow={checkedRainbow}
        />
      </div>
      <div class="checks">
        <div class="announcement">
          <pre>{announcement}</pre>
        </div>
        <div class="allchecks">
          <label>
            <input type="checkbox" bind:checked={checkedHide} />
            隐藏
          </label>
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
          acceptedFileTypes={['image/*']}
          maxFiles={6}
        />
      {/if}
      <button class="ask__submit" on:click={submitQuestion}>提交</button>
    </div>
    {#each cards as card}
      <Card data={card} />
    {/each}
  </div>
  <InfiniteLoading on:infinite={fetchCards}>
    <div class="info" slot="noMore">🍊已经到底啦🍊</div>
  </InfiniteLoading>
</div>

<style>
  div {
    display: flex;
  }
  .announcement {
    align-items: center;
    font-size: small;
  }
  .rainbow textarea {
    background: linear-gradient(
      130deg,
      #dc5de783 0%,
      #7fefbd8e 33%,
      #fff5898c 66%,
      #ec0b4398 100%
    );
  }

  .rainbow .themed {
    --background: rgba(252, 252, 252, 0.719);
  }

  .themed {
    position: absolute;
    top: 10px;
    left: 10px;
    display: block;
    width: 140px;
    font-size: 12px;
    color: #ff9800;
    --height: 30px;
    --inputFontSize: 12px;
    --itemFontSize: 12px;
    --background: rgba(255, 166, 0, 0.116);
    --borderRadius: 30px;
    --selectedItemPadding: 0 10px 0 8px;
    --inputPadding: 0 0 0 40px;
    --clearSelectColor: rgba(255, 166, 0, 0.603);
    --clearSelectFocusColor: orange;
    --clearSelectHoverColor: orange;
    --clearSelectTop: 5px;
    --clearSelectBottom: 5px;
    --clearSelectWidth: 20px;
    --inputColor: orange;
    --itemColor: orange;
    --itemActiveBackground: orange;
    --itemIsActiveBG: orange;
    --itemIsActiveColor: rgb(255, 255, 255);
    --itemHoverBG: rgba(255, 166, 0, 0.178);
    --placeholderColor: orange;
    --indicatorColor: orange;
    --border: none;
    z-index: 9;
  }

  .container {
    padding: 20px 0;
    display: block;
  }
  .ask {
    position: relative;
    margin: 30px 0;
    padding: 20px;
    width: 600px;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 6px;
    background-color: white;
    transition: all 0.4s ease-in-out;
  }
  @media (max-width: 740px) {
    .ask {
      width: 90%;
    }
  }
  .ask__content {
    position: relative;
  }
  .ask__textarea {
    position: relative;
    font-family: Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
      'WenQuanYi Micro Hei', sans-serif;
    font-size: medium;
    resize: none;
    word-break: break-word;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: #fdf7eb;
    border: none;
    border-radius: 10px;
    padding: 50px 30px 30px 30px;
    width: 100%;
  }
  .ask__textarea:focus {
    background-color: white;
    outline: 1px solid orange;
  }
  .checks {
    font-size: small;
    margin: 16px 0;
    color: rgb(0, 0, 0);
    justify-content: space-between;
  }
  .allchecks {
    flex-direction: column;
    justify-content: start;
    align-items: flex-start;
  }
  label {
    cursor: pointer;
    align-items: center;
    justify-content: space-between;
    display: flex;
    word-break: keep-all;
  }
  input[type='checkbox'] {
    cursor: pointer;
    /* Add if not using autoprefixer */
    -webkit-appearance: none;
    appearance: none;
    /* For iOS < 15 to remove gradient background */
    background-color: #fff;
    border: 2px solid #ffb74d;
    /* Not removed via appearance */
    margin-right: 5px;
    font: inherit;
    color: orange;
    width: 1.15em;
    height: 1.15em;
    border-radius: 0.15em;
    display: grid;
    place-content: center;
  }

  input[type='checkbox']::before {
    content: '';
    width: 0.65em;
    height: 0.65em;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em #ffb74d;
  }

  input[type='checkbox']:checked::before {
    transform: scale(1);
  }

  button {
    cursor: pointer;
    border: 1px solid rgba(128, 128, 128, 0.315);
    border-radius: 5px;
    padding: 5px 0;
    color: white;
    font-size: medium;
    background-color: #ff9800;
  }
  button:hover {
    background-color: #ffa726;
  }
  .card_list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
