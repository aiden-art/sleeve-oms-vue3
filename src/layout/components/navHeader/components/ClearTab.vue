<!--
 * @Author: genfa.zeng
 * @Date: 2021-04-01 10:48:48
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-04-01 17:38:35
 * @Description: 清空历史记录
-->
<template>
  <div title="关闭全部历史记录" class="clear-tab" @click="clearTab">
    <i class="iconfont iconmoshubang"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ClearTab',
  setup() {
    const clearTab = () => {
      return ''
    }
    return {
      clearTab,
    }
  },
})
</script>

<style lang="scss" scoped>
.clear-tab {
  cursor: pointer;
  margin-right: 20px;
  .iconmoshubang {
    display: inline-block;
    font-size: 20px;
  }
}
</style>
