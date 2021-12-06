<template>
  <div class="login">
    <div class="loginbox">
      <div class="imagediv">
        <img src="../assets/logo.png" alt="" class="image">
      </div>
      <el-form class="loginform" :model="form" :rules="rules" ref="formref" status-icon>
        <el-form-item prop="name">
          <el-input prefix-icon="iconfont icon-user" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="loginbutton">
          <el-button type="primary" @click="checkdata">登录</el-button>
          <el-button type="info" @click="resetdata">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      form:{
        name:'admin',
        password:'123456'
      },
      rules:{
        name:[
          { required: true, message: '请输入登陆账号', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    resetdata(){
      this.$refs.formref.resetFields()
    },
    checkdata(){
      this.$refs.formref.validate(async vali=>{
        if(!vali)return
        const {data:res} = await this.$http.post('login',{username:this.form.name,password:this.form.password})
        console.log(res);
        if(res.meta.status===200){
          this.$message.success('登陆成功')
          window.sessionStorage.setItem('token',res.data.token)
          this.$router.push('/home')
        }
        else this.$message.error('登陆失败')
      })
    }
  }
};
</script>

<style scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
}
.loginbox {
  height: 350px;
  width: 550px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
}
.imagediv {
  height: 150px;
  width: 150px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
.image {
  border-radius: 50%;
  height: 100%;
  width: 100%;
  background-color: #eee;
}
.loginform{
  position:absolute;
  bottom:20px;
  width:100%;
  padding:0 20px;
  box-sizing: border-box;
}
.loginbutton{
  display: flex;
  justify-content: flex-end;
}
</style>