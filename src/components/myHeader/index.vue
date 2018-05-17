<template>
  <div class="header_container">
    <ul class="nav-list">
      <li class="logo">
        <img src="../../assets/pic/person_logo.png" height="46" width="100"/>
      </li>
      <!--<li style="float: left;width: 120px;line-height: 100px"><a>恒迈达管理系统</a></li>-->
      <li v-if="level == 0 || level == 1|| level == 3">
        <router-link to='/order' active-class="active-nav">订单管理</router-link>
      </li>
      <li v-if="level == 0 || level == 3">
        <router-link to='/shop' active-class="active-nav">商城管理</router-link>
      </li>
      <li v-if="level == 0 || level == 1 || level == 2">
        <router-link to='/money' active-class="active-nav">财务管理</router-link>
      </li>
      <!--<li v-if="level == 0 || level == 3 || level == 4">-->
        <!--<router-link to='/consignment' active-class="active-nav">寄售管理</router-link>-->
      <!--</li>-->
      <li v-if="level == 0 || level == 4">
        <router-link to='/vip' active-class="active-nav">会员管理</router-link>
      </li>
      <!--<li>-->
        <!--<router-link to='/status' active-class="active-nav">代理资格</router-link>-->
      <!--</li>-->
      <li v-if="level == 0 || level == 3">
        <router-link to='/jurisdiction' active-class="active-nav">权限管理</router-link>
      </li>
      <li v-if="level == 0 || level == 3">
        <router-link to='/dataAnalysis' active-class="active-nav">数据分析</router-link>
      </li>
      <li v-if="level == 0 || level == 3">
        <router-link to='/risk' active-class="active-nav">风控管理</router-link>
      </li>
      <li v-if="level == 0">
        <router-link to='/config' active-class="active-nav">系统设置</router-link>
      </li>
      <li v-if="level == 0">
        <router-link to='/log' active-class="active-nav">操作日志</router-link>
      </li>
      <!--<li v-if="level == 0">-->
        <!--<router-link to='/setting' active-class="active-nav">设置</router-link>-->
      <!--</li>-->
      <li class="exit" style="float: right" @click="esc">
        <a class="exit_btn">退出系统</a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "myHeader",
    data() {
      return {
        level: this.Cookie.get('level')
      }
    },
    methods: {
      esc() {
        this.Cookie.remove('level');
        this.$router.push('/login');
      }
    },
    created() {

    }
  }
</script>

<style lang="less">
  .header_container {
    width: 100%;
    min-width: 1366px;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
    background: #409EFF;
    @media screen and (max-width: 1280px) {
      /*.exit {*/
      /*cursor: pointer;*/
      /*font-size: 16px;*/
      /*color: #f6f6f6;*/
      /*float: right;*/
      /*margin-right: 150px;*/
      /*}*/
      .nav-list{
        width: 1280px;
      }
    }
    @media screen and (min-width: 1280px) {
      .nav-list{
        width: 80%;
      }
      /*.exit {*/
      /*cursor: pointer;*/
      /*font-size: 16px;*/
      /*color: #f6f6f6;*/
      /*position: absolute;*/
      /*right: 150px;*/
      /*}*/
    }
    .nav-list {
      font-size: 0px;
      min-width: 1280px;
      margin: 0 auto;
      .logo{
        /*display: inline-block;*/
        /*height: 56px;*/
        /*float: left;*/
        width: 150px;
      }
      li {
        display: inline-block;
        width: 6%;
        height: 56px;
        line-height: 56px;
        text-align: center;
        position: relative;
        overflow: hidden;
        a {
          outline: none;
          display: inline-block;
          font-size: 16px;
          color: #f6f6f6;
          width: 100%;
          height: 56px;
          line-height: 56px;
          text-align: center;
          &.active-nav {
            background: #3387dc;
            color: #f6f6f6;
            border-left: solid 1px #3473c8;
            border-right: solid 1px #3473c8;
          }
          &:hover {
            color: #f6f6f6;
          }
        }
        a.active-nav + p {
          display: block;
        }
        p {
          position: absolute;
          z-index: 100;
          top: 25px;
          left: 43px;
          display: none;
        }
        .exit_btn{
          width: 100%;
          background: red;
          height: 35px;
          line-height: 35px;
          margin-top: 10px;
          border-radius: 4px;
          float: left;
        }
      }
    }
  }
</style>
