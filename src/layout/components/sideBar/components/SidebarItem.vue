<!--
 * @Author: genfa.zeng
 * @Description: SideBarItem组件
 * @Date: 2021-12-06 14:51:01
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-12-07 14:50:45
 * @FilePath: /fengxiu-oms/src/layout/components/sideBar/components/SidebarItem.vue
-->
<template>
  <div v-if="!item.meta?.hidden" :class="[isCollapse ? 'simple-mode' : 'full-mode', { 'first-level': isFirstLevel }]">
    <!-- 首页不需要el-sub-menu组件 -->
    <template v-if="item.path === '/'">
      <sidebar-item v-for="child in item.children" :key="child.path" :item="child" class="menu-item" />
    </template>
    <template v-else-if="!item.children">
      <app-link v-if="item.meta" :to="item.path" :class="isHomePath(item.path) ? '' : 'menu-item-link'">
        <el-menu-item :index="item.path">
          <el-icon v-if="item.meta?.icon">
            <component :is="item.meta?.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </app-link>
    </template>
    <el-sub-menu v-else ref="sub-menu" :index="item.path">
      <template #title>
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta?.icon"></component>
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :is-first-level="false"
        :is-collapse="isCollapse"
        class="menu-item"
      />
    </el-sub-menu>
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
    isFirstLevel: {
      type: Boolean,
      required: true,
    },
    isCollapse: {
      type: Boolean,
      required: false,
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
<style lang="scss">
.full-mode {
  .menu-item .el-sub-menu > .el-sub-menu__title,
  .el-sub-menu .el-menu-item {
    min-width: 210px !important;
  }
  .el-menu-item {
    & > span {
      display: inline-block;
      padding-left: 5px;
    }
  }
  .el-submenu {
    overflow: hidden;
    & > .el-submenu__title {
      .el-sub-menu__icon-arrow {
        display: none;
      }
      & > span {
        padding-left: 5px;
      }
    }
  }
}
.simple-mode {
  &.first-level {
    .sub-menu-title-noDropdown {
      padding: 0 !important;
      position: relative;
      .el-tooltip {
        padding: 0 !important;
      }
    }
    .el-sub-menu {
      overflow: hidden;
      & > .el-sub-menu__title {
        .el-sub-menu__icon-arrow {
          display: none;
        }
        & > span {
          visibility: hidden;
        }
      }
    }
  }
}
</style>
