<template>
  <div class="shopOperate_container">
    <el-dialog
      :title="title"
      :visible="visible"
      width="1000px"
      :closeOnClickModal="false"
      :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="商品名称" prop="goodName">
              <el-input v-model="ruleForm.goodName"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="goodDescribe">
              <el-input type="textarea" v-model="ruleForm.goodDescribe"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="6">
                <el-form-item label="总代言费" prop="rewardTotal">
                  <el-input v-model="ruleForm.rewardTotal"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="二级代言费" prop="rewardSecond">
                  <el-input v-model="ruleForm.rewardSecond"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="最大购买数量" label-width="120px" prop="max">
                  <el-input v-model="ruleForm.max"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="商品总价" prop="price">
                  <el-input v-model="ruleForm.price"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="第一次代售回款" prop="price" label-width="150px">
                  <el-input v-model="ruleForm.first"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="第二次代售回款" prop="price" label-width="150px">
                  <el-input v-model="ruleForm.second"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-upload
                class="upload-demo"
                ref="upload"
                list-type="picture"
                name="good"
                :action="uploadUrl"
                :multiple="false"
                :on-preview="handlePreview"
                :on-success="successFile"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器
                </el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item label-width="0" align="center">
              <el-button type="primary" @click="submitForm('ruleForm')" :disabled="isOne">保存</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {uploadUrl,fileUrl} from "@/common/common";
  import Qs from 'qs';
  import {Message} from 'element-ui'

  export default {
    name: "shopOperate",
    props: ['visible', 'isEdit', 'info'],
    data() {
      return {
        title: "添加",
        isOne:false,
        uploadUrl: uploadUrl,
        ruleForm: {
          goodName: '',
          goodDescribe: '',
          rewardTotal: '',
          rewardSecond: '',
          max: '',
          img: '',
          price: '',
          first:'',
          second:''
        },
        fileList:[],
        rules: {
          goodName: [{required: true, message: '请输入商品名称', trigger: 'blur'}, {
            min: 3,
            message: '名称过短!',
            trigger: 'blur'
          }],
          goodDescribe: [{required: true, message: '请填写商品描述', trigger: 'blur'}],
          rewardTotal: [{required: true, message: '请输入总代言费', trigger: 'blur'}],
          rewardSecond: [{required: true, message: '请输入二级代言费', trigger: 'blur'}],
          price: [{required: true, message: '请输入商品总价', trigger: 'blur'}],
          max: [{required: true, message: '请输入最多购买数量', trigger: 'blur'}]
        }
      };
    },
    created() {
      console.log('文件上传路径:', uploadUrl);
      console.log('商品数据:',this.info);
      if (this.isEdit == '1') {
        this.title = '编辑';
        let imgList = fileUrl + this.info.img;
        console.log(imgList);
        // this.info.img = '';
        this.fileList.push({name:this.info.goodName,url:imgList})
        // this.info.img.push({name:this.info.goodName,url:imgList});
        this.ruleForm = this.info;
      }
    },
    methods: {
      //关闭弹窗
      handleClose(done) {
        this.$emit('updateIsShow', false);
      },
      //提交事件
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.isEdit == 0) {
              this.submitData('/goods/addGoods', 'POST');
            } else {
              this.submitData('/goods/editGoods', 'POST');
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //提交数据
      submitData(url, type) {
        this.isOne = true;
        this.$http({
          url: url,
          method: type,
          data: this.ruleForm,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          transformRequest: [function (data) {
            let json = JSON.stringify(Qs.parse(data));
            return json;
          }]
        }).then(data => {
          console.log(data);
          this.isOne = false;
          if (data.errCode == 0) {
            this.$emit('updateIsShow', false);
            this.$emit('updateInfo');
          } else if (data.errCode != 0) {
            Message({
              showClose: true,
              message: data.info,
              type: 'error'
            });
          }
        }).catch(error => {

        })
      },
      //重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //删除文件
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.fileList = [];
        this.ruleForm = '';
      },
      //上传成功
      successFile(response){
        console.log(response);
        if(response.errCode == 0){
          this.fileList.push({name:response.info,url:response.info});
          this.ruleForm.img = response.info;
        }else {
          Message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      },
      //上传文件回调
      handlePreview(file) {
        console.log(174,file);
      },
      //上传文件
      submitUpload() {
        this.$refs.upload.submit()
      }
    }
  }
</script>

<style lang="less">
  .shopOperate_container {
    .el-dialog__body {
      max-height: 450px;
      overflow-y: auto;
    }
  }
</style>
