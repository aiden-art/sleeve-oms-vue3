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
        <template #default="scope">
          <el-button
            v-for="(item, index) in operate"
            :key="index"
            :type="item.type"
            plain
            size="mini"
            @click="handleOperate(item.func, scope.$index, scope.row)"
          >
            {{ item.name }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="isShowPagination"
      class="base-paganation"
      backgorund
      layout="prev,pager,next"
      :page-size="pagination.pageSize || 10"
      :total="pagination.total"
      :current-page="pagination.currentPage || 1"
      @current-change="currentChange"
    >
    </el-pagination>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { paginationOption, operateType, operateFunc } from '@/types'
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
      type: Array as PropType<operateType[]>,
      default: () => [],
    },
    isShowPagination: {
      type: Boolean,
      default: true,
    },
    pagination: {
      type: Object as PropType<paginationOption>,
      default: () => ({}),
    },
  },
  emits: ['current-change'],
  setup(props, { emit }) {
    const baseTableRef = ref(null)

    function currentChange() {
      emit('current-change')
    }

    function handleOperate(fnuc: operateFunc, index: number, row: Record<string, unknown>) {
      fnuc(index, row)
    }

    return {
      baseTableRef,
      currentChange,
      handleOperate,
    }
  },
})
</script>
<style lang="scss"></style>
