<template>
  <div class="banner-list">
    <base-table :table-column="tableColumn" :operate="operate" :table-data="tableData"></base-table>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import Banner from '../../api/banner'
  import { BannerModel } from '../../api/banner/model'
  import BaseTable from '@/components/base/BaseTable.vue'

  export default defineComponent({
    components: { BaseTable },
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
          name: '查看',
        },
        {
          type: 'warning',
          name: '删除',
        },
      ]
      const tableData = ref<BannerModel[]>([])

      async function getBannerList() {
        let result = await Banner.getBanners()
        tableData.value = result.data.items
      }

      getBannerList()

      return {
        tableColumn,
        operate,
        tableData,
      }
    },
  })
</script>
<style lang="scss"></style>
