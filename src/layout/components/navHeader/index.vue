<!--
 * @Author: genfa.zeng
 * @Date: 2021-02-01 14:33:49
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-04-01 17:33:14
 * @Description: 
-->
<template>
  <div class="nav-header">
    <bread-crumb></bread-crumb>
    <div class="nav-header__right">
      <notify-box></notify-box>
      <clear-tab></clear-tab>
      <screenfull-box></screenfull-box>
      <user-avatar></user-avatar>
    </div>
  </div>
</template>

<script lang="ts">
import BreadCrumb from './components/BreadCrumb.vue'
import NotifyBox from './components/notifyBox/index.vue'
import ClearTab from './components/ClearTab.vue'
import ScreenfullBox from './components/ScreenFullBox.vue'
import UserAvatar from './components/UserAvatar.vue'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'NavHeader',
  components: { BreadCrumb, NotifyBox, ClearTab, ScreenfullBox, UserAvatar },
  setup() {
    return {
      searchVal: ref(''),
    }
  },
})
</script>
<style lang="scss" src="./index.scss"></style>
