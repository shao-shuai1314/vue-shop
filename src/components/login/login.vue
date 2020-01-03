<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像 -->
            <div class="login-img">
                <img src="../../assets/logo.png" />
            </div>
            <!-- 表单 -->
            <el-form ref="loginResetFields" label-width="0px" :model="LoginForm" :rules="loginFormRules" class="login_from">
                <!-- 用户名 -->
                <el-form-item  prop="username">
                    <el-input
                     prefix-icon="el-icon-s-custom"
                     v-model="LoginForm.username"
                     ></el-input>
                </el-form-item>
                <!-- 密码 -->
                 <el-form-item prop="password">
                    <el-input
                     prefix-icon="el-icon-s-cooperation"
                     v-model="LoginForm.password"
                     type="password"
                     ></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-row class="login_but">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="loginResetFields">重置</el-button>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      // 登录数据绑定表单
      LoginForm: {
        username: 'admin',
        password: '123456'
      },
      // 验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //   重置
    loginResetFields() {
      this.$refs.loginResetFields.resetFields()
    },
    //   登录
    login() {
      this.$refs.loginResetFields.validate(async valida => {
        // console.log(valida)
        let { username, password } = this.LoginForm
        if (!valida) return
        const {data:res} =await this.$http.post('login',this.LoginForm);
         if (res.meta.status !== 200)
          return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login-img {
  width: 150px;
  height: 150px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.login-img img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_from {
  margin-top: 100px;
  width: 430px;
  margin-left: 10px;
  position: relative;
}
.login_from .login_but {
  position: absolute;
  right: 0;
}
</style>
