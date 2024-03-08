import file from './shortcuts.vue';



// 单独引入       
file.install = app => {

    app.component(file.name || file.__name , file)
}


export default file