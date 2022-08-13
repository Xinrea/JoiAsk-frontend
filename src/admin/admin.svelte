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
    Column,
  } from "carbon-components-svelte";
  import Edit from "carbon-icons-svelte/lib/Edit.svelte";
  import Add from "carbon-icons-svelte/lib/Add.svelte";
  import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
  import moment from "moment";
  import md5 from "md5";
  let announcement = "";
  let loggedIn = false;
  let loginInfo = {
    username: "",
    password: "",
  };
  let deleteModel = {
    toDelete: 0,
    open: false,
  };
  let tags = {
    tagFilterOptions: [],
    tagFilterSelect: 0,
    tagOptions: [],
    tagMap: {},
  };
  let questionCache = {};
  let tableData = [];
  let pagination = {
    _pageSize: 20,
    _page: 1,
    total_length: 30,
    get pageSize() {
      return this._pageSize;
    },
    set pageSize(val) {
      if (this._pageSize !== val) {
        this._pageSize = val;
        getQuestions();
      }
    },
    get page() {
      return this._page;
    },
    set page(val) {
      if (this._page !== val) {
        this._page = val;
        getQuestions();
      }
    },
  };
  let tableSortStatus = {
    key: "id",
    value: "desc",
  };

  function orderChange(key, value) {
    if (value === "none") {
      tableSortStatus = {
        key: "id",
        value: "desc",
      };
    } else {
      if (value == "descending") {
        tableSortStatus = {
          key: key,
          value: "desc",
        };
      } else {
        tableSortStatus = {
          key: key,
          value: "asc",
        };
      }
    }
    getQuestions();
  }

  let tableSortOrder = [];
  tableSortOrder.add = function (field) {
    if (this.indexOf(field) === -1) {
      this.push(field);
    }
  };
  tableSortOrder.remove = function (field) {
    let index = this.indexOf(field);
    if (index !== -1) {
      this.splice(index, 1);
    }
  };
  let model = {
    open: false,
    message: "",
  };
  function showModel(message) {
    model.open = true;
    model.message = message;
  }
  function getConfig() {
    fetch("/api/config", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.code === 200) {
          announcement = res.data.announcement;
        }
      });
  }
  function getQuestions() {
    fetch(
      `/api/question?page=${pagination.page}&page_size=${pagination.pageSize}&order_by=${tableSortStatus.key}&order=${tableSortStatus.value}&tag_id=${tags.tagFilterSelect}`,
      {
        credentials: "include",
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.code === 200) {
          tableData = res.data.questions;
          pagination._page = res.data.page;
          pagination._pageSize = res.data.page_size;
          pagination.total_length = res.data.total;
          res.data.questions.map((item) => {
            questionCache[item.id] = item;
          });
        }
      });
  }

  function getTags() {
    fetch("/api/tag", {
      credentials: "include",
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.code === 200) {
          tags.tagFilterOptions = [
            {
              tag_id: 0,
              tag_name: "全部",
            },
            ...res.data,
          ];
          tags.tagOptions = res.data;
          res.data.map((e) => {
            tags.tagMap[e.id] = e;
          });
        }
      });
  }
  function setConfig() {
    let data = {
      announcement: announcement,
    };
    console.log(data);
    fetch("/api/config", {
      credentials: "include",
      method: "PUT",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.code === 200) {
          showModel("修改成功");
        } else {
          showModel(res.message);
        }
      });
  }

  function deleteQuestion(id) {
    fetch(`/api/question/${id}`, {
      credentials: "include",
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.code === 200) {
          // Refresh Data
          getQuestions();
        } else {
          showModel(res.message);
        }
      });
  }

  function deleteTag(id) {
    fetch(`/api/tag/${id}`, {
      credentials: "include",
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.code === 200) {
          // Refresh Data
          getTags();
        } else {
          showModel(res.message);
        }
      });
  }

  function login() {
    let data = {
      username: loginInfo.username,
      password: md5(loginInfo.password),
    };
    fetch("/api/login", {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.code === 200) {
          loggedIn = true;
          getConfig();
          getQuestions();
        } else if (res.code === 200) {
          showModel(res.message);
        }
      });
  }

  // Acount related
  let users = [];
  let userModel = {
    open: false,
    title: "",
    user: {
      id: 0,
      username: "",
      password: "",
    },
  };
  function getUsers() {
    fetch("/api/user", {
      credentials: "include",
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          users = res.data;
        }
      });
  }
  function addUser(user) {
    let body = JSON.stringify({
      username: user.username,
      password: md5(user.password),
    });
    fetch("/api/user", {
      credentials: "include",
      method: "POST",
      body: body,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          getUsers();
        } else {
          showModel(res.message);
        }
      });
  }
  function saveUser(user) {
    let body = JSON.stringify({
      username: user.username,
      password: md5(user.password),
    });
    fetch(`/api/user/${user.id}`, {
      credentials: "include",
      method: "PUT",
      body: body,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          getUsers();
        } else {
          showModel(res.message);
        }
      });
  }
  function deleteUser(id) {
    fetch(`/api/user/${id}`, {
      credentials: "include",
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          getUsers();
        } else {
          showModel(res.message);
        }
      });
  }

  getUsers();

  function logout() {
    fetch("/api/logout", {
      credentials: "include",
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          loggedIn = false;
        } else {
          showModel(res.message);
        }
      });
  }

  function auth() {
    fetch("/api/info", {
      credentials: "include",
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.code === 200) {
          loggedIn = true;
          getConfig();
          getTags();
          getQuestions();
        } else {
          loggedIn = false;
        }
      });
  }
  auth();

  function updateQuestion(id) {
    let body = JSON.stringify({
      tag_id: questionCache[id].tag_id,
      is_hide: questionCache[id].is_hide,
      is_rainbow: questionCache[id].is_rainbow,
      is_archive: questionCache[id].is_archive,
      is_publish: questionCache[id].is_publish,
    });
    console.log(questionCache[id]);
    console.log(body);
    fetch(`/api/question/${id}`, {
      credentials: "include",
      method: "PUT",
      body: body,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code !== 200) {
          showModel(res.message);
        } else {
          getQuestions();
        }
      });
  }

  let addTagModel = {
    open: false,
    tag: {},
  };
  let editTagModel = {
    open: false,
    tag: {},
  };

  function saveTag(tag) {
    let body = JSON.stringify({
      tag_name: tag.tag_name,
      description: tag.description,
    });
    fetch(`/api/tag/${tag.id}`, {
      credentials: "include",
      method: "PUT",
      body: body,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code !== 200) {
          showModel(res.message);
        } else {
          getTags();
        }
      });
  }

  function addTag(tag) {
    let body = JSON.stringify({
      tag_name: tag.tag_name,
      description: tag.description,
    });
    fetch(`/api/tag`, {
      credentials: "include",
      method: "POST",
      body: body,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code !== 200) {
          showModel(res.message);
        } else {
          getTags();
        }
      });
  }
</script>

<div id="admin-wrapper" style="background-color: white; height: 100%;">
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
        <Tab label="话题管理" />
        <Tab label="账号管理" />
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
                      key: "id",
                      value: "ID",
                      sort: false,
                    },
                    {
                      key: "tag.tag_name",
                      value: "话题",
                      sort: false,
                    },
                    {
                      key: "content",
                      value: "内容",
                      sort: false,
                    },
                    {
                      key: "images_num",
                      value: "附图",
                      sort: (a, b) => {
                        return 1;
                      },
                    },
                    {
                      key: "is_hide",
                      value: "隐藏",
                      sort: (a, b) => {
                        return 1;
                      },
                    },
                    {
                      key: "is_rainbow",
                      value: "彩虹",
                      sort: (a, b) => {
                        return 1;
                      },
                    },
                    {
                      key: "is_archive",
                      value: "归档",
                      sort: (a, b) => {
                        return 1;
                      },
                    },
                    {
                      key: "is_publish",
                      value: "公开",
                      sort: (a, b) => {
                        return 1;
                      },
                    },
                    {
                      key: "created_at",
                      value: "时间",
                      sort: (a, b) => {
                        return 1;
                      },
                    },
                  ]}
                  rows={tableData}
                  on:click:header={(e) => {
                    if (
                      [
                        "images_num",
                        "is_hide",
                        "is_rainbow",
                        "is_archive",
                        "is_publish",
                        "created_at",
                      ].includes(e.detail.header.key)
                    ) {
                      orderChange(e.detail.header.key, e.detail.sortDirection);
                    }
                  }}
                >
                  <Toolbar>
                    <ToolbarContent>
                      <Select
                        style="margin-left:1rem"
                        inline
                        labelText="话题"
                        bind:selected={tags.tagFilterSelect}
                        on:change={getQuestions}
                      >
                        {#each tags.tagFilterOptions as tag}
                          <SelectItem value={tag.id} text={tag.tag_name} />
                        {/each}
                      </Select>
                    </ToolbarContent>
                  </Toolbar>
                  <svelte:fragment slot="cell" let:row let:cell>
                    {#if cell.key === "created_at"}
                      <div>{moment(cell.value).format("llll")}</div>
                    {:else if cell.key.startsWith("is")}
                      <Checkbox
                        checked={cell.value}
                        on:change={(e) => {
                          switch (cell.key) {
                            case "is_hide":
                              questionCache[row.id].is_hide = e.target.checked;
                              break;
                            case "is_rainbow":
                              questionCache[row.id].is_rainbow =
                                e.target.checked;
                              break;
                            case "is_archive":
                              questionCache[row.id].is_archive =
                                e.target.checked;
                              break;
                            case "is_publish":
                              questionCache[row.id].is_publish =
                                e.target.checked;
                              break;
                            default:
                              break;
                          }
                          updateQuestion(row.id);
                        }}
                      />
                    {:else}
                      <div>{cell.value}</div>
                    {/if}
                  </svelte:fragment>
                  <svelte:fragment slot="expanded-row" let:row>
                    <Grid padding>
                      <Row>
                        <FormGroup legendText="话题">
                          <Row>
                            <Select
                              hideLabel
                              size="sm"
                              selected={row.tag_id}
                              on:change={(e) => {
                                let newID = parseInt(e.detail);
                                questionCache[row.id].tag_id = newID;
                                questionCache[row.id].tag = tags.tagMap[newID];
                              }}
                            >
                              {#each tags.tagOptions as tag}
                                <SelectItem
                                  value={tag.id}
                                  text={tag.tag_name}
                                />
                              {/each}
                            </Select>
                            <Button
                              size="small"
                              on:click={updateQuestion(row.id)}>保存</Button
                            >
                          </Row>
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup legendText="内容">
                          <pre class="preview">{row.content}</pre>
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup legendText="相关信息">
                          <Tag type="high-contrast">ID：{row.id}</Tag>
                          <Tag type="high-contrast">点赞数：{row.likes}</Tag>
                          <Tag type="high-contrast"
                            >图片数：{row.images_num}</Tag
                          >
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup legendText="附图">
                          {#each row.images.split(";") as image, i}
                            {#if image.length > 0}
                              <Column>
                                <ImageLoader src={encodeURI(image)} />
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
                              deleteModel.toDelete = row.id;
                              deleteModel.open = true;
                            }}>删除该提问</Button
                          >
                        </FormGroup>
                      </Row>
                    </Grid>
                  </svelte:fragment>
                </DataTable>
                <Pagination
                  bind:pageSize={pagination.pageSize}
                  bind:page={pagination.page}
                  totalItems={pagination.total_length}
                  pageSizes={[10, 20, 50]}
                />
              </FormGroup>
            </Form>
          </TabContent>
          <TabContent>
            <FormGroup>
              <DataTable
                headers={[
                  { key: "id", value: "ID" },
                  { key: "tag_name", value: "话题名" },
                  { key: "description", value: "描述" },
                  { key: "question_count", value: "投稿数量" },
                  { key: "created_at", value: "创建时间" },
                  { key: "operation", value: "操作" },
                ]}
                rows={tags.tagOptions}
              >
                <svelte:fragment slot="cell" let:row let:cell>
                  {#if cell.key === "created_at"}
                    <div>{moment(cell.value).format("llll")}</div>
                  {:else if cell.key === "operation"}
                    <div>
                      <Button
                        tooltipPosition="left"
                        tooltipAlignment="end"
                        iconDescription="编辑话题"
                        icon={Edit}
                        on:click={() => {
                          editTagModel.tag = row;
                          editTagModel.open = true;
                        }}
                      />
                      <Button
                        tooltipPosition="right"
                        tooltipAlignment="end"
                        iconDescription="删除话题"
                        kind="danger"
                        icon={TrashCan}
                        on:click={deleteTag(row.id)}
                      />
                    </div>
                  {:else}
                    <div>{cell.value}</div>
                  {/if}
                </svelte:fragment>
              </DataTable>
            </FormGroup>
            <Button
              icon={Add}
              on:click={() => {
                addTagModel.tag = {
                  tag_name: "",
                  description: "",
                };
                addTagModel.open = true;
              }}>添加话题</Button
            >
          </TabContent>
          <TabContent>
            <FormGroup>
              <DataTable
                headers={[
                  { key: "id", value: "ID" },
                  { key: "username", value: "用户名" },
                  { key: "created_at", value: "创建时间" },
                  { key: "updated_at", value: "更新时间" },
                  { key: "operation", value: "操作" },
                ]}
                rows={users}
              >
                <svelte:fragment slot="cell" let:row let:cell>
                  {#if cell.key === "created_at"}
                    <div>{moment(cell.value).format("llll")}</div>
                  {:else if cell.key === "updated_at"}
                    <div>{moment(cell.value).format("llll")}</div>
                  {:else if cell.key === "operation"}
                    <div>
                      <Button
                        tooltipPosition="left"
                        tooltipAlignment="end"
                        iconDescription="编辑用户"
                        icon={Edit}
                        on:click={() => {
                          userModel.title = "编辑用户";
                          userModel.user = row;
                          userModel.open = true;
                        }}
                      />
                      <Button
                        tooltipPosition="right"
                        tooltipAlignment="end"
                        iconDescription="删除用户"
                        kind="danger"
                        icon={TrashCan}
                        on:click={deleteUser(row.id)}
                      />
                    </div>
                  {:else}
                    <div>{cell.value}</div>
                  {/if}
                </svelte:fragment>
              </DataTable>
            </FormGroup>
            <Button
              icon={Add}
              on:click={() => {
                userModel.title = "添加用户";
                userModel.user = {
                  username: "",
                  password: "",
                };
                userModel.open = true;
              }}>添加用户</Button
            >
          </TabContent>
        </svelte:fragment>
      </Tabs>
    {:else}
      <h2>登录</h2>
      <TextInput bind:value={loginInfo.username} labelText="用户名" />
      <PasswordInput bind:value={loginInfo.password} labelText="密码" />
      <Button on:click={login}>登录</Button>
    {/if}
  </Content>
  <Modal
    passiveModal
    bind:open={model.open}
    modalHeading="提示"
    on:open
    on:close
  >
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
      deleteModel.open = false;
      deleteQuestion(deleteModel.toDelete);
    }}
    on:click:button--secondary={() => (deleteModel.open = false)}
  >
    <p>是否要删除该提问？</p>
  </Modal>
  <Modal
    bind:open={addTagModel.open}
    modalHeading="添加提问"
    primaryButtonText="添加"
    secondaryButtonText="取消"
    on:click:button--primary={() => {
      addTagModel.open = false;
      addTag(addTagModel.tag);
    }}
    on:click:button--secondary={() => (addTagModel.open = false)}
  >
    <Form>
      <TextInput
        bind:value={addTagModel.tag.tag_name}
        labelText="话题名"
        required
      />
      <TextInput
        bind:value={addTagModel.tag.description}
        labelText="描述"
        required
      />
    </Form>
  </Modal>
  <Modal
    bind:open={editTagModel.open}
    modalHeading="修改提问"
    primaryButtonText="保存"
    secondaryButtonText="取消"
    on:click:button--primary={() => {
      editTagModel.open = false;
      saveTag(editTagModel.tag);
    }}
    on:click:button--secondary={() => (editTagModel.open = false)}
  >
    <Form>
      <TextInput
        bind:value={editTagModel.tag.tag_name}
        labelText="话题名"
        required
      />
      <TextInput
        bind:value={editTagModel.tag.description}
        labelText="描述"
        required
      />
    </Form>
  </Modal>
  <Modal
    bind:open={userModel.open}
    modalHeading={userModel.title}
    primaryButtonText="保存"
    secondaryButtonText="取消"
    on:click:button--primary={() => {
      if (userModel.user.id) {
        console.log("update");
        saveUser(userModel.user);
      } else {
        console.log("add");
        addUser(userModel.user);
      }
      userModel.open = false;
    }}
    on:click:button--secondary={() => (userModel.open = false)}
  >
    <Form>
      <TextInput
        bind:value={userModel.user.username}
        labelText="用户名"
        required
      />
      <PasswordInput
        bind:value={userModel.user.password}
        labelText="密码"
        required
      />
    </Form>
  </Modal>
</div>

<style>
  .preview {
    word-break: break-word;
    white-space: break-spaces;
    line-height: normal;
  }
</style>
