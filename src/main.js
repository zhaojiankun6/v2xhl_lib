import test from "./components/test"
import shortcuts from "./components/shortcuts"
/***
在es模块中， 能被按需引入的变量需要用这些方式导出：
export const a = 1
export function a(){}
export { a, b }
而不能使用export default
***/
const install = (app) => {
    app.use(test)
    app.use(shortcuts)
}

// 用于按需引入
export {    
    test,
    shortcuts
}


// 用于全局安装
export default  {install};

