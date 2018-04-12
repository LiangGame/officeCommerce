<template>
  <div class="login_container">
    <div class="login_bg"></div>
    <div class="main">
      <!--<h1>电商后台管理系统</h1>-->
      <div class="loginForm">
        <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="用户名" prop="userName">
            <el-input type="password" v-model="loginForm.userName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="checkPass">
            <el-input type="password" v-model="loginForm.checkPass" auto-complete="off"></el-input>
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
  export default {
    name: "login",
    data() {
      return {
        loginForm: {
          userName: '',
          checkPass: ''
        },
        rules: {
          userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
          checkPass: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$router.push('/');
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
    .main{
      .loginForm{
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
      .el-form-item__label{
        text-align: justify;
        text-align-last: justify;
      }
    }
  }
</style>
