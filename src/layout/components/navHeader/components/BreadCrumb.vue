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
      <el-breadcrumb-item v-for="(item, index) in routeMatched" :key="index" :to="item.path">
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { RouteLocationMatched, useRoute } from 'vue-router'
export default defineComponent({
  name: 'BreadCrumb',
  setup() {
    const route = useRoute()
    let routeMatched = ref<RouteLocationMatched[]>([])

    watch(
      () => route.matched,
      () => {
        routeMatched.value = route.matched
      },
      {
        immediate: true,
        deep: true,
      }
    )
    return {
      routeMatched,
    }
  },
})
</script>

<style lang="scss" scoped>
:deep(.el-breadcrumb__inner):hover {
  color: $theme;
}
</style>
