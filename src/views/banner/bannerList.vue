<template>
  <div class="banner-list">
    <template v-if="!isEdit">
      <base-table
        :table-column="tableColumn"
        :operate="operateList"
        :table-data="tableData"
        :pagination="pagination"
      ></base-table>
    </template>
    <banner-modify v-else :banner-id="currentRow.id" @on-back="onBack"></banner-modify>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { paginationOption } from '@/types'
import { BannerModel, deleteBannerApi, getBannersApi } from '@/api/banner'
import { ElMessageBox, ElMessage } from 'element-plus'
import BaseTable from '@/components/base/BaseTable.vue'
import bannerModify from './bannerModify.vue'
export default defineComponent({
  //banner列表
  name: 'BannerList',
  components: { BaseTable, bannerModify },
  setup() {
    const tableColumn = [
      {
        prop: 'id',
        label: 'id',
      },
      {
        prop: 'img',
        label: '图片',
      },
      {
        prop: 'name',
        label: '名称',
      },
      {
        prop: 'description',
        label: '描述',
      },
    ]

    const tableData = ref<BannerModel[]>([])

    const pagination: paginationOption = reactive({
      pageSize: 10,
      currentPage: 1,
      total: 0,
    })

    const isEdit = ref(false)

    const currentRow = ref()

    const getList = async () => {
      let { data: response } = await getBannersApi()
      tableData.value = response.data.list
      pagination.total = response.data.total
    }

    const handleEdit = (index: number, row: Record<string, unknown>) => {
      isEdit.value = true
      currentRow.value = row
    }

    const handleDelete = (index: number, row: Record<string, any>) => {
      ElMessageBox.confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: response } = await deleteBannerApi(row.id)
          ElMessage.success(`${response.message}`)
          //刷新列表
          getList()
        })
        .catch(() => {
          //
        })
    }

    const operateList = [
      {
        type: 'primary',
        name: '编辑',
        func: handleEdit,
      },
      {
        type: 'danger',
        name: '删除',
        func: handleDelete,
      },
    ]

    const onBack = () => {
      isEdit.value = false
    }

    getList()

    return {
      tableColumn,
      operateList,
      tableData,
      pagination,
      isEdit,
      currentRow,
      onBack,
    }
  },
})
</script>
<style lang="scss"></style>
