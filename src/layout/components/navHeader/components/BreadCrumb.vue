<!--
 * @Author: genfa.zeng
 * @Date: 2021-04-01 10:26:42
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-04-01 17:51:11
 * @Description: 面包屑组件
-->
<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'BreadCrumb',
  })
</script>

<style lang="scss" scoped>
  :deep(.el-breadcrumb__inner):hover {
    color: $theme;
  }
</style>
