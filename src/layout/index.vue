<!--
 * @Author: genfa.zeng
 * @Date: 2021-02-01 14:59:26
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-04-01 17:25:12
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
export default defineComponent({
  name: 'Home',
  components: { NavHeader, SideBar, AppMain },
  setup() {
    const isCollapse = ref(false)

    const sideBarWidth = computed(() => {
      return isCollapse.value ? '64px' : '210px'
    })

    function handleMenuCollapse() {
      const isCollapseValue = isCollapse.value
      isCollapse.value = !isCollapseValue
    }

    return {
      sideBarWidth,
      isCollapse,
      handleMenuCollapse,
    }
  },
})
</script>
<style lang="scss" src="./index.scss"></style>
