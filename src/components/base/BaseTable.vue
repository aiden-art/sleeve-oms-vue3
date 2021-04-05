<template>
  <div class="base-table">
    <el-table :ref="baseTableRef" :data="tableData">
      <el-table-column
        v-for="(item, index) in tableColumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
      ></el-table-column>
      <el-table-column v-if="operate.length > 0" label="操作" fixed="right" width="275">
        <el-button
          v-for="(item, index) in operate"
          :key="index"
          :type="item.type"
          plain
          size="mini"
        >
          {{ item.name }}
        </el-button>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
    props: {
      tableColumn: {
        type: Array,
        default: () => [],
      },
      tableData: {
        type: Array,
        default: () => [],
      },
      operate: {
        type: Array,
        default: () => [],
      },
    },
    setup() {
      const baseTableRef = ref(null)
      return {
        baseTableRef,
      }
    },
  })
</script>
<style lang="scss"></style>
