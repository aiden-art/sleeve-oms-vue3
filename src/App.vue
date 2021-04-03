<!--
 * @Author: genfa.zeng
 * @Date: 2021-02-01 10:14:04
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-02-01 15:52:48
 * @Description: 
-->
<template>
  <router-view></router-view>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'App',
  })
</script>

<style lang="scss">
  #app {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
</style>
