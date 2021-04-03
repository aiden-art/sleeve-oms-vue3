<!--
 * @Author: genfa.zeng
 * @Date: 2021-02-01 10:14:04
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-02-01 16:51:45
 * @Description: 
-->
<template>
  <h1>{{ msg }}</h1>
  <i style="font-size: 16px" class="iconfont icongonggao"></i>
  <el-button>默认按钮</el-button>
</template>

<script lang="ts">
  import { ref, defineComponent } from 'vue'

  export default defineComponent({
    name: 'HelloWorld',
    props: {
      msg: {
        type: String,
        required: true,
      },
    },
    setup: () => {
      const count = ref(0)
      return { count }
    },
  })
</script>

<style scoped lang="scss"></style>
