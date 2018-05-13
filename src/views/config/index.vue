<template>
  <div class="config_index_container">
    <div class="left fl">
      <side-bar text="类别"/>
    </div>
    <div class="right fl">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import sideBar from '@/components/silder/index'
  export default {
    components: {sideBar},
  }
</script>

<style lang="less">
  .fl{
    float: left;
  }
  .config_index_container{
    width: 1100px;
    margin: 0 auto;
  }
  .right{
    width: 938px;
  }
</style>
