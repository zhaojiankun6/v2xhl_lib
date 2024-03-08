import axios from 'axios';
import { Loading, Tooltip, Input, Tree, Message } from 'element-ui';
import { n as normalizeComponent, c as createInjector } from '../../browser-wYLHMB88.js';

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

  var script = {
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
          Message({
            message: this.$t('whatsapp_manage.onlyCanSendTemplate'),
            type: 'warning',
          });
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
  
          Message.error(this.$t('portal_set.error_haveNoPermissionScriptSet'));
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
        console.log('--------', this.verbalTree);
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

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("Transition", { attrs: { name: "slide-fade" } }, [
    _c(
      "div",
      {
        staticClass: "main-shortcuts",
        style: {
          height: _vm.content_height,
          paddingTop: _vm.from == "super_slidebar" ? "20px" : "",
        },
      },
      [
        !["super_slidebar"].includes(_vm.from)
          ? _c("div", { staticClass: "main-shortcuts-top" }, [
              _c(
                "div",
                { staticStyle: { display: "inline-block", width: "95%" } },
                [
                  _c("div", { staticStyle: { display: "inline-block" } }, [
                    _c(
                      "span",
                      {
                        staticStyle: {
                          "font-weight": "bold",
                          "font-size": "16px",
                          color: "#333333",
                        },
                      },
                      [_vm._v("话术")]
                    ),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticStyle: { display: "inline-block" } }),
                ]
              ),
              _vm._v(" "),
              _c(
                "span",
                {
                  staticClass: "piwik_ChatSplitToVerbal",
                  staticStyle: {
                    position: "absolute",
                    right: "40px",
                    cursor: "pointer",
                  },
                  on: { click: _vm.toScriptSet },
                },
                [
                  _c("Tooltip", { attrs: { content: "话术设置" } }, [
                    _c("i", {
                      staticClass: "custom custom-table-edit-columns",
                    }),
                  ]),
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "span",
                {
                  staticStyle: {
                    position: "absolute",
                    right: "15px",
                    cursor: "pointer",
                  },
                  on: { click: _vm.closeVerbal },
                },
                [
                  _c("i", {
                    staticClass: "custom custom-table-filter-tag-delete",
                  }),
                ]
              ),
            ])
          : _vm._e(),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "short-cut-verbal-search" },
          [
            _c(
              "el-input",
              {
                staticClass: "verbal-search",
                attrs: { placeholder: _vm.$t("chat.serchHolder") },
                on: { input: _vm.controlTooltip },
                nativeOn: {
                  keyup: function ($event) {
                    if (
                      !$event.type.indexOf("key") &&
                      _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                    ) {
                      return null
                    }
                    return _vm.searchVerbalList.apply(null, arguments)
                  },
                },
                model: {
                  value: _vm.verbalSearch,
                  callback: function ($$v) {
                    _vm.verbalSearch = $$v;
                  },
                  expression: "verbalSearch",
                },
              },
              [
                _c("i", {
                  staticClass:
                    "el-input__icon el-icon-search fb-comment-search-verbal",
                  attrs: { slot: "suffix" },
                  on: { click: _vm.searchVerbalList },
                  slot: "suffix",
                }),
              ]
            ),
            _vm._v(" "),
            ["super_slidebar"].includes(_vm.from)
              ? _c(
                  "span",
                  {
                    staticClass: "piwik_ChatSplitToVerbal",
                    staticStyle: { "margin-left": "12px" },
                    on: { click: _vm.toScriptSet },
                  },
                  [
                    _c(
                      "Tooltip",
                      { attrs: { content: _vm.$t("portal_set.script_set") } },
                      [
                        _c("i", {
                          staticClass: "custom custom-custom-script-set",
                          attrs: { size: "14" },
                        }),
                      ]
                    ),
                  ],
                  1
                )
              : _vm._e(),
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            directives: [
              {
                name: "loading",
                rawName: "v-loading",
                value: _vm.refreshVerbal,
                expression: "refreshVerbal",
              },
            ],
            staticClass: "main-shortcuts-block",
            style: { top: _vm.from == "super_slidebar" ? "60px" : "120px" },
          },
          [
            _c(
              "div",
              { staticStyle: { overflow: "auto" } },
              [
                _c("el-tree", {
                  attrs: {
                    data: _vm.verbalTree,
                    "node-key": "id",
                    "default-expanded-keys": _vm.expandedIdList,
                  },
                  scopedSlots: _vm._u([
                    {
                      key: "default",
                      fn: function (ref) {
                        ref.node;
                        var data = ref.data;
                        return [
                          data.type
                            ? _c(
                                "span",
                                {
                                  staticStyle: { flex: "1", width: "0" },
                                  on: {
                                    click: function ($event) {
                                      return _vm.senVerMethod(data)
                                    },
                                  },
                                },
                                [
                                  _c(
                                    "Tooltip",
                                    { attrs: { content: data.verbalContent } },
                                    [
                                      _c(
                                        "span",
                                        {
                                          staticStyle: {
                                            height: "18px",
                                            "line-height": "18px",
                                            display: "inline-block",
                                          },
                                        },
                                        [_vm._v(_vm._s(data.title))]
                                      ),
                                    ]
                                  ),
                                ],
                                1
                              )
                            : _c("div", {
                                staticStyle: {
                                  flex: "1",
                                  width: "0",
                                  height: "18px",
                                  "line-height": "18px",
                                  color: "#333333",
                                },
                                domProps: { textContent: _vm._s(data.title) },
                              }),
                        ]
                      },
                    },
                  ]),
                }),
              ],
              1
            ),
          ]
        ),
      ]
    ),
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-1d4e2008_0", { source: ".piwik_ChatSplitToVerbal:hover .custom-custom-script-set[data-v-1d4e2008] {\n  color: #4285F4;\n}\n.short-cut-verbal-search[data-v-1d4e2008] {\n  padding: 0 20px;\n  display: flex;\n}\n.short-cut-verbal-search .ivu-input-wrapper .ivu-input[data-v-1d4e2008] {\n  border-radius: 16px;\n}\n.main-shortcuts[data-v-1d4e2008] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 99;\n  background-color: #ffffff;\n}\n.main-shortcuts-top[data-v-1d4e2008] {\n  height: 30px;\n  line-height: 30px;\n  margin: 20px;\n}\n.main-shortcuts-block[data-v-1d4e2008] {\n  position: absolute;\n  top: 120px;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  overflow-y: auto;\n}\n.main-shortcuts-list[data-v-1d4e2008] {\n  cursor: pointer;\n  color: rgba(0, 0, 0, 0.8);\n  padding: 10px 20px;\n  box-shadow: inset 0 -1px 0 0 #F5F5F5;\n}\n.main-shortcuts-list[data-v-1d4e2008]:hover {\n  color: #FA8241;\n}\n.main-shortcuts-list-active[data-v-1d4e2008] {\n  color: #FA8241;\n}\n.main-shortcuts-block[data-v-1d4e2008] {\n  padding: 0 20px;\n  font-family: PingFangSC-Regular;\n  font-size: 12px;\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/*# sourceMappingURL=shortcuts.vue.map */", map: {"version":3,"sources":["/Users/zhaojiankun/Desktop/code/code/xhl_libv2/src/components/shortcuts/shortcuts.vue","shortcuts.vue"],"names":[],"mappings":"AAidA;EACA,cAAA;AChdA;ADodA;EACA,eAAA;EACA,aAAA;ACjdA;ADmdA;EACA,mBAAA;ACjdA;ADqdA;EACA,kBAAA;EACA,MAAA;EACA,OAAA;EACA,QAAA;EACA,SAAA;EACA,WAAA;EACA,yBAAA;ACldA;ADodA;EACA,YAAA;EACA,iBAAA;EACA,YAAA;ACldA;ADqdA;EACA,kBAAA;EACA,UAAA;EACA,OAAA;EACA,QAAA;EACA,SAAA;EACA,gBAAA;ACndA;ADsdA;EACA,eAAA;EACA,yBAAA;EACA,kBAAA;EACA,oCAAA;ACpdA;ADsdA;EACA,cAAA;ACpdA;ADwdA;EACA,cAAA;ACtdA;AD0dA;EACA,eAAA;EACA,+BAAA;EACA,eAAA;EACA,yBAAA;ACvdA;;AAEA,wCAAwC","file":"shortcuts.vue","sourcesContent":["<template>\r\n    <Transition name=\"slide-fade\">\r\n      <div class=\"main-shortcuts\" :style=\"{ height: content_height, paddingTop: from == 'super_slidebar' ? '20px' : '' }\">\r\n        <div class=\"main-shortcuts-top\" v-if=\"!['super_slidebar'].includes(from)\">\r\n          <div style=\"display: inline-block; width: 95%\">\r\n            <div style=\"display: inline-block\"><span style=\"font-weight: bold;font-size: 16px;color: #333333;\">话术</span>\r\n            </div>\r\n            <div style=\"display: inline-block\">\r\n            </div>\r\n          </div>\r\n          <span style=\"position: absolute;right: 40px;cursor: pointer\" class=\"piwik_ChatSplitToVerbal\" @click=\"toScriptSet\">\r\n            <Tooltip content=\"话术设置\">\r\n              <i class=\" custom custom-table-edit-columns\"></i>\r\n            </Tooltip>\r\n          </span>\r\n          <span style=\"position: absolute;right: 15px;cursor: pointer\" @click=\"closeVerbal\"><i\r\n              class=\"custom custom-table-filter-tag-delete\"></i></span>\r\n        </div>\r\n        <div class=\"short-cut-verbal-search\">\r\n          <el-input class=\"verbal-search\" v-model=\"verbalSearch\" @input=\"controlTooltip\"\r\n            @keyup.enter.native=\"searchVerbalList\" :placeholder=\"$t('chat.serchHolder')\">\r\n            <i slot=\"suffix\" class=\"el-input__icon el-icon-search fb-comment-search-verbal\" @click=\"searchVerbalList\"></i>\r\n          </el-input>\r\n          <span v-if=\"['super_slidebar'].includes(from)\" style=\"margin-left: 12px;\" class=\"piwik_ChatSplitToVerbal\"\r\n            @click=\"toScriptSet\">\r\n            <Tooltip :content=\"$t('portal_set.script_set')\">\r\n              <i size=\"14\" class=\"custom custom-custom-script-set\"></i>\r\n            </Tooltip>\r\n          </span>\r\n        </div>\r\n        <div class=\"main-shortcuts-block\" :style=\"{ top: from == 'super_slidebar' ? '60px' : '120px' }\" v-loading=\"refreshVerbal\">\r\n          <div style=\"overflow:auto;\">\r\n            <el-tree :data=\"verbalTree\"  node-key=\"id\"\r\n              :default-expanded-keys=\"expandedIdList\">\r\n              <template #default=\"{ node, data }\">\r\n                <span v-if=\"data.type\" style=\"flex: 1;width: 0;\" @click=\"senVerMethod(data)\">\r\n                  <Tooltip :content=\"data.verbalContent\">\r\n                    <span style=\"height: 18px;line-height: 18px;display: inline-block;\">{{ data.title }}</span>\r\n                  </Tooltip>\r\n                </span>\r\n                <div v-else style=\"flex: 1;width: 0;height: 18px;line-height: 18px;color: #333333;\"\r\n                  v-text=\"data.title\"></div>\r\n              </template>\r\n            </el-tree>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </Transition>\r\n  </template>\r\n  \r\n  <script >\r\n  import axios from 'axios';\r\n  import { Tooltip, Input, Tree, Message as ElMessage, Loading, } from 'element-ui'\r\n  export default {\r\n    name: 'shortcuts',\r\n    props: {\r\n      controVerbalIcon: {},\r\n      content_height: {\r\n        type: String,\r\n        default: '100%'\r\n      },\r\n      from: {\r\n        type: String,\r\n        default: ''\r\n      },\r\n      enterpriseId: {\r\n        type: Number,\r\n        default: 10110\r\n      },\r\n      userId: {\r\n        type: String,\r\n        default: ''\r\n      },\r\n      viewingSubWA: {\r\n        type: Boolean,\r\n        default: false\r\n      },\r\n      menu_list: {\r\n        type: Array,\r\n        default: []\r\n      }\r\n    },\r\n    data() {\r\n      return {\r\n        refreshVerbal: false,\r\n        verbalSort: 0, // 话术分类\r\n        verbalSortListTemp: [],\r\n        verbalSortList: [\r\n          {\r\n            id: 0,\r\n            name: '全部'\r\n          }\r\n        ], // 话术分类列表\r\n        currIndex: -1,\r\n        verbalSearch: '', // 搜素话术\r\n        isShowSearch: false,\r\n        verbalList: [],\r\n        verbalListTemp: [],\r\n        verbalListTemp2: [],\r\n        verbalTree: [],\r\n        parentVerbal: [],\r\n        childrenVerbal: [],\r\n        expandedIdList: [] // 展开树节点的key的数组\r\n      };\r\n    },\r\n    directives: {\r\n      loading: Loading\r\n    },\r\n    components: {\r\n      Tooltip: Tooltip,\r\n      ElInput: Input,\r\n      ElTree: Tree,\r\n    },\r\n    computed: {\r\n      isContainsMenu(name) {\r\n        return menu_list.some(item => item.path === name)\r\n      },\r\n    },\r\n    methods: {\r\n      senVerMethod(data) {\r\n        const sendVerbalMsg = {\r\n          content: data,\r\n          type: this.controVerbalIcon\r\n        };\r\n        // console.log(data, 'sendVerbalMsg');\r\n        // 如果是查看下属并且是侧边栏中调用 话术 则提示当前不允许发送话术\r\n        if (this.viewingSubWA && this.$parent.$options._componentTag === \"MoreConectmodel\") {\r\n          ElMessage({\r\n            message: this.$t('whatsapp_manage.onlyCanSendTemplate'),\r\n            type: 'warning',\r\n          })\r\n        }\r\n        this.$emit('verbalSelected', sendVerbalMsg);\r\n      },\r\n      $t(langs) {\r\n        return langs;\r\n      },\r\n      controlTooltip(val) {\r\n        if (this.verbalSearch === '') {\r\n          this.getVerbalClassify();\r\n        }\r\n      },\r\n      closeVerbal() {\r\n        this.$emit('letShortcutsShow', false);\r\n      },\r\n      switchView() {\r\n        this.isShowSearch = true;\r\n      },\r\n      // 跳转到话术管理\r\n      toScriptSet() {\r\n        // 权限目录判断\r\n        if (!this.isContainsMenu('script_set')) {\r\n  \r\n          ElMessage.error(this.$t('portal_set.error_haveNoPermissionScriptSet'))\r\n          return false;\r\n        }\r\n  \r\n        window.open(this.$rootRouter.resolve({\r\n          name: 'script_set'\r\n        }).href, '_blank');\r\n      },\r\n   \r\n      // 获取话术\r\n      getVerbalClassify() {\r\n        this.refreshVerbal = true;\r\n        axios({\r\n          url: 'https://cnendtx.leadscloud.com/cuss-login/replyType/getReplyTypeList',\r\n          method: 'get',\r\n          params: {\r\n            orgId: this.enterpriseId\r\n          }\r\n        }).then(res => {\r\n          this.parentVerbal = res.data.data.list;\r\n          axios({\r\n            url: 'https://cnendtx.leadscloud.com/cuss-login/reply/getReplyList',\r\n            method: 'get',\r\n            params: {\r\n              orgId: this.enterpriseId,\r\n              typeId: 0,\r\n              pageNo: 0,\r\n              pageSize: 0\r\n            }\r\n          }).then(res => {\r\n            this.childrenVerbal = res.data.data.list;\r\n            this.verbalTree = this.get_tree(this.parentVerbal, this.childrenVerbal);\r\n            this.refreshVerbal = false;\r\n          });\r\n        });\r\n      },\r\n      // 话术树按照sortNo排序\r\n      sort_tree(val) {\r\n        for (let i = 0; i < val.length; i++) {\r\n          if (val[i].children) {\r\n            val[i].children = this.sort_tree(val[i].children);\r\n          }\r\n        }\r\n        val = val.sort((a, b) => {\r\n          if (a.sortNo === b.sortNo) {\r\n            if (a.name === '基本信息') {\r\n              return -1;\r\n            } else {\r\n              return 0;\r\n            }\r\n          } else {\r\n            if (a.sortNo > b.sortNo) {\r\n              return 1;\r\n            } else {\r\n              return -1;\r\n            }\r\n          }\r\n        });\r\n        return val;\r\n      },\r\n      // 按照键值排序\r\n      sortBy(property, sortType = 'asc') {\r\n        return function (a, b) {\r\n          const value1 = a[property];\r\n          const value2 = b[property];\r\n          return sortType === 'desc' ? value2 - value1 : value1 - value2;\r\n        };\r\n      },\r\n      // 渲染树\r\n      get_tree(param_arr, user_list, check_arr) {\r\n        const userList = user_list.map(item => {\r\n          const obj = {};\r\n          obj.verbalContent = item.name;\r\n          obj.parentId = item.typeId;\r\n          obj.name = item.abbr;\r\n          obj.power = item.manageName;\r\n          obj.id = item.id;\r\n          obj.createUserId = item.createUserId;\r\n          obj.type = 'person';\r\n          return obj;\r\n        });\r\n        const arr = param_arr.map(item => {\r\n          const obj = {};\r\n          obj.parentId = item.parentId;\r\n          obj.name = item.name;\r\n          obj.id = item.id;\r\n          obj.verbalContent = '';\r\n          obj.level = item.type;\r\n          obj.sortNo = item.sortNo;\r\n          return obj;\r\n        });\r\n        let parent_arr = [];\r\n  \r\n        for (let i = 0; i < arr.length; i++) {\r\n          if (arr[i].parentId === 0) {\r\n            parent_arr.push(arr[i]);\r\n            arr.splice(i, 1);\r\n            i = i - 1;\r\n          }\r\n        }\r\n  \r\n        function structure_parent_arr(arr) {\r\n          return arr.map(item => {\r\n            const obj = {};\r\n            obj.title = item.name;\r\n            obj.id = item.id;\r\n            obj.parentId = item.parentId;\r\n            obj.children = [];\r\n            obj.verbalContent = '';\r\n            obj.level = item.type;\r\n            obj.expand = true;\r\n            obj.sortNo = item.sortNo;\r\n            return obj;\r\n          });\r\n        }\r\n  \r\n        parent_arr = structure_parent_arr(parent_arr);\r\n        parent_arr = this.sort_tree(parent_arr);\r\n  \r\n        // 默认展开一级树\r\n        this.expandedIdList = parent_arr.map(item => {\r\n          return item.id;\r\n        });\r\n  \r\n        function build_child(parent_arr, arr) {\r\n          for (let j = 0; j < parent_arr.length; j++) {\r\n            for (let i = 0; i < arr.length; i++) {\r\n              if (arr[i].parentId === parent_arr[j].id) {\r\n                parent_arr[j].checked = false;\r\n                const obj = {};\r\n                obj.show_info = arr;\r\n                obj.title = arr[i].name;\r\n                obj.id = arr[i].id;\r\n                obj.createUserId = arr[i].createUserId;\r\n                obj.power = arr[i].power;\r\n                obj.parentId = arr[i].parentId;\r\n                obj.verbalContent = arr[i].verbalContent;\r\n                obj.grandpa_id = parent_arr[j].parentId;\r\n                obj.parent_name = parent_arr[j].title;\r\n                if (arr[i].category === 1) {\r\n                  obj.menu = 'department';\r\n                } else {\r\n                  obj.menu = 'person';\r\n                }\r\n                obj.type = arr[i].type;\r\n                obj.disabled = false;\r\n                obj.expand = true;\r\n                obj.checked = arr[i].check;\r\n                obj.children = [];\r\n                parent_arr[j].children.push(obj);\r\n                arr.splice(i, 1);\r\n                i = i - 1;\r\n              }\r\n            }\r\n          }\r\n          if (arr.length) {\r\n            for (const child_item of parent_arr) {\r\n              if (child_item.children.length) {\r\n                build_child(child_item.children, arr);\r\n              }\r\n            }\r\n          }\r\n  \r\n          return parent_arr;\r\n        }\r\n  \r\n        const new_arr = arr.concat(userList);\r\n        return build_child(parent_arr, new_arr);\r\n      },\r\n      get_search_tree(param_arr, user_list, check_arr) {\r\n        const _this = this;\r\n        const userList = user_list.map(item => {\r\n          const obj = {};\r\n          obj.verbalContent = item.name;\r\n          obj.parentId = item.typeId;\r\n          obj.name = item.abbr;\r\n          obj.power = item.manageName;\r\n          obj.id = item.id;\r\n          obj.createUserId = item.createUserId;\r\n          obj.type = 'person';\r\n          return obj;\r\n        });\r\n  \r\n        const arr = param_arr.map(item => {\r\n          const obj = {};\r\n          obj.parentId = item.parentId;\r\n          obj.name = item.name;\r\n          obj.id = item.id;\r\n          obj.verbalContent = '';\r\n          obj.level = item.type;\r\n          obj.sortNo = item.sortNo;\r\n          return obj;\r\n        });\r\n        let parent_arr = [];\r\n  \r\n        for (let i = 0; i < arr.length; i++) {\r\n          if (arr[i].parentId === 0) {\r\n            parent_arr.push(arr[i]);\r\n            arr.splice(i, 1);\r\n            i = i - 1;\r\n          }\r\n        }\r\n  \r\n        function structure_parent_arr(arr) {\r\n          return arr.map(item => {\r\n            const obj = {};\r\n            obj.title = item.name;\r\n            obj.id = item.id;\r\n            obj.parentId = item.parentId;\r\n            obj.children = [];\r\n            obj.verbalContent = '';\r\n            obj.level = item.type;\r\n            obj.expand = true;\r\n            // 追加id\r\n            _this.expandedIdList.push(item.id);\r\n            obj.sortNo = item.sortNo;\r\n            return obj;\r\n          });\r\n        }\r\n  \r\n        parent_arr = structure_parent_arr(parent_arr);\r\n  \r\n        function build_child(parent_arr, arr) {\r\n          for (let j = 0; j < parent_arr.length; j++) {\r\n            for (let i = 0; i < arr.length; i++) {\r\n              if (arr[i].parentId === parent_arr[j].id) {\r\n                parent_arr[j].checked = false;\r\n                const obj = {};\r\n                obj.show_info = arr;\r\n                obj.title = arr[i].name;\r\n                obj.id = arr[i].id;\r\n                obj.createUserId = arr[i].createUserId;\r\n                obj.power = arr[i].power;\r\n                obj.parentId = arr[i].parentId;\r\n                obj.verbalContent = arr[i].verbalContent;\r\n                obj.grandpa_id = parent_arr[j].parentId;\r\n                obj.parent_name = parent_arr[j].title;\r\n                if (arr[i].category === 1) {\r\n                  obj.menu = 'department';\r\n                } else {\r\n                  obj.menu = 'person';\r\n                }\r\n                obj.type = arr[i].type;\r\n                obj.disabled = false;\r\n                obj.expand = true;\r\n                // 追加id\r\n                _this.expandedIdList.push(arr[i].id);\r\n                obj.checked = arr[i].check;\r\n                obj.children = [];\r\n                parent_arr[j].children.push(obj);\r\n                arr.splice(i, 1);\r\n                i = i - 1;\r\n              }\r\n            }\r\n          }\r\n          if (arr.length) {\r\n            for (const child_item of parent_arr) {\r\n              if (child_item.children.length) {\r\n                build_child(child_item.children, arr);\r\n              }\r\n            }\r\n          }\r\n  \r\n          return parent_arr;\r\n        }\r\n  \r\n        const new_arr = arr.concat(userList);\r\n        return build_child(parent_arr, new_arr);\r\n      },\r\n      getVerbalTree() {\r\n        this.verbalTree = this.get_tree(this.parentVerbal, this.childrenVerbal);\r\n        console.log('--------', this.verbalTree)\r\n      },\r\n      // 话术搜索\r\n      searchVerbalList() {\r\n        // 当搜索内容为空时不执行后续代码\r\n        if (this.verbalSearch === '') {\r\n          return;\r\n        }\r\n        const str_searched = this.verbalSearch || ''; // 要搜索的文字\r\n        const temp_tree_data = this.get_search_tree(this.parentVerbal, this.childrenVerbal, []); // 全量 tree_data\r\n        function search_title_recursively(nodes, str_searched) {\r\n          return nodes.map(node => {\r\n            if (node.title.includes(str_searched) || node.verbalContent.includes(str_searched)) {\r\n              return node;\r\n            } else if (node.children.length) {\r\n              node.children = search_title_recursively(node.children, str_searched);\r\n              if (node.children.length) {\r\n                return node;\r\n              } else {\r\n                return undefined;\r\n              }\r\n            } else {\r\n              return undefined;\r\n            }\r\n          }).filter(item => item);\r\n        }\r\n  \r\n        const tree_data = search_title_recursively(temp_tree_data, str_searched);\r\n        this.verbalTree = tree_data;\r\n      }\r\n    },\r\n    created() {\r\n      // 获取话术分类\r\n      console.log('加载话术组件');\r\n      this.getVerbalClassify();\r\n    }\r\n  };\r\n  </script>\r\n  \r\n  <style lang=\"scss\" scoped>\r\n  .piwik_ChatSplitToVerbal:hover {\r\n    .custom-custom-script-set {\r\n      color: #4285F4;\r\n    }\r\n  }\r\n  \r\n  .short-cut-verbal-search {\r\n    padding: 0 20px;\r\n    display: flex;\r\n  \r\n    .ivu-input-wrapper .ivu-input {\r\n      border-radius: 16px;\r\n    }\r\n  }\r\n  \r\n  .main-shortcuts {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    z-index: 99;\r\n    background-color: #ffffff;\r\n  \r\n    &-top {\r\n      height: 30px;\r\n      line-height: 30px;\r\n      margin: 20px;\r\n    }\r\n  \r\n    &-block {\r\n      position: absolute;\r\n      top: 120px;\r\n      left: 0;\r\n      right: 0;\r\n      bottom: 0;\r\n      overflow-y: auto;\r\n    }\r\n  \r\n    &-list {\r\n      cursor: pointer;\r\n      color: rgba(0, 0, 0, 0.80);\r\n      padding: 10px 20px;\r\n      box-shadow: inset 0 -1px 0 0 #F5F5F5;\r\n  \r\n      &:hover {\r\n        color: #FA8241;\r\n      }\r\n    }\r\n  \r\n    &-list-active {\r\n      color: #FA8241;\r\n    }\r\n  }\r\n  \r\n  .main-shortcuts-block {\r\n    padding: 0 20px;\r\n    font-family: PingFangSC-Regular;\r\n    font-size: 12px;\r\n    color: rgba(0, 0, 0, 0.80);\r\n  }\r\n  </style>\r\n  ",".piwik_ChatSplitToVerbal:hover .custom-custom-script-set {\n  color: #4285F4;\n}\n\n.short-cut-verbal-search {\n  padding: 0 20px;\n  display: flex;\n}\n.short-cut-verbal-search .ivu-input-wrapper .ivu-input {\n  border-radius: 16px;\n}\n\n.main-shortcuts {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 99;\n  background-color: #ffffff;\n}\n.main-shortcuts-top {\n  height: 30px;\n  line-height: 30px;\n  margin: 20px;\n}\n.main-shortcuts-block {\n  position: absolute;\n  top: 120px;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  overflow-y: auto;\n}\n.main-shortcuts-list {\n  cursor: pointer;\n  color: rgba(0, 0, 0, 0.8);\n  padding: 10px 20px;\n  box-shadow: inset 0 -1px 0 0 #F5F5F5;\n}\n.main-shortcuts-list:hover {\n  color: #FA8241;\n}\n.main-shortcuts-list-active {\n  color: #FA8241;\n}\n\n.main-shortcuts-block {\n  padding: 0 20px;\n  font-family: PingFangSC-Regular;\n  font-size: 12px;\n  color: rgba(0, 0, 0, 0.8);\n}\n\n/*# sourceMappingURL=shortcuts.vue.map */"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-1d4e2008";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

// 单独引入       
__vue_component__.install = app => {

    app.component(__vue_component__.name || __vue_component__.__name , __vue_component__);
};

export { __vue_component__ as default };
