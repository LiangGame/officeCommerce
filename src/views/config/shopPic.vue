<template>
  <div class="shopPic_container">
    <el-form label-width="180px" style="margin-top: 10px">
      <el-form-item label="代售商城滚动图">
        <el-upload
          ref="upload"
          class="upload-demo"
          :action="uploadUrl"
          name="good"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :file-list="fileList1"
          :auto-upload="false"
          list-type="picture"
          :disabled="isReadOnly == 1">
          <el-button slot="trigger" size="small" type="primary" :disabled="isReadOnly == 1">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload1" :disabled="isReadOnly == 1">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="钱包商城滚动图">
        <el-upload
          ref="upload2"
          class="upload-demo"
          :action="uploadUrl"
          name="good"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleQbSuccess"
          :file-list="fileList2"
          list-type="picture"
          :auto-upload="false"
          :disabled="isReadOnly == 1">
          <el-button slot="trigger" size="small" type="primary" :disabled="isReadOnly == 1">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload2" :disabled="isReadOnly == 1">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {uploadUrl, fileUrl} from '@/common/common.js'

  export default {
    name: "config",
    data() {
      return {
        isReadOnly: this.Cookie.get('isReadOnly'),
        uploadUrl: uploadUrl,
        fileUrl: fileUrl,
        formData: {},
        labelPosition: '',
        fileList1: [],
        fileList2: [],
      }
    },
    methods: {
      //代售商城添加
      handleAvatarSuccess(res, file) {
        console.log(res);
        console.log(file);
        if (res.errCode == 0) {
          this.fileList1.push({url: this.fileUrl + res.info, name: res.info});
          // this.imageUrl = this.fileUrl+res.info;
          console.log(this.fileList1);
          this.addAD(1,res.info)
        }
      },
      //钱包商城添加
      handleQbSuccess(res, file) {
        console.log(res);
        console.log(file);
        if (res.errCode == 0) {
          this.fileList2.push({url: this.fileUrl + res.info, name: res.info});
          // this.imageUrl = this.fileUrl+res.info;
          console.log(this.fileList1);
          this.addAD(2,res.info)
        }
      },
      //移除文件
      handleRemove(file) {
        console.log(file);
        if(this.isReadOnly == 0){
          this.delAD(file.id);
        }else {
          return false;
        }

      },
      handlePreview(file) {
        console.log(file);
      },
      //上传文件
      submitUpload1() {
        this.$refs.upload.submit();
      },
      submitUpload2() {
        this.$refs.upload2.submit();
      },
      //获取数据
      getAD(type) {
        this.$http({
          url: '/config/getAD',
          method: 'GET',
          params: {type: type}
        }).then(data => {
          if (data.errCode == 0) {
            if (type == 1) {
              this.fileList1 = [];
            }else {
              this.fileList2 = [];
            }
            data.info.map(item => {
              if (type == 1) {
                this.fileList1.push({name:item.img,url:this.fileUrl+item.img,id:item.id})
              } else {
                this.fileList2.push({name:item.img,url:this.fileUrl+item.img,id:item.id})
              }
            })
          }
        })
      },
      //删除
      delAD(id){
        this.$http({
          url: '/config/delAD',
          method: 'GET',
          params: {id:id}
        }).then(data => {
          console.log(data);
        })
      },
      //添加数据
      addAD(type,url){
        this.$http({
          url: '/config/addAD',
          method: 'GET',
          params: {type: type,img:url}
        }).then(data => {
          if(data.errCode == 0){
            this.getAD(type);
          }
        })
      }
    },
    created() {
      this.getAD(1);
      this.getAD(2);
    }
  }
</script>

<style lang="less" scoped>
  .shopPic_container {
    .avatar-uploader {
      display: inline;
    }
    .avatar {
      margin: 0 5px;
    }
  }
</style>
