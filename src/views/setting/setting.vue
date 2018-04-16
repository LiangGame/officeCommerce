<template>
  <div class="setting_container">
    <div class="main">
      <ul>
        <li class="title">支付方式：
          <span style="margin-left: 150px">
            <el-button type="danger" size="mini" @click="visible = true">修改支付方式</el-button>
          </span>
        </li>
        <li class="payMent_content">
          <div class="payMent_title">银行卡：</div>
          <p><span class="bank_label">开户行：</span><span>{{payMent.cardBank}}</span></p>
          <p><span class="bank_label">持卡人姓名：</span><span>{{payMent.cardName}}</span></p>
          <p><span class="bank_label">银行卡号：</span><span>{{payMent.cardNub}}</span></p>
        </li>
        <li class="payMent_content">
          <div class="payMent_title">微信：</div>
          <div class="img_container">
            <img :src="payMent.zhifubao ? fileUrl+payMent.zhifubao : ''" alt="微信">
          </div>
        </li>
        <li class="payMent_content">
          <div class="payMent_title">支付宝：</div>
          <div class="img_container">
            <img :src="payMent.weixin ? fileUrl+payMent.weixin : ''" alt="支付宝">
          </div>
        </li>
      </ul>
    </div>
    <!--弹窗-->
    <el-dialog
      title="修改支付方式"
      :visible="visible"
      width="500px"
      :closeOnClickModal="false"
      :before-close="handleClose">
      <el-form :model="payMents" status-icon label-width="100px" class="demo-ruleForm">
        <el-form-item label="银行卡："></el-form-item>
        <el-form-item label="开户行">
          <el-input type="text" v-model="payMents.cardBank" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="持卡人姓名">
          <el-input type="text" v-model="payMents.cardName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号">
          <el-input v-model="payMents.cardNub"></el-input>
        </el-form-item>
        <el-form-item label="微信："></el-form-item>
        <el-form-item label="户名">
          <el-input v-model="payMents.weixinname"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            ref="weChatUpload"
            list-type="picture"
            name="good"
            :action="uploadUrl"
            :multiple="false"
            :on-preview="handlePreview"
            :on-success="weChatSuccessFile"
            :on-remove="weChathandleRemove"
            :file-list="weChat"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="weChatSubmitUpload">上传到服务器
            </el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="支付宝："></el-form-item>
        <el-form-item label="户名">
          <el-input v-model="payMents.zhifubaoname"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            ref="apliayUpload"
            list-type="picture"
            name="good"
            :action="uploadUrl"
            :multiple="false"
            :on-preview="handlePreview"
            :on-success="apliaySuccessFile"
            :on-remove="apliayhandleRemove"
            :file-list="apliay"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="apliaySubmitUpload">上传到服务器
            </el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label-width="0" align="center">
          <el-button type="primary" @click="submitForm()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Qs from 'qs';
  import {MessageBox, Message} from 'element-ui';
  import {uploadUrl, fileUrl} from "@/common/common";

  export default {
    name: "setting",
    data() {
      return {
        uploadUrl: uploadUrl,
        fileUrl: fileUrl,
        payMent: {},
        visible: false,
        payMents: {
          zhifubao: '',
          weixin: ''
        },
        apliay: [],
        weChat: [],
      }
    },
    methods: {
      //关闭弹窗
      handleClose() {
        this.visible = false;
      },
      //获取支付方式
      getPayMent() {
        this.$http({
          url: "/config/getPayMent",
          method: "GET",
          params: {}
        }).then(data => {
          console.log(data);
          if (data.errCode == 0) {
            this.payMent = data.info;
            this.payMents = data.info;
            this.apliay.push({name: data.info.zhifubao, url: this.fileUrl + data.info.zhifubao});
            this.weChat.push({name: data.info.weixin, url: this.fileUrl + data.info.weixin})
          } else {
            Message({
              showClose: true,
              message: data.info,
              type: 'error'
            });
          }
        })
      },
      //修改支付方式
      submitForm() {
        this.$http({
          url: "/config/editPayMent",
          method: "POST",
          data: this.payMents,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          transformRequest: [function (data) {
            let json = JSON.stringify(Qs.parse(data));
            return json;
          }]
        }).then(data => {
          if (data.errCode == 0) {
            Message({
              showClose: true,
              message: data.info,
              type: 'success'
            });
            this.visible = false;
          } else {
            Message({
              showClose: true,
              message: data.info,
              type: 'error'
            });
          }
        })
      },
      //删除文件
      apliayhandleRemove(file, fileList) {
        console.log(file, fileList);
        this.apliay = [];
      },
      weChathandleRemove(file, fileList) {
        console.log(file, fileList);
        this.weChat = [];
      },
      //上传成功
      apliaySuccessFile(response) {
        console.log(response);
        if (response.errCode == 0) {
          this.apliay[0] = {name: response.info, url: this.fileUrl + response.info};
          this.payMents.zhifubao = response.info;
        } else {
          Message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      },
      weChatSuccessFile(response) {
        console.log(response);
        if (response.errCode == 0) {
          this.weChat[0] = {name: response.info, url: this.fileUrl + response.info};
          this.payMents.weixin = response.info;
        } else {
          Message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      },
      //上传文件回调
      handlePreview(file) {
        console.log(174, file);
      },
      //上传文件
      apliaySubmitUpload() {
        this.$refs.apliayUpload.submit()
      },
      weChatSubmitUpload() {
        this.$refs.weChatUpload.submit()
      },
    },
    created() {
      this.getPayMent();
    }
  }
</script>

<style lang="less">
  .setting_container {
    @media screen and (max-width: 1280px) {
      .main {
        width: 1100px;
        margin: 0 auto;
      }
    }
    @media screen and (min-width: 1366px) {
      .main {
        width: 80%;
        margin: 0 auto;
      }
    }
    .main {
      border: solid 1px #e6e6e6;
      margin-top: 10px;
      .title {
        height: 55px;
        line-height: 55px;
        background: #f6f6f6;
        padding-left: 35px !important;
        border-bottom: solid 1px #c0c0c0;
        font-size: 18px;
      }
      .payMent_content {
        padding: 10px 20px;
        .payMent_title {
          height: 35px;
          line-height: 35px;
          padding-left: 15px;
          border-left: solid 4px #3a8ee6;
        }
        .bank_label {
          display: inline-block;
          width: 100px;
          height: 35px;
          line-height: 35px;
          padding-left: 2em;
        }
        .img_container {
          padding-left: 25px;
          img {
            width: 250px;
            /*height: 100%;*/
          }
        }
      }
    }
    .el-dialog__body {
      max-height: 450px;
      overflow-y: auto;
    }
  }
</style>
