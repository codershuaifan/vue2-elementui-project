<template>
  <el-container class="homecontainer">
    <!-- 头部 -->
    <el-header>
      <img src="../../image/home/小帆的图书馆图标.png" alt="" class="logo" />
      <div class="headertxt">电商后台管理系统</div>
      <el-button type="primary" round @click="loginout">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse?'64px':'200px'">
        <div class="toggle" @click="iscollapsemethod">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="iscollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="defaultactive"
        >
          <!-- 一级菜单 -->
          <el-submenu v-for="(item,index) in menuslist" :index="item.id+''" :key="item.id">
            <template slot="title">
              <i :class="iconlist[index]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+itemch.path" v-for="itemch in item.children" :key="itemch.id" @click="active('/'+itemch.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{itemch.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuslist: [],
      iconlist:['iconfont icon-user','iconfont icon-tijikongjian','iconfont icon-shangpin',
      'iconfont icon-danju','iconfont icon-baobiao'],
      iscollapse:false,
      defaultactive:''
    };
  },
  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getmenus() {
      const { data: res } = await this.$http.get("menus");
      if(res.meta.status!==200)return this.$message.error('获取菜单列表失败')
      this.menuslist = res.data;
      // console.log(this.menuslist);
    },
    iscollapsemethod(){
      this.iscollapse=!this.iscollapse
    },
    active(index){
      this.defaultactive=index
      window.sessionStorage.setItem('activepath',index)
    }
  },
  created() {
    this.getmenus();
    this.defaultactive=window.sessionStorage.getItem('activepath')
  },
};
</script>

<style scoped>
.homecontainer {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  height: 60px;
  display: flex;
  align-items: center;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.logo {
  height: 60px;
  width: 60px;
  border-radius: 50%;
}
.headertxt {
  color: #fff;
  font-size: 1.6em;
  margin-left: 10px;
}
.el-button {
  position: absolute;
  right: 10px;
}
.iconfont{
  margin-right: 10px;
}
.el-menu{
  border-right: none;
}
.toggle{
  width: 100%;
  background-color: #4a5064;
  color:#fff;
  text-align: center;
  line-height: 40px;
  font-size: 20px;
  letter-spacing: 0.2em;
}
</style>