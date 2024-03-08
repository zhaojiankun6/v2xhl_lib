<template>
    <div class="color">
      <!-- Your template code here -->
      test123test123test123
      <div @click="add">asdasd</div>
      <el-button type="primary"  @click="add">主要按钮</el-button>
    </div>
  </template>
  
  <script >
  import { Message,Button } from 'element-ui'
export default{
  name:'test',
  components:{
    ElButton:Button
  },
  data(){
    return{
      msg:'test'
    }
  },
  methods:{
    add(){
      console.log('123')
      Message('this is a message.')
    }
  }
}


  </script>
  
<style scoped  lang="scss">
  .color{
      color: blue;
      font-size: 50px;
  }
  </style>
  