<template>
  <div class="home_container">
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
  .home_container{
    width: 1100px;
    margin: 0 auto;
  }
  .right{
    width: 938px;
  }
</style>
