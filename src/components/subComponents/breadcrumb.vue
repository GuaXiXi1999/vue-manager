<template>
  <div>
    <!-- 1.面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <!-- 父传子 -->
      <el-breadcrumb-item>{{ firstName }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ twoName }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

</template>

<script>
    export default {
        name: 'breadcrumb',
      props: ['firstName', 'twoName']
    }
</script>

<style scoped>

</style>
