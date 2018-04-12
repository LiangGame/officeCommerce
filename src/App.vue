<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',

  }
</script>

<style lang="less">
  @import "./style/normalize.css";
  @import './style/common.less';

  body {
    font-family: '微软雅黑';
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: transparent;
    opacity: .8;
  }

  ::-webkit-scrollbar-button {
    width: 0;
    height: 0;
  }

  ::-webkit-scrollbar-thumb {
    background: #409EFF;
    /*border: thin solid #fa9000;*/
    border-radius: 8px;
    -webkit-transition: background .25s linear;
  }

  ::-webkit-scrollbar-track {
    background: #F0F0F0;
    border: 1px solid #F0F0F0;
    box-shadow: none;
    border-radius: 0;
  }

  /*弹窗*/
  .el-dialog{
    border-radius: 4px;
    .el-dialog__header {
      background: #409EFF;
      border-radius: 4px 4px 0 0;
      padding: 10px;
      .el-dialog__headerbtn{
        top: 10px;
      }
      .el-dialog__title,.el-dialog__headerbtn .el-dialog__close {
        color: white;
        font-size: 16px;
      }
    }
  }

</style>
