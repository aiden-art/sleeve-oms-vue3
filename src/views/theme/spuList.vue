<!--
 * @Author: genfa.zeng
 * @Date: 2022-02-27 13:46:51
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2022-02-27 13:46:51
 * @FilePath: /sleeve-oms/src/views/theme/spuList.vue
 * @Description: Theme下SPU管理页面
-->
<template>
  <div class="theme-spu-list">
    <div class="flex w-1/3 mb-4">
      <el-input v-model="state.spuId"></el-input>
      <el-button size="small" type="primary" @click="handleAddThemeSpu">添加SPU</el-button>
    </div>
    <el-card class="spec-list__table" shadow="hover">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="img" label="主图">
          <template #default="scope">
            <el-image
              v-if="scope.row.img"
              class="block max-w-1/5"
              :src="scope.row.img"
              :preview-src-list="[scope.row.img]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="subtitle" label="副标题" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button class="font-normal" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { get as lodashGet } from 'lodash'
import { addThemeSpuApi, getThemeSpuListApi, deleteThemeSpuApi } from '@/api/theme'
import { useRoute } from 'vue-router'
import { SpuModel } from '@/api/spu'
import { SUCCESS_CODE } from '@/config/constant'
import { ElMessage } from 'element-plus'

type IdType = number | undefined
export default defineComponent({
  name: 'ThemeSpuList',
  setup() {
    const route = useRoute()
    const state = reactive({
      tableData: [] as SpuModel[],
      spuId: undefined as IdType,
      themeId: Number(route.params.themeId),
    })

    const getThemeSpuList = async () => {
      try {
        let res = await getThemeSpuListApi(state.themeId)
        const code = lodashGet(res, 'data.code')
        const data = lodashGet(res, 'data.data')
        if (code === SUCCESS_CODE) {
          state.tableData = data
        }
      } catch (e) {}
    }

    const handleDelete = async (row: SpuModel) => {
      try {
        if (row.id) {
          let res = await deleteThemeSpuApi(state.themeId, row.id)
          const code = lodashGet(res, 'data.code')
          if (code === SUCCESS_CODE) {
            ElMessage.success('删除成功')
            getThemeSpuList()
          }
        }
      } catch (e) {}
    }

    const handleAddThemeSpu = async () => {
      try {
        if (state.spuId) {
          let res = await addThemeSpuApi(state.themeId, state.spuId)
          const code = lodashGet(res, 'data.code')
          if (code === SUCCESS_CODE) {
            ElMessage.success('新增成功')
            getThemeSpuList()
          }
        }
      } catch (e) {}
    }
    getThemeSpuList()

    return {
      ...toRefs(state),
      handleDelete,
      handleAddThemeSpu,
    }
  },
})
</script>

<style></style>
