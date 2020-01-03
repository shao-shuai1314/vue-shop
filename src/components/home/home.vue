<template>
  <el-container class="home_box">
    <!-- 头部 -->
  <el-header>
    <div>
      <img src="../../assets/logo.png"/>
      <span>管理系统</span>
    </div>
     <el-button @click="logout" type="info">退出</el-button>
  </el-header>
  <!-- 主体 -->
  <el-container>
    <!-- 侧边导航 -->
    <el-aside :width="isCollapse ? '64px':'200px'">
      <div class="toddle-button" @click ="toggleChange">|||</div>
      <!-- 侧边栏 -->
          <el-menu
          :unique-opened="true"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse = "isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
          >
          <!-- 一级菜单 -->
          <el-submenu :index="'/'+item.path" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
             <!-- 二级菜单 -->
              <el-menu-item 
              :index="'/'+subItem.path" 
              v-for="subItem in item.children" 
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
              >
                   <!-- 图标 -->
                    <i class="el-icon-menu"></i>
                    <!-- 文本 -->
                    <span>{{subItem.authName}}</span>
              </el-menu-item>
          </el-submenu>
        </el-menu>
    </el-aside>
    <!-- 内容 -->
    <el-main>
      <!-- 路由占位符 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  name: 'home',
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      // 导航列表
      menulist:[],
      // 是否水平折叠收起菜单
      isCollapse:false,
      // 被激活链接地址
      activePath:'',
      iconsObj:{
        '125':'el-icon-s-custom',
        '103':'el-icon-ice-cream-round',
        '101':'el-icon-shopping-bag-1',
        '102':'el-icon-s-order',
        '145':'el-icon-data-line',
      }
    }
  },
  methods: {
    // 退出
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleChange(){
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath){
       window.sessionStorage.setItem('activePath',activePath)
       this.activePath = activePath
    },
    // 获取侧边导航列表
    async getMenuList(){
      const {data:res}  = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.met.msg)
      this.menulist = res.data
      // console.log(res)
    }
  }
}
</script>
<style scoped>
.el-header{
 background-color: #373d41;
 display: flex;
 justify-content: space-between;
 padding-left: 0;
 align-items: center;
 color: #fff;
 font-size: 20px;
}
.el-header>div{
  display: flex;
  align-items: center
}
.el-header>div>span{
  padding-left: 10px
}
.el-header>div>img{
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.el-aside{
  background-color: #333744
}
.el-menu{
  border-right: none
}
.el-main{
  background-color: #eaedf1
}
.home_box{
  height: 100%;
}
.home_box i{
  margin-right: 6px;
}
.toddle-button{
  background-color:#4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>

