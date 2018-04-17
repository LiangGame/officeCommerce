<template>
  <div class="jurisdictionOperate_container">
    <el-dialog
      :title="title"
      :visible="visible"
      width="450px"
      :closeOnClickModal="false"
      :before-close="handleClose">
      <el-form :model="data" status-icon ref="data" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号">
          <el-input type="text" v-model="data.user" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="text" v-model="data.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-select
            v-model="data.type"
            collapse-tags
            placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0" align="center">
          <el-button type="primary" @click="submitForm('data')">提交</el-button>
          <el-button @click="resetForm('data')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Qs from 'qs';
  import {Message} from 'element-ui'

  export default {
    name: "jurisdictionOperate",
    props: ['visible', 'isEdit', 'info'],
    data() {
      return {
        title: "添加",
        data: {
          user: '',
          password: '',
          type: ''
        },
        options: [
          {
            value: '0',
            label: '超级管理员(所有)'
          },
          {
            value: '4',
            label: '客服岗(会员管理、寄售管理)'
          },
          {
            value: '3',
            label: '运营岗(商城管理、寄售管理、数据分析)'
          },
          {
            value: '2',
            label: '出纳岗(提现)'
          },
          {
            value: '1',
            label: '会计岗(充值、订单管理)'
          }
        ],
      };
    },
    created() {
      if (this.isEdit == '1') {
        this.title = '编辑';
        this.data = this.info
        console.log('管理员数据:',this.data);
      } else if (this.isEdit == '2') {
        this.title = '查看'
      }
    },
    methods: {
      handleClose(done) {
        this.$emit('updateIsShow', false);
      },

      submitForm(url) {
        if(this.isEdit == 0){
          this.$http({
            url: '/admin/addAdmin',
            method: 'POST',
            data: this.data,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            transformRequest: [function (data) {
              let json = JSON.stringify(Qs.parse(data));
              return json;
            }]
          }).then(data => {
            console.log(data);
            if (data.errCode == 0) {
              Message({
                showClose: true,
                message: data.info,
                type: 'success'
              });
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
            console.log(error);
          })
        }else {
          this.$http({
            url: '/admin/editAdmin',
            method: 'POST',
            data: this.data,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            transformRequest: [function (data) {
              let json = JSON.stringify(Qs.parse(data));
              return json;
            }]
          }).then(data => {
            console.log(data);
            if (data.errCode == 0) {
              Message({
                showClose: true,
                message: data.info,
                type: 'success'
              });
              this.$emit('updateIsShow', false);
            } else if (data.errCode != 0) {
              Message({
                showClose: true,
                message: data.info,
                type: 'error'
              });
            }
          }).catch(error => {
            console.log(error);
          })
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="less">
  .jurisdictionOperate_container {

  }
</style>
