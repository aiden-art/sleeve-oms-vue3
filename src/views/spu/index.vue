<template>
  <div class="spu-list">
    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" :close-on-click-modal="false">
      <SpuForm v-if="dialogVisible" ref="SpuFormRef" :default-data="currentRow" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-row class="mb-4">
      <el-col :span="24">
        <el-button size="small" type="primary" @click="handleCreate">添加SPU</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-card class="spec-list__table" shadow="hover">
      <template v-if="tableData.length === 0">
        <el-skeleton :rows="10" animated />
      </template>
      <template v-else>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="title" show-overflow-tooltip label="标题" align="center" />
          <el-table-column prop="subtitle" show-overflow-tooltip label="副标题" align="center" />
          <el-table-column prop="img" label="图片" align="center">
            <template #default="scope">
              <el-image
                v-if="scope.row.img"
                class="inline-block w-60"
                :src="scope.row.img"
                :preview-src-list="[scope.row.img]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="categoryId" label="分类" align="center">
            <template #default="scope">
              {{ globalDataStore.subCategoryMap.get(scope.row.categoryId) }}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格(元)" align="center" />
          <el-table-column prop="online" label="是否上架" align="center">
            <template #default="scope">
              <el-switch :model-value="scope.row.online" :active-value="1" :inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button class="font-normal" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button class="font-normal" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          small
          background
          :page-sizes="[10, 20, 50, 100]"
          class="spec-list__pagination"
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </template>
    </el-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, watch, reactive } from 'vue'
import { get as lodashGet } from 'lodash'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSpuListApi, deleteSpuApi, SpuModel, updateSpuApi, createSpuApi, getSpuApi } from '@/api/spu'
import { SUCCESS_CODE } from '@/config/constant'
import SpuForm from './components/SpuForm.vue'
import { useGlobalData } from '@/store/global'

type SpuForm = InstanceType<typeof SpuForm>

export default defineComponent({
  name: 'SkuList',
  components: { SpuForm },
  setup() {
    const router = useRouter()
    const globalDataStore = useGlobalData()
    const state = reactive({
      dialogVisible: false,
      tableData: [],
      total: 0,
      SpuFormRef: null as null | SpuForm,
      isEdit: false,
      currentRow: null as null | SpuModel,
      currentPage: 1,
      pageSize: 10,
    })

    const initSkuList = async () => {
      try {
        let res = await getSpuListApi({
          pageNum: state.currentPage,
          pageSize: state.pageSize,
        })
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        const totalNum = lodashGet(res, 'data.data.total')
        if (code === SUCCESS_CODE) {
          const list = lodashGet(res, 'data.data.list')
          state.tableData = list
          state.total = totalNum
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('查询时发生错误')
      }
    }

    const deleteBannerItem = async (id: number) => {
      try {
        let res = await deleteSpuApi(id)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          ElMessage.success('删除成功')
          initSkuList()
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('删除时发生错误')
      }
    }

    const handleDelete = (row: SpuModel) => {
      ElMessageBox.confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (row.id) {
          deleteBannerItem(row.id)
        }
      })
    }

    const handleCancel = () => {
      state.dialogVisible = false
    }

    const handleSpecValue = (row: SpuModel) => {
      router.push({
        path: `/spec-value/${row.id}`,
      })
    }

    const handleEdit = async (row: SpuModel) => {
      console.log(row)
      state.isEdit = true
      //查询详情接口
      if (row.id) {
        await getSpuDetail(row.id)
        state.dialogVisible = true
      }
    }

    const getSpuDetail = async (spuId: number) => {
      try {
        let res = await getSpuApi(spuId)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          const detailRow = lodashGet(res, 'data.data')
          state.currentRow = detailRow
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {}
    }

    const handleCreate = () => {
      state.isEdit = false
      state.dialogVisible = true
      state.currentRow = null
    }

    const handleSubmit = async () => {
      try {
        let specKeyValue = (await state.SpuFormRef?.handleSubmit()) as SpuModel
        let res = null
        if (specKeyValue) {
          if (state.isEdit) {
            // 编辑
            res = await updateSpuApi({
              ...specKeyValue,
              id: state.currentRow?.id,
            })
          } else {
            //新增
            res = await createSpuApi(specKeyValue)
          }
          const code = lodashGet(res, 'data.code')
          const message = lodashGet(res, 'data.message')
          if (code === SUCCESS_CODE) {
            state.dialogVisible = false
            ElMessage.success(`${message}`)
            initSkuList()
            state.SpuFormRef?.resetForm()
          } else {
            ElMessage.error(`${message}`)
          }
        }
      } catch (e) {
        ElMessage.error(`${state.isEdit ? '更新' : '创建'}时发生错误`)
      }
    }

    const dialogTitle = computed(() => {
      return state.isEdit ? '编辑SKU' : '新增SKU'
    })

    watch(
      () => state.currentPage,
      () => {
        initSkuList()
      }
    )

    watch(
      () => state.pageSize,
      () => {
        initSkuList()
      }
    )

    initSkuList()

    return {
      ...toRefs(state),
      handleDelete,
      handleCancel,
      handleSpecValue,
      handleCreate,
      handleSubmit,
      handleEdit,
      dialogTitle,
      globalDataStore,
    }
  },
})
</script>

<style lang="scss">
.spec-list {
  &__table {
    margin-top: 24px;
  }
  &__pagination {
    margin-top: 24px;
    text-align: right;
  }
}
</style>
