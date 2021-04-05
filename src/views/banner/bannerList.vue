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
    <banner-modify v-else :banner-id="currentRow.id"></banner-modify>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue'
  import Banner from '../../api/banner'
  import { BannerModel } from '../../api/banner/model'
  import { paginationOption } from '../../types'
  import BaseTable from '@/components/base/BaseTable.vue'
  import bannerModify from './bannerModify.vue'
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

      function handleEdit(index: number, row: Record<string, unknown>) {
        isEdit.value = true
        currentRow.value = row
      }

      getBannerList()

      return {
        tableColumn,
        operate,
        tableData,
        paginationOption,
        isEdit,
        currentRow,
      }
    },
  })
</script>
<style lang="scss"></style>
