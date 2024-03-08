import { Button, Message } from 'element-ui';
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

var script = {
  name:'test',
  components:{
    ElButton:Button
  },
  data(){
    return {
      msg:'test'
    }
  },
  methods:{
    add(){
      console.log('123');
      Message('this is a message.');
    }
  }
};

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "color" },
    [
      _vm._v("\n  test123test123test123\n  "),
      _c("div", { on: { click: _vm.add } }, [_vm._v("asdasd")]),
      _vm._v(" "),
      _c("el-button", { attrs: { type: "primary" }, on: { click: _vm.add } }, [
        _vm._v("主要按钮"),
      ]),
    ],
    1
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-655f6e44_0", { source: ".color[data-v-655f6e44] {\n  color: blue;\n  font-size: 50px;\n}\n\n/*# sourceMappingURL=test.vue.map */", map: {"version":3,"sources":["/Users/zhaojiankun/Desktop/code/code/xhl_libv2/src/components/test/test.vue","test.vue"],"names":[],"mappings":"AAiCA;EACA,WAAA;EACA,eAAA;AChCA;;AAEA,mCAAmC","file":"test.vue","sourcesContent":["<template>\r\n    <div class=\"color\">\r\n      <!-- Your template code here -->\r\n      test123test123test123\r\n      <div @click=\"add\">asdasd</div>\r\n      <el-button type=\"primary\"  @click=\"add\">主要按钮</el-button>\r\n    </div>\r\n  </template>\r\n  \r\n  <script >\r\n  import { Message,Button } from 'element-ui'\r\nexport default{\r\n  name:'test',\r\n  components:{\r\n    ElButton:Button\r\n  },\r\n  data(){\r\n    return{\r\n      msg:'test'\r\n    }\r\n  },\r\n  methods:{\r\n    add(){\r\n      console.log('123')\r\n      Message('this is a message.')\r\n    }\r\n  }\r\n}\r\n\r\n\r\n  </script>\r\n  \r\n<style scoped  lang=\"scss\">\r\n  .color{\r\n      color: blue;\r\n      font-size: 50px;\r\n  }\r\n  </style>\r\n  ",".color {\n  color: blue;\n  font-size: 50px;\n}\n\n/*# sourceMappingURL=test.vue.map */"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-655f6e44";
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
