<template>
  <div class="shopOperate_container">
    <el-dialog
      :title="title"
      :visible="visible"
      width="1000px"
      :closeOnClickModal="false"
      :before-close="handleClose">

    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "shopOperate",
    props:[ 'visible', 'isEdit', 'dataId'],
    data() {
      return {
        title:"添加"
      };
    },
    methods: {
      handleClose(done) {
        this.$emit('updateIsShow', false);
      },
    }
  }
</script>

<style lang="less" scoped>
  .shopOperate_container {

  }
</style>
