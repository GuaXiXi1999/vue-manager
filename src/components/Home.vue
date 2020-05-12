<template>
      <el-container>
        <el-header>
          <div>
            <img src="../assets/logo.png" alt="">
            <span>电商后台管理系统</span>
          </div>
          <el-button type="info">退出</el-button>
        </el-header>
        <el-container>
          <el-aside width="200px">Aside</el-aside>
          <el-main>Main</el-main>
        </el-container>
      </el-container>
</template>

<script>
    export default {
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
</style>
