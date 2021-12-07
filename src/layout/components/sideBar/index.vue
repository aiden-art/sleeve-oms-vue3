<!--
 * @Author: genfa.zeng
 * @Date: 2021-02-01 14:32:54
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-04-01 10:41:07
 * @Description: 菜单栏
-->
<template>
  <div class="side-bar">
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      background-color="#192a5e"
      :unique-opened="false"
      text-color="rgba(196,201,210,1)"
      active-text-color="#1890ff"
      mode="vertical"
    >
      <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SidebarItem from './components/SidebarItem.vue'
function increaseIndexes<T>(val: Array<T>): Array<T> {
  return Object.keys(val)
    .map((v: any) => {
      return {
        ...val[v],
        key: v,
      }
    })
    .filter((v: any) => v.meta.showLink)
}
export default defineComponent({
  name: 'Sidebar',
  components: { SidebarItem },
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const router = useRouter().options.routes

    const route = useRoute()

    const activeMenu = computed(() => {
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })

    const routes = computed(() => increaseIndexes(router))
    return {
      routes,
      activeMenu,
    }
  },
})
</script>
<style lang="scss" src="./index.scss"></style>
