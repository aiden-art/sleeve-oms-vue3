<!--
 * @Author: genfa.zeng
 * @Date: 2021-02-01 14:59:26
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-04-01 17:25:12
 * @Description: 
-->
<template>
  <el-container class="home-page">
    <el-aside class="home-aside">
      <side-bar></side-bar>
    </el-aside>
    <el-container class="home-container">
      <el-header class="home-header">
        <i class="iconfont iconmenufold"></i>
        <nav-header></nav-header>
      </el-header>
      <el-main>
        <app-main></app-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import NavHeader from './components/navHeader/index.vue'
  import SideBar from './components/sideBar/index.vue'
  import AppMain from './components/AppMain.vue'
  export default defineComponent({
    name: 'Home',
    components: { NavHeader, SideBar, AppMain },
    setup() {
      return {}
    },
  })
</script>
<style lang="scss" src="./index.scss"></style>
