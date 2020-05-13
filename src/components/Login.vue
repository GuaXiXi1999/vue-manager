<template>
      <!--背景-->
      <div class="login_container">
        <!--垂直居中box-->
        <div class="login_box">
          <!--v-model:表单数据对象 rules表单验证规则  prop: 必填项-->
          <el-form :model="loginForm" :rules="rules" ref="LoginForm" label-width="100px" class="demo-ruleForm">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" prefix-icon="icon iconfont icon-user"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" prefix-icon="icon iconfont icon-3702mima"></el-input>
            </el-form-item>
            <el-form-item class="btns">
              <el-button type="primary" @click="submitForm">登录</el-button>
              <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
</template>

<script>
    export default {
      name: 'Login',
      data() {
        return {
          loginForm:{
            username:'admin',
            password:'123456'
          },
          rules: {
            username: [
              // required是否必填， message：提示， trigger：何时判断 blur： 失焦时判断
              { required: true, message: '请输入活动名称', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
            ]
          }
        }
      },
      methods:{
        resetLoginForm() {
          console.log(this.$refs.LoginForm)
          // 重置表单 使用this.$refs 获取dom对象
          this.$refs.LoginForm.resetFields()
        },
        // 点击登录验证
        submitForm() {
          // valid 如果 校验规则都符合 则为 true 否则为false
          this.$refs.LoginForm.validate(async valid => {
            // 成功
            if (valid) {
              // async  await 简化异步操作 看起来更像是同步操作
              const { data: res } = await this.$http.post('login', this.loginForm)
              // console.log(res)
              if (res.meta.status === 200) {
                console.log(res.data)
                this.$message({
                  message: '恭喜你，登陆成功',
                  type: 'success'
                })
                // 保存token值 保存登录的状态
                window.sessionStorage.setItem('token', res.data.token)
                //  编程式导航 跳转
                this.$router.push('/Home')
              } else {
                console.log(res.meta.msg)
                this.$message.error(res.meta.msg)
              }
            } else {
              return false
            }
          })
        }
      }

    }
</script>

<style scoped lang="less">

  .login_container{
    width: 100%;
    height: 100%;
    background-color: #0da0b4;
    /*position: relative;*/
    .login_box{
      width: 400px;
      height: 300px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      /*padding-top: 100px;*/
      padding-left: 30px;
      padding-right: 30px;
      form{
        width: 370px;
        position: absolute;
        top: 20%;
        .is-success{
          border: 1px solid chartreuse;
          border-radius: 4px;
        }

      }
    }
    .btns{
      display: flex;
      justify-content: center;
    }
  }
  .el-form-item__content{
    margin-left: 0!important;
  }
</style>
