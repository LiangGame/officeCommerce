<template>
  <div class="header_container">
    <ul class="nav-list">
      <li v-if="level == 0 || level == 1">
        <router-link to='/order' active-class="active-nav">订单管理</router-link>
      </li>
      <li v-if="level == 0 || level == 3">
        <router-link to='/shop' active-class="active-nav">商城管理</router-link>
      </li>
      <li v-if="level == 0 || level == 1 || level == 2">
        <router-link to='/money' active-class="active-nav">财务管理</router-link>
      </li>
      <li v-if="level == 0 || level == 3 || level == 4">
        <router-link to='/consignment' active-class="active-nav">寄售管理</router-link>
      </li>
      <li v-if="level == 0 || level == 4">
        <router-link to='/vip' active-class="active-nav">会员管理</router-link>
      </li>
      <li v-if="level == 0 || level == 3">
        <router-link to='/jurisdiction' active-class="active-nav">权限管理</router-link>
      </li>
      <li v-if="level == 0 || level == 3">
        <router-link to='/dataAnalysis' active-class="active-nav">数据分析</router-link>
      </li>
      <li v-if="level == 0">
        <router-link to='/setting' active-class="active-nav">设置</router-link>
      </li>
      <li class="exit" @click="esc">
        <div>退出系统</div>
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
    min-width: 1280px;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
    background: #409EFF;
    .nav-list {
      font-size: 0px;
      li {
        display: inline-block;
        width: 100px;
        height: 56px;
        line-height: 56px;
        text-align: center;
        position: relative;
        a {
          outline: none;
          display: inline-block;
          font-size: 16px;
          color: #f6f6f6;
          width: 100px;
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
      }
      @media screen and (max-width: 1280px) {
        .exit {
          cursor: pointer;
          font-size: 16px;
          color: #f6f6f6;
          float: right;
          margin-right: 150px;
        }
      }
      @media screen and (min-width: 1280px) {
        .exit {
          cursor: pointer;
          font-size: 16px;
          color: #f6f6f6;
          position: absolute;
          right: 150px;
        }
      }
    }
  }
</style>
