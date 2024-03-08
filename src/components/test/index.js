import test from './test.vue';



// 单独引入       
test.install = app => {

    app.component(test.name || test.__name , test)
}


export default test