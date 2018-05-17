<template>
  <!-- 侧边栏导航 -->
  <div class="sideBar-container">
    <p>
      <img src="../../assets/pic/u81.png" height="21" width="21"/>
      操作
    </p>
    <ul ref="wrapper">
      <li v-for="(item, index) in navData" :key = 'index' :class="[item.icon?'arrow':'']">
        <router-link :to = "item.path" active-class="active" @click.native="$emit('updateKey')">{{item.name}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import {setSize} from '@/common/common.js'
  export default {
    name:'sideBar',
    props:{
      text:String, // text:侧边栏顶部文字
      num0:{
        default:0   // 大地图传2
      }
    },
    data(){
      return{
        navData:[]
      }
    },
    created(){
      if(this.num0 == 0){
        /* 索引1 */
        let pathOrder1 = this.$route.path.substr(1).split('/')[0];
        let pathArr1 = this.$router.options.routes[0].children;  // 一级路由数组
        let order1;
        pathArr1.map((item,index)=>{
          if(item.path.substr(1) == pathOrder1){
            order1 = index;
            return;
          }
        })
        /* 索引2 */
        let pathOrder2 = this.$route.path.substr(1).split('/')[1];
        let pathArr2 = this.$router.options.routes[0].children[order1].children;  // 二级路由数组
        let order2;
        pathArr2.map((item,index)=>{
          if(item.path.substr(1).split('/')[1] == pathOrder2){
            order2 = index;
            return;
          }
        })
        // console.log(this.$router.options.routes[this.num0].children[order1])
        let routerData = this.$router.options.routes[this.num0].children[order1].children;

          routerData = this.$router.options.routes[this.num0].children[order1].children;
        // }
        this.navData = routerData;
      }
    },
    mounted(){
      if(this.num0 == 2){  // 大地图页面
        this.setSize(185);
        window.onresize = () => {
          this.setSize(185);
        }
      }else{
        this.setSize(110);
        window.onresize = () => {
          this.setSize(110);
        }
      }
    },
    methods:{
      setSize:setSize
    }
  }
</script>

<style lang="less" type="text/less">
  .sideBar-container{
    @theme-color:#56abf2;
    @font-color:#474747;
    width: 160px;
    height: 100%;
    border: 1px solid #b6b4b4;
    background: #e4e2e2;
    >p{
      margin: 12px 0 0 0;
      text-align: center;
      font-size: 20px;
      padding-bottom: 5px;
    }
    >ul{
      overflow-y: auto;
      overflow-x: hidden;
      >li{
        font-size: 14px;
        margin-bottom: 8px;
        text-align: center;
        position: relative;
        border-top: solid 1px #fff;
        border-bottom: solid 1px #fff;
        a{
          outline: none;
          color: @font-color;
          display: block;
          padding: 6px 16px;
          border: 2px solid transparent;
          &:hover{
          }
        }
        a.active{
          color: #ed0000;
        }
      }
      /* 箭头 */
      li.arrow:after{
        @w:5px;
        content: '';
        display: block;
        width: 0;
        height: 0;
        border-top: @w solid transparent;
        border-bottom: @w solid transparent;
        border-left: @w solid #fff;
        position: absolute;
        right: 10px;
        top:12px;
      }
    }
  }
</style>
