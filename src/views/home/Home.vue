<template>
  <div>
    <el-button type="primary" round @click="loginout">主要按钮</el-button>
  </div>
</template>

<script>
export default {
  methods:{
    loginout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>