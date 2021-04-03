<template>
  <div v-if="!item.hidden">
    <!-- 首页不需要el-submenu组件 -->
    <template v-if="item.path === '/'">
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        class="menu-item"
      />
    </template>
    <template v-else-if="!item.children">
      <app-link
        v-if="item.meta"
        :to="item.path"
        :class="isHomePath(item.path) ? '' : 'menu-item-link'"
      >
        <el-menu-item :index="item.path">
          <template #title>
            <i :class="item.meta.icon"></i>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="item.path" popper-append-to-body>
      <template #title>
        <i :class="item.meta.icon"></i>
        <span>{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        class="menu-item"
      />
    </el-submenu>
  </div>
</template>

<script lang="ts">
  import AppLink from './Link.vue'
  import { defineComponent, PropType } from 'vue'
  import { RouteRecordRaw } from 'vue-router'
  export default defineComponent({
    name: 'SidebarItem',
    components: { AppLink },
    props: {
      item: {
        type: Object as PropType<RouteRecordRaw>,
        required: true,
      },
    },
    setup() {
      function isHomePath(path: string) {
        return path === '/dashboard'
      }
      return {
        isHomePath,
      }
    },
  })
</script>
