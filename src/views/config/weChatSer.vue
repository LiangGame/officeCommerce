<template>
    <div class="weChatSer_container">
      <div class="main">
        <el-form :label-position="labelPosition" label-width="180px" :model="formData">
          <el-form-item label="修改公告">
            <el-input v-model="formData.notice"></el-input>
          </el-form-item>
          <el-form-item label="客服微信">
            <el-input v-model="formData.wechatNum"></el-input>
          </el-form-item>
          <el-form-item label="客服二维码">
            <el-upload
              :disabled="isReadOnly == 1"
              list-type="picture-card"
              class="avatar-uploader"
              :action="uploadUrl"
              name="good"
              :show-file-list="false"
              :on-success="serviceUploadSuccess"
              :before-upload="beforeServiceUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" width="145" height="145">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="修改客服热线">
            <el-input v-model="formData.phone"></el-input>
          </el-form-item>
          <div style="text-align:center" v-if="isReadOnly == 0">
            <el-button type="primary" @click="editeConfig">修改</el-button>
          </div>
        </el-form>
      </div>
    </div>
</template>

<script>
  import {uploadUrl,fileUrl} from '@/common/common.js'
  import {Message} from 'element-ui'
  export default {
    name: "config",
    data() {
      return {
        isReadOnly: this.Cookie.get('isReadOnly'),
        uploadUrl: uploadUrl,
        fileUrl: fileUrl,
        formData: {},
        labelPosition: '',
        imageUrl: '',
      }
    },
    methods: {
      serviceUploadSuccess(res, file) {
        console.log(res);
        console.log(file);
        if(res.errCode == 0){
          this.formData.wechatPic = this.fileUrl+res.info;
          this.imageUrl = this.fileUrl+res.info;
        }
      },
      beforeServiceUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      editeConfig(){
        this.$http({
          url: "/config/editConfig",
          method: "GET",
          params: this.formData
        }).then(data => {
          if(data.errCode == 0){
            Message({
              showClose: true,
              message: data.info,
              type: 'success'
            });
          }else {
            Message({
              showClose: true,
              message: data.info,
              type: 'error'
            });
          }
        })
      },
      getConfig(){
        this.$http({
          url: "/config/getConfig",
          method: "GET",
          params: this.formData
        }).then(data => {
          if(data.errCode == 0){
            this.formData = data.info;
            this.imageUrl = data.info.wechatPic
          }
        })
      }
    },
    created(){
      this.getConfig();
    }
  }
</script>

<style lang="less">
  .weChatSer_container {
    margin-top: 10px;
  }
</style>
