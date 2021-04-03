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
  import screenfull from 'screenfull'
  import { ElMessage } from 'element-plus'
  import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
  export default defineComponent({
    name: 'SceenFull',
    setup() {
      const isFullscreen = ref(false)
      const change = () => {
        isFullscreen.value = screenfull.isFullscreen
      }
      const destory = () => {
        if (screenfull.enabled) {
          screenfull.off('change', change)
        }
      }
      const handleFullScreen = () => {
        if (!screenfull.enabled) {
          ElMessage.warning({
            message: 'you browser can not work',
            type: 'warning',
          })
          return false
        }
        screenfull.toggle()
      }
      const init = () => {
        if (screenfull.isEnabled) {
          screenfull.on('change', change)
        }
      }
      onMounted(() => {
        init()
      })
      onUnmounted(() => {
        destory()
      })

      return {
        handleFullScreen,
        isFullscreen,
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
