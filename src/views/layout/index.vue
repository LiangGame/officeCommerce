<template>
  <div class="layout_container">
    <my-header/>
    <router-view/>
  </div>
</template>

<script>
  import myHeader from '@/components/myHeader';

  export default {
    name: "index",
    components: {myHeader}

  }
</script>

<style lang="less">
  .layout_container {

  }
</style>
