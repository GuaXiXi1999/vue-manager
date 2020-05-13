<template>
      <el-container>
        <!-- 头部区域 -->
        <el-header>
          <div>
            <img src="../assets/logo.png" alt="">
            <span>电商后台管理系统</span>
          </div>
          <el-button type="info">退出</el-button>
        </el-header>
        <el-container>
          <!-- 左侧导航栏区域 -->
          <el-aside width="200px">
            <!-- unique-opened属性 是否只保持一个子菜单为打开状态 -->
            <el-menu
              :collapse="myCollapse"
              :collapse-transition="false"
              router
              :default-active="activeIndex"
              unique-opened
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#409eff">
              <div class="collapse" @click="isCollapse">|||</div>

              <!-- index属性代表唯一性 -->
              <el-submenu :index="item.id+''" v-for="(item) in menuList" :key="item.id">
                <template slot="title">
                  <i :class="iconsObj[item.id]"></i>
                  <span class="listSpan">{{ item.authName }}</span>
                </template>
                  <el-menu-item
                    :index="'/'+subItem.path"
                    v-for="(subItem) in item.children"
                    :key="subItem.id"
                    @click="saveStatus('/'+subItem.path)"
                  >
                    <i class="el-icon-menu"></i>
                    <span>{{ subItem.authName }}</span>
                  </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-aside>
          <!-- 内容主体区域 -->
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
</template>

<script>
    export default {
      name: 'Home',
      data() {
        return {
          menuList:[],
          iconsObj: {
            125:'iconfont icon-user',
            103:'iconfont icon-tijikongjian',
            101:'iconfont icon-shangpin',
            102:'iconfont icon-danju',
            145:'iconfont icon-baobiao'
          },
          myCollapse: false,
          activeIndex: ''
        }
      },
      methods: {
        // 获取左侧菜单栏数据
        async getMenuList() {
          const { data: res } = await this.$http.get('menus')
          if (res.meta.status !== 200) return this.$message(res.meta.msg)
          this.menuList = res.data
          // console.log(res.data)
        },
        // 点击收缩 侧边菜单
        isCollapse() {
          this.myCollapse = !this.myCollapse
        },
        // 二级菜单默认高亮显示 保存二级菜单的index值
        saveStatus(activeIndex) {
          this.activeIndex = activeIndex
          // 保存到本地 用于页面初始化时 设置对应的二级菜单高亮显示
          window.sessionStorage.setItem('activeIndex', activeIndex)
        }
      },
      created() {
        this.getMenuList()
        // this.saveStatus()
        // 页面刷新时 让对应的二级菜单高亮显示
        this.activeIndex = window.sessionStorage.getItem('activeIndex')
      }
    }
</script>

<style scoped lang="less">
  .el-container{
    height: 100%;
    .el-header{
      background-color: #373D47;
      display: flex;
      justify-content: space-between; // 两端对齐
      align-items: center;
      color: white;
      font-size: 20px;
      > div{
        display: flex;
        align-items: center;
        img{
          width: 40px;
          margin-right: 30px;
        }
      }
    }
  }
  .listSpan{
     padding-left: 10px;
   }
  .collapse{
    text-align: center;
    color: white;
  }
</style>
