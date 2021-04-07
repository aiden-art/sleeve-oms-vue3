<template>
  <div class="banner-list">
    <template v-if="!isEdit">
      <base-table
        :table-column="tableColumn"
        :operate="operate"
        :table-data="tableData"
        :pagination-option="paginationOption"
      ></base-table>
    </template>
    <banner-modify v-else :banner-id="currentRow.id" @on-back="onBack"></banner-modify>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue'
  import Banner from '../../api/banner'
  import { BannerModel } from '../../api/banner/model'
  import { paginationOption } from '../../types'
  import BaseTable from '@/components/base/BaseTable.vue'
  import bannerModify from './bannerModify.vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  export default defineComponent({
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

      const operate = [
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

      const tableData = ref<BannerModel[]>([])

      const paginationOption: paginationOption = reactive({
        pageSize: 10,
        currentPage: 1,
        total: 0,
      })

      const isEdit = ref(false)

      let currentRow = ref()

      async function getBannerList() {
        let result = await Banner.getBanners()
        tableData.value = result.data.items
        paginationOption.total = result.data.total
      }

      async function deleteBanner(id: number) {
        let result = await Banner.deleteBanner(id)
        ElMessage.success(`${result.data.message}`)
        //刷新列表
        getBannerList()
      }

      function handleEdit(index: number, row: Record<string, unknown>) {
        isEdit.value = true
        currentRow.value = row
      }

      function handleDelete(index: number, row: Record<string, any>) {
        ElMessageBox.confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            deleteBanner(row.id)
          })
          .catch(() => {
            //
          })
      }

      //返回列表页
      function onBack() {
        isEdit.value = false
      }

      getBannerList()

      return {
        tableColumn,
        operate,
        tableData,
        paginationOption,
        isEdit,
        currentRow,
        onBack,
      }
    },
  })
</script>
<style lang="scss"></style>
