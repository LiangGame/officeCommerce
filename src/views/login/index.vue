<template>
  <div class="login_container">
    <div class="login_bg"></div>
    <div class="main">
      <!--<h1>电商后台管理系统</h1>-->
      <div class="loginForm">
        <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="用户名" prop="user">
            <el-input type="text" v-model="loginForm.user" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label-width="0" style="text-align: center">
            <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script>
  import Qs from 'qs';
  import {Message} from 'element-ui'

  export default {
    name: "login",
    data() {
      return {
        loginForm: {
          user: '',
          password: ''
        },
        rules: {
          user: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('here');
            this.$http({
              url: '/admin/login',
              method: 'POST',
              data: this.loginForm,
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
                var inFifteenMinutes = new Date(new Date().getTime() + 60 * 60 * 1000);
                this.Cookie.set('level', data.info.type, {expires: inFifteenMinutes});
                let level = this.Cookie.get('level');
                if (level == 2) {
                  this.$router.push('/money');
                } else if (level == 3) {
                  this.$router.push('/shop');
                } else if (level == 4) {
                  this.$router.push('/consignment');
                } else {
                  this.$router.push('/');
                }
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="less">
  .login_container {
    .login_bg {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: #fff url("../../assets/pic/login_bg03.jpg") no-repeat;
      background-size: 100% 100%;
      z-index: -99;
    }
    .main {
      .loginForm {
        background: white;
        border-radius: 8px;
        padding: 50px 30px 30px 30px;
        box-shadow: 10px 10px 20px #cdcdcd;;
        width: 450px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -223px;
        margin-left: -255px;
      }
      .el-form-item__label {
        text-align: justify;
        text-align-last: justify;
      }
    }
  }
</style>
