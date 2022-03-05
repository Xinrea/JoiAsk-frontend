<script>
  import {
    TextArea,
    TextInput,
    Button,
    Header,
    Form,
    FormGroup,
    HeaderUtilities,
    HeaderPanelLinks,
    HeaderPanelLink,
    HeaderAction,
    SkipToContent,
    PasswordInput,
    Modal,
    Content,
    DataTable,
    Checkbox,
    Pagination,
    Tabs,
    Tab,
    TabContent,
    Select,
    SelectItem,
    Toolbar,
    ToolbarContent,
    ImageLoader,
    Tag,
    Grid,
    Row,
    Column
  } from 'carbon-components-svelte'
  import moment from 'moment'
  import './white.css'
  let announcement = ''
  let loggedIn = false
  let loginInfo = {
    username: '',
    password: ''
  }
  let deleteModel = {
    toDelete: 0,
    open: false
  }
  let tags = []
  let tableData = []
  let pagination = {
    _pageSize: 20,
    _page: 1,
    total_length: 30,
    get pageSize() {
      return this._pageSize
    },
    set pageSize(val) {
      if (this._pageSize !== val) {
        this._pageSize = val
        getQuestions()
      }
    },
    get page() {
      return this._page
    },
    set page(val) {
      if (this._page !== val) {
        this._page = val
        getQuestions()
      }
    }
  }
  let tableSortStatus = {
    key: 'id',
    value: 'desc'
  }
  let tagFilter = 0
  function orderChange(key, value) {
    if (value === 'none') {
      tableSortStatus = {
        key: 'id',
        value: 'desc'
      }
    } else {
      if (value == 'descending') {
        tableSortStatus = {
          key: key,
          value: 'desc'
        }
      } else {
        tableSortStatus = {
          key: key,
          value: 'asc'
        }
      }
    }
    getQuestions()
  }

  function getTableConfig() {
    let body = {
      pagination: pagination,
      order: tableSortStatus,
      tag: parseInt(tagFilter)
    }
    console.log(JSON.stringify(body))
    return JSON.stringify(body)
  }
  let tableSortOrder = []
  tableSortOrder.add = function (field) {
    if (this.indexOf(field) === -1) {
      this.push(field)
    }
  }
  tableSortOrder.remove = function (field) {
    let index = this.indexOf(field)
    if (index !== -1) {
      this.splice(index, 1)
    }
  }
  let model = {
    open: false,
    message: ''
  }
  function showModel(message) {
    model.open = true
    model.message = message
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
  function getQuestions() {
    fetch('ENDPOINT/auth/questions', {
      credentials: 'include',
      method: 'POST',
      body: getTableConfig()
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res.code === 0) {
          tableData = res.data.questions
          pagination.total_length = res.data.total
          res.data.questions.forEach((e) => {
            tagCache[e.id] = e.tag_name
          })
        }
      })
  }

  function getTags() {
    fetch('ENDPOINT/auth/tags', {
      credentials: 'include',
      method: 'GET'
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res.code === 0) {
          tags = [
            {
              tag_id: 0,
              tag_name: '全部'
            },
            ...res.data
          ]
        }
      })
  }
  function setConfig() {
    let data = new FormData()
    data.append('announcement', announcement)
    fetch('ENDPOINT/auth/config', {
      credentials: 'include',
      method: 'POST',
      body: data
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res.code === 0) {
          showModel('修改成功')
        } else if (res.code === 2) {
          loggedIn = false
          showModel('请先登录')
        }
      })
  }

  function deleteQuestion(id) {
    let data = new FormData()
    data.append('id', id)
    fetch('ENDPOINT/auth/questions', {
      credentials: 'include',
      method: 'DELETE',
      body: data
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res.code === 0) {
          showModel(res.message)
          // Refresh Data
          getQuestions()
        } else if (res.code === 2) {
          loggedIn = false
          showModel(res.message)
        } else {
          showModel(res.message)
        }
      })
  }

  function login() {
    let data = new FormData()
    data.append('username', loginInfo.username)
    data.append('password', loginInfo.password)
    fetch('ENDPOINT/login', {
      credentials: 'include',
      method: 'POST',
      body: data
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res.code === 0) {
          loggedIn = true
          getConfig()
          getQuestions()
          showModel(res.message)
        } else if (res.code === 1) {
          showModel(res.message)
        }
      })
  }

  function logout() {
    fetch('ENDPOINT/logout', {
      credentials: 'include',
      method: 'GET'
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 0) {
          loggedIn = false
          showModel(res.message)
        } else {
          showModel(res.message)
        }
      })
  }

  function auth() {
    fetch('ENDPOINT/auth/login', {
      credentials: 'include',
      method: 'GET'
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res.code === 0) {
          loggedIn = true
          getConfig()
          getTags()
          getQuestions()
        } else {
          loggedIn = false
        }
      })
  }
  auth()
  function checkChange(e, id, key) {
    fetch('ENDPOINT/auth/questions', {
      credentials: 'include',
      method: 'PUT',
      body: JSON.stringify({
        id: id,
        key: key,
        value: e.checked
      })
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code !== 0) {
          showModel(res.message)
        }
      })
  }
  let tagCache = {}
  function updateTag(id) {
    fetch('ENDPOINT/auth/questions', {
      credentials: 'include',
      method: 'PUT',
      body: JSON.stringify({
        id: id,
        key: '_tag',
        value: tagCache[id]
      })
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code !== 0) {
          showModel(res.message)
        } else {
          showModel('修改成功')
          tableData.forEach((e) => {
            if (e.id === id) {
              e.tag_name = tagCache[id]
            }
          })
        }
      })
  }
</script>

<Header company="JOIASK" platformName="提问箱管理后台">
  <svelte:fragment slot="skip-to-content">
    <SkipToContent />
  </svelte:fragment>
  <HeaderUtilities>
    <HeaderAction>
      <HeaderPanelLinks>
        <HeaderPanelLink href="/">回到提问箱</HeaderPanelLink>
        <HeaderPanelLink on:click={logout}>注销</HeaderPanelLink>
      </HeaderPanelLinks>
    </HeaderAction>
  </HeaderUtilities>
</Header>
<Content style="min-height:100%">
  {#if loggedIn}
    <Tabs>
      <Tab label="基础设置" />
      <Tab label="提问管理" />
      <svelte:fragment slot="content">
        <TabContent>
          <Form>
            <FormGroup>
              <TextArea
                labelText="公告"
                placeholder="输入公告..."
                bind:value={announcement}
              />
            </FormGroup>
            <Button on:click={setConfig}>保存</Button>
          </Form></TabContent
        >
        <TabContent>
          <Form>
            <FormGroup>
              <DataTable
                title="提问管理"
                description="在此处管理所有提问"
                sortable
                expandable
                size="medium"
                headers={[
                  {
                    key: 'id',
                    value: 'ID',
                    sort: false
                  },
                  {
                    key: 'tag_name',
                    value: '话题',
                    sort: false
                  },
                  {
                    key: 'content',
                    value: '内容',
                    sort: false
                  },
                  {
                    key: 'images_num',
                    value: '附图',
                    sort: (a, b) => {
                      return 1
                    }
                  },
                  {
                    key: 'is_hide',
                    value: '隐藏',
                    sort: (a, b) => {
                      return 1
                    }
                  },
                  {
                    key: 'is_rainbow',
                    value: '彩虹',
                    sort: (a, b) => {
                      return 1
                    }
                  },
                  {
                    key: 'is_archived',
                    value: '归档',
                    sort: (a, b) => {
                      return 1
                    }
                  },
                  {
                    key: 'is_published',
                    value: '公开',
                    sort: (a, b) => {
                      return 1
                    }
                  },
                  {
                    key: 'created_at',
                    value: '时间',
                    sort: (a, b) => {
                      return 1
                    }
                  }
                ]}
                rows={tableData}
                on:click:header={(e) => {
                  if (
                    [
                      'images_num',
                      'is_hide',
                      'is_rainbow',
                      'is_archived',
                      'is_published',
                      'created_at'
                    ].includes(e.detail.header.key)
                  ) {
                    orderChange(e.detail.header.key, e.detail.sortDirection)
                  }
                }}
              >
                <Toolbar>
                  <ToolbarContent>
                    <Select
                      style="margin-left:1rem"
                      inline
                      labelText="话题"
                      bind:selected={tagFilter}
                      on:change={getQuestions}
                    >
                      {#each tags as tag}
                        <SelectItem value={tag.tag_id} text={tag.tag_name} />
                      {/each}
                    </Select>
                  </ToolbarContent>
                </Toolbar>
                <svelte:fragment slot="expanded-row" let:row>
                  <Grid padding>
                    <Row>
                      <FormGroup legendText="话题">
                        <Row>
                          <TextInput
                            placeholder="输入话题"
                            hideLabel
                            size="sm"
                            bind:value={tagCache[row.id]}
                          />
                          <Button size="small" on:click={updateTag(row.id)}
                            >保存</Button
                          ></Row
                        >
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup legendText="内容">
                        <pre>{row.content}</pre>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup legendText="相关信息">
                        <Tag type="high-contrast">ID：{row.id}</Tag>
                        <Tag type="high-contrast">点赞数：{row.likes}</Tag>
                        <Tag type="high-contrast">图片数：{row.images_num}</Tag>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup legendText="附图">
                        {#each row.images.split(';') as image, i}
                          {#if image.length > 0}
                            <Column>
                              <ImageLoader
                                src={'OSS/' + encodeURI(image) + '-preview'}
                              />
                            </Column>
                          {/if}
                        {/each}
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup legendText="操作">
                        <Button
                          kind="danger"
                          on:click={() => {
                            deleteModel.toDelete = row.id
                            deleteModel.open = true
                          }}>删除该提问</Button
                        >
                      </FormGroup>
                    </Row>
                  </Grid>
                </svelte:fragment>
                <svelte:fragment slot="cell" let:row let:cell>
                  {#if cell.key.startsWith('is_')}
                    <Checkbox
                      checked={cell.value}
                      on:change={checkChange(this, row.id, cell.key)}
                    />
                  {:else if cell.key === 'created_at'}
                    {moment(cell.value).format('YYYY/MM/DD HH:mm')}
                  {:else if cell.key === 'content'}
                    {cell.value.length > 20
                      ? cell.value.substr(0, 20) + '...'
                      : cell.value}
                  {:else}
                    {cell.value}
                  {/if}
                </svelte:fragment>
              </DataTable>
              <Pagination
                bind:pageSize={pagination.pageSize}
                bind:page={pagination.page}
                totalItems={pagination.total_length}
                pageSizes={[10, 20, 50]}
              />
            </FormGroup>
          </Form></TabContent
        >
      </svelte:fragment>
    </Tabs>
  {:else}
    <h2>登录</h2>
    <TextInput bind:value={loginInfo.username} labelText="用户名" />
    <PasswordInput bind:value={loginInfo.password} labelText="密码" />
    <Button on:click={login}>登录</Button>
  {/if}
</Content>
<Modal passiveModal bind:open={model.open} modalHeading="提示" on:open on:close>
  <p>
    {model.message}
  </p>
</Modal>
<Modal
  danger
  bind:open={deleteModel.open}
  modalHeading="删除提问"
  primaryButtonText="删除"
  secondaryButtonText="取消"
  on:click:button--primary={() => {
    deleteModel.open = false
    deleteQuestion(deleteModel.toDelete)
  }}
  on:click:button--secondary={() => (deleteModel.open = false)}
>
  <p>是否要删除该提问？</p>
</Modal>

<style>
  @import 'white.css';
</style>
