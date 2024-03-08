import __vue_component__ from './components/test/index.js';
import __vue_component__$1 from './components/shortcuts/index.js';
import 'element-ui';
import './browser-wYLHMB88.js';
import 'axios';

/***
在es模块中， 能被按需引入的变量需要用这些方式导出：
export const a = 1
export function a(){}
export { a, b }
而不能使用export default
***/
const install = (app) => {
    app.use(__vue_component__);
    app.use(__vue_component__$1);
};


// 用于全局安装
var main = {install};

export { main as default, __vue_component__$1 as shortcuts, __vue_component__ as test };
