<template>
    <Transition name="slide-fade">
      <div class="main-shortcuts" :style="{ height: content_height, paddingTop: from == 'super_slidebar' ? '20px' : '' }">
        <div class="main-shortcuts-top" v-if="!['super_slidebar'].includes(from)">
          <div style="display: inline-block; width: 95%">
            <div style="display: inline-block"><span style="font-weight: bold;font-size: 16px;color: #333333;">话术</span>
            </div>
            <div style="display: inline-block">
            </div>
          </div>
          <span style="position: absolute;right: 40px;cursor: pointer" class="piwik_ChatSplitToVerbal" @click="toScriptSet">
            <Tooltip content="话术设置">
              <i class=" custom custom-table-edit-columns"></i>
            </Tooltip>
          </span>
          <span style="position: absolute;right: 15px;cursor: pointer" @click="closeVerbal"><i
              class="custom custom-table-filter-tag-delete"></i></span>
        </div>
        <div class="short-cut-verbal-search">
          <el-input class="verbal-search" v-model="verbalSearch" @input="controlTooltip"
            @keyup.enter.native="searchVerbalList" :placeholder="$t('chat.serchHolder')">
            <i slot="suffix" class="el-input__icon el-icon-search fb-comment-search-verbal" @click="searchVerbalList"></i>
          </el-input>
          <span v-if="['super_slidebar'].includes(from)" style="margin-left: 12px;" class="piwik_ChatSplitToVerbal"
            @click="toScriptSet">
            <Tooltip :content="$t('portal_set.script_set')">
              <i size="14" class="custom custom-custom-script-set"></i>
            </Tooltip>
          </span>
        </div>
        <div class="main-shortcuts-block" :style="{ top: from == 'super_slidebar' ? '60px' : '120px' }" v-loading="refreshVerbal">
          <div style="overflow:auto;">
            <el-tree :data="verbalTree"  node-key="id"
              :default-expanded-keys="expandedIdList">
              <template #default="{ node, data }">
                <span v-if="data.type" style="flex: 1;width: 0;" @click="senVerMethod(data)">
                  <Tooltip :content="data.verbalContent">
                    <span style="height: 18px;line-height: 18px;display: inline-block;">{{ data.title }}</span>
                  </Tooltip>
                </span>
                <div v-else style="flex: 1;width: 0;height: 18px;line-height: 18px;color: #333333;"
                  v-text="data.title"></div>
              </template>
            </el-tree>
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script >
  import axios from 'axios';
  import { Tooltip, Input, Tree, Message as ElMessage, Loading, } from 'element-ui'
  export default {
    name: 'shortcuts',
    props: {
      controVerbalIcon: {},
      content_height: {
        type: String,
        default: '100%'
      },
      from: {
        type: String,
        default: ''
      },
      enterpriseId: {
        type: Number,
        default: 10110
      },
      userId: {
        type: String,
        default: ''
      },
      viewingSubWA: {
        type: Boolean,
        default: false
      },
      menu_list: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        refreshVerbal: false,
        verbalSort: 0, // 话术分类
        verbalSortListTemp: [],
        verbalSortList: [
          {
            id: 0,
            name: '全部'
          }
        ], // 话术分类列表
        currIndex: -1,
        verbalSearch: '', // 搜素话术
        isShowSearch: false,
        verbalList: [],
        verbalListTemp: [],
        verbalListTemp2: [],
        verbalTree: [],
        parentVerbal: [],
        childrenVerbal: [],
        expandedIdList: [] // 展开树节点的key的数组
      };
    },
    directives: {
      loading: Loading
    },
    components: {
      Tooltip: Tooltip,
      ElInput: Input,
      ElTree: Tree,
    },
    computed: {
      isContainsMenu(name) {
        return menu_list.some(item => item.path === name)
      },
    },
    methods: {
      senVerMethod(data) {
        const sendVerbalMsg = {
          content: data,
          type: this.controVerbalIcon
        };
        // console.log(data, 'sendVerbalMsg');
        // 如果是查看下属并且是侧边栏中调用 话术 则提示当前不允许发送话术
        if (this.viewingSubWA && this.$parent.$options._componentTag === "MoreConectmodel") {
          ElMessage({
            message: this.$t('whatsapp_manage.onlyCanSendTemplate'),
            type: 'warning',
          })
        }
        this.$emit('verbalSelected', sendVerbalMsg);
      },
      $t(langs) {
        return langs;
      },
      controlTooltip(val) {
        if (this.verbalSearch === '') {
          this.getVerbalClassify();
        }
      },
      closeVerbal() {
        this.$emit('letShortcutsShow', false);
      },
      switchView() {
        this.isShowSearch = true;
      },
      // 跳转到话术管理
      toScriptSet() {
        // 权限目录判断
        if (!this.isContainsMenu('script_set')) {
  
          ElMessage.error(this.$t('portal_set.error_haveNoPermissionScriptSet'))
          return false;
        }
  
        window.open(this.$rootRouter.resolve({
          name: 'script_set'
        }).href, '_blank');
      },
   
      // 获取话术
      getVerbalClassify() {
        this.refreshVerbal = true;
        axios({
          url: 'https://cnendtx.leadscloud.com/cuss-login/replyType/getReplyTypeList',
          method: 'get',
          params: {
            orgId: this.enterpriseId
          }
        }).then(res => {
          this.parentVerbal = res.data.data.list;
          axios({
            url: 'https://cnendtx.leadscloud.com/cuss-login/reply/getReplyList',
            method: 'get',
            params: {
              orgId: this.enterpriseId,
              typeId: 0,
              pageNo: 0,
              pageSize: 0
            }
          }).then(res => {
            this.childrenVerbal = res.data.data.list;
            this.verbalTree = this.get_tree(this.parentVerbal, this.childrenVerbal);
            this.refreshVerbal = false;
          });
        });
      },
      // 话术树按照sortNo排序
      sort_tree(val) {
        for (let i = 0; i < val.length; i++) {
          if (val[i].children) {
            val[i].children = this.sort_tree(val[i].children);
          }
        }
        val = val.sort((a, b) => {
          if (a.sortNo === b.sortNo) {
            if (a.name === '基本信息') {
              return -1;
            } else {
              return 0;
            }
          } else {
            if (a.sortNo > b.sortNo) {
              return 1;
            } else {
              return -1;
            }
          }
        });
        return val;
      },
      // 按照键值排序
      sortBy(property, sortType = 'asc') {
        return function (a, b) {
          const value1 = a[property];
          const value2 = b[property];
          return sortType === 'desc' ? value2 - value1 : value1 - value2;
        };
      },
      // 渲染树
      get_tree(param_arr, user_list, check_arr) {
        const userList = user_list.map(item => {
          const obj = {};
          obj.verbalContent = item.name;
          obj.parentId = item.typeId;
          obj.name = item.abbr;
          obj.power = item.manageName;
          obj.id = item.id;
          obj.createUserId = item.createUserId;
          obj.type = 'person';
          return obj;
        });
        const arr = param_arr.map(item => {
          const obj = {};
          obj.parentId = item.parentId;
          obj.name = item.name;
          obj.id = item.id;
          obj.verbalContent = '';
          obj.level = item.type;
          obj.sortNo = item.sortNo;
          return obj;
        });
        let parent_arr = [];
  
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].parentId === 0) {
            parent_arr.push(arr[i]);
            arr.splice(i, 1);
            i = i - 1;
          }
        }
  
        function structure_parent_arr(arr) {
          return arr.map(item => {
            const obj = {};
            obj.title = item.name;
            obj.id = item.id;
            obj.parentId = item.parentId;
            obj.children = [];
            obj.verbalContent = '';
            obj.level = item.type;
            obj.expand = true;
            obj.sortNo = item.sortNo;
            return obj;
          });
        }
  
        parent_arr = structure_parent_arr(parent_arr);
        parent_arr = this.sort_tree(parent_arr);
  
        // 默认展开一级树
        this.expandedIdList = parent_arr.map(item => {
          return item.id;
        });
  
        function build_child(parent_arr, arr) {
          for (let j = 0; j < parent_arr.length; j++) {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].parentId === parent_arr[j].id) {
                parent_arr[j].checked = false;
                const obj = {};
                obj.show_info = arr;
                obj.title = arr[i].name;
                obj.id = arr[i].id;
                obj.createUserId = arr[i].createUserId;
                obj.power = arr[i].power;
                obj.parentId = arr[i].parentId;
                obj.verbalContent = arr[i].verbalContent;
                obj.grandpa_id = parent_arr[j].parentId;
                obj.parent_name = parent_arr[j].title;
                if (arr[i].category === 1) {
                  obj.menu = 'department';
                } else {
                  obj.menu = 'person';
                }
                obj.type = arr[i].type;
                obj.disabled = false;
                obj.expand = true;
                obj.checked = arr[i].check;
                obj.children = [];
                parent_arr[j].children.push(obj);
                arr.splice(i, 1);
                i = i - 1;
              }
            }
          }
          if (arr.length) {
            for (const child_item of parent_arr) {
              if (child_item.children.length) {
                build_child(child_item.children, arr);
              }
            }
          }
  
          return parent_arr;
        }
  
        const new_arr = arr.concat(userList);
        return build_child(parent_arr, new_arr);
      },
      get_search_tree(param_arr, user_list, check_arr) {
        const _this = this;
        const userList = user_list.map(item => {
          const obj = {};
          obj.verbalContent = item.name;
          obj.parentId = item.typeId;
          obj.name = item.abbr;
          obj.power = item.manageName;
          obj.id = item.id;
          obj.createUserId = item.createUserId;
          obj.type = 'person';
          return obj;
        });
  
        const arr = param_arr.map(item => {
          const obj = {};
          obj.parentId = item.parentId;
          obj.name = item.name;
          obj.id = item.id;
          obj.verbalContent = '';
          obj.level = item.type;
          obj.sortNo = item.sortNo;
          return obj;
        });
        let parent_arr = [];
  
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].parentId === 0) {
            parent_arr.push(arr[i]);
            arr.splice(i, 1);
            i = i - 1;
          }
        }
  
        function structure_parent_arr(arr) {
          return arr.map(item => {
            const obj = {};
            obj.title = item.name;
            obj.id = item.id;
            obj.parentId = item.parentId;
            obj.children = [];
            obj.verbalContent = '';
            obj.level = item.type;
            obj.expand = true;
            // 追加id
            _this.expandedIdList.push(item.id);
            obj.sortNo = item.sortNo;
            return obj;
          });
        }
  
        parent_arr = structure_parent_arr(parent_arr);
  
        function build_child(parent_arr, arr) {
          for (let j = 0; j < parent_arr.length; j++) {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].parentId === parent_arr[j].id) {
                parent_arr[j].checked = false;
                const obj = {};
                obj.show_info = arr;
                obj.title = arr[i].name;
                obj.id = arr[i].id;
                obj.createUserId = arr[i].createUserId;
                obj.power = arr[i].power;
                obj.parentId = arr[i].parentId;
                obj.verbalContent = arr[i].verbalContent;
                obj.grandpa_id = parent_arr[j].parentId;
                obj.parent_name = parent_arr[j].title;
                if (arr[i].category === 1) {
                  obj.menu = 'department';
                } else {
                  obj.menu = 'person';
                }
                obj.type = arr[i].type;
                obj.disabled = false;
                obj.expand = true;
                // 追加id
                _this.expandedIdList.push(arr[i].id);
                obj.checked = arr[i].check;
                obj.children = [];
                parent_arr[j].children.push(obj);
                arr.splice(i, 1);
                i = i - 1;
              }
            }
          }
          if (arr.length) {
            for (const child_item of parent_arr) {
              if (child_item.children.length) {
                build_child(child_item.children, arr);
              }
            }
          }
  
          return parent_arr;
        }
  
        const new_arr = arr.concat(userList);
        return build_child(parent_arr, new_arr);
      },
      getVerbalTree() {
        this.verbalTree = this.get_tree(this.parentVerbal, this.childrenVerbal);
        console.log('--------', this.verbalTree)
      },
      // 话术搜索
      searchVerbalList() {
        // 当搜索内容为空时不执行后续代码
        if (this.verbalSearch === '') {
          return;
        }
        const str_searched = this.verbalSearch || ''; // 要搜索的文字
        const temp_tree_data = this.get_search_tree(this.parentVerbal, this.childrenVerbal, []); // 全量 tree_data
        function search_title_recursively(nodes, str_searched) {
          return nodes.map(node => {
            if (node.title.includes(str_searched) || node.verbalContent.includes(str_searched)) {
              return node;
            } else if (node.children.length) {
              node.children = search_title_recursively(node.children, str_searched);
              if (node.children.length) {
                return node;
              } else {
                return undefined;
              }
            } else {
              return undefined;
            }
          }).filter(item => item);
        }
  
        const tree_data = search_title_recursively(temp_tree_data, str_searched);
        this.verbalTree = tree_data;
      }
    },
    created() {
      // 获取话术分类
      console.log('加载话术组件');
      this.getVerbalClassify();
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .piwik_ChatSplitToVerbal:hover {
    .custom-custom-script-set {
      color: #4285F4;
    }
  }
  
  .short-cut-verbal-search {
    padding: 0 20px;
    display: flex;
  
    .ivu-input-wrapper .ivu-input {
      border-radius: 16px;
    }
  }
  
  .main-shortcuts {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: #ffffff;
  
    &-top {
      height: 30px;
      line-height: 30px;
      margin: 20px;
    }
  
    &-block {
      position: absolute;
      top: 120px;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: auto;
    }
  
    &-list {
      cursor: pointer;
      color: rgba(0, 0, 0, 0.80);
      padding: 10px 20px;
      box-shadow: inset 0 -1px 0 0 #F5F5F5;
  
      &:hover {
        color: #FA8241;
      }
    }
  
    &-list-active {
      color: #FA8241;
    }
  }
  
  .main-shortcuts-block {
    padding: 0 20px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.80);
  }
  </style>
  