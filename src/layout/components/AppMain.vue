<!--
 * @Author: genfa.zeng
 * @Description: AppMain组件
 * @Date: 2021-12-06 14:48:02
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-12-07 14:46:13
 * @FilePath: /fengxiu-oms/src/layout/components/AppMain.vue
-->
<template>
  <section class="app-main">
    <router-view :key="key" v-slot="{ Component }">
      <transition appear name="fade-transform" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'AppMain',
  setup() {
    const route = useRoute()
    const key = computed(() => route.path)
    return { key }
  },
})
</script>

<style scoped>
.app-main {
  min-height: calc(100vh - 70px);
  width: 100%;
  position: relative;
  overflow-x: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
