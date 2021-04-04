<!--
 * @Author: genfa.zeng
 * @Date: 2021-04-01 10:55:43
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-04-01 17:45:33
 * @Description: 全屏组件
-->
<template>
  <div class="screenfull-box" title="全屏/正常">
    <i
      class="iconfont"
      :class="isFullscreen ? 'iconexitfullscreen' : 'iconfullscreen'"
      @click="handleFullScreen"
    ></i>
  </div>
</template>

<script lang="ts">
  import screenfull, { Screenfull } from 'screenfull'
  import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
  export default defineComponent({
    name: 'SceenFull',
    setup() {
      let isFullscreen = ref(false)
      const handleFullScreen = () => {
        if (!screenfull.isEnabled) return
        screenfull.toggle()
      }
      const change = () => {
        isFullscreen.value = (screenfull as Screenfull).isFullscreen
      }
      const init = () => {
        if (screenfull.isEnabled) {
          screenfull.on('change', change)
        }
      }
      const destroy = () => {
        if (screenfull.isEnabled) {
          screenfull.off('change', change)
        }
      }
      onMounted(() => {
        init()
      })
      onUnmounted(() => {
        destroy()
      })
      return {
        isFullscreen,
        handleFullScreen,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .screenfull-box {
    margin-right: 20px;
    cursor: pointer;
    i {
      font-size: 22px;
      font-weight: 600;
    }
  }
</style>
