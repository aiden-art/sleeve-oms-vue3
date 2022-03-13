<!--
 * @Author: genfa.zeng
 * @Date: 2021-02-01 14:59:26
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2022-03-13 15:08:15
 * @Description: 
-->
<template>
  <el-container class="home-page">
    <el-aside :width="sideBarWidth" class="home-aside">
      <side-bar :is-collapse="isCollapse"></side-bar>
    </el-aside>
    <el-container class="home-container">
      <el-header class="home-header">
        <i :class="['iconfont iconmenufold', isCollapse ? 'icon-rotate' : '']" @click="handleMenuCollapse"></i>
        <nav-header></nav-header>
      </el-header>
      <el-main>
        <app-main></app-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import NavHeader from './components/navHeader/index.vue'
import SideBar from './components/sideBar/index.vue'
import AppMain from './components/AppMain.vue'
import { useGlobalData } from '@/store/global'
export default defineComponent({
  name: 'Home',
  components: { NavHeader, SideBar, AppMain },
  setup() {
    const globalData = useGlobalData()
    const isCollapse = ref(false)

    const sideBarWidth = computed(() => {
      return isCollapse.value ? '64px' : '210px'
    })

    function handleMenuCollapse() {
      const isCollapseValue = isCollapse.value
      isCollapse.value = !isCollapseValue
    }

    // 初始化全局数据
    function initGlobalData() {
      globalData.getStoreSubCategoryList()
      globalData.getStoreSpuList()
    }

    initGlobalData()

    return {
      sideBarWidth,
      isCollapse,
      handleMenuCollapse,
    }
  },
})
</script>
<style lang="scss" src="./index.scss"></style>
