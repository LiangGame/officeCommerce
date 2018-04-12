<template>
  <div id="app">
    <my-header/>
    <router-view/>
  </div>
</template>

<script>
  import myHeader from '@/components/myHeader';
  export default {
  name: 'App',
    components: { myHeader}

  }
</script>

<style>
  @import "./style/normalize.css";
  body{
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
    background: #f23030;
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
</style>
