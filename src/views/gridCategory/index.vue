<template>
  <div class="category-list">
    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <GridCategoryForm ref="gridCategoryFormRef" :default-data="currentRow" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-row class="mb-4">
      <el-col :span="24">
        <el-button type="primary" @click="handleCreate">创建六宫格</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-card class="banner-list__table" shadow="hover">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="img" label="图片">
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
        <el-table-column prop="categoryId" label="分类ID" />
        <el-table-column prop="rootCategoryId" label="父分类ID" />
        <el-table-column prop="index" label="排序" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button class="font-normal" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button class="font-normal" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, watch, reactive } from 'vue'
import { get as lodashGet } from 'lodash'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  deleteGridCategoryApi,
  GridCategoryModel,
  updateGridCategoryApi,
  createGridCategoryApi,
  getGridCategoryListApi,
} from '@/api/gridCategory'
import { SUCCESS_CODE } from '@/config/constant'
import GridCategoryForm from './components/GridCategoryForm.vue'

type GridCategoryFormCtx = InstanceType<typeof GridCategoryForm>

export default defineComponent({
  name: 'CategoryList',
  components: { GridCategoryForm },
  setup() {
    const route = useRoute()
    const state = reactive({
      dialogVisible: false,
      tableData: [],
      gridCategoryFormRef: null as null | GridCategoryFormCtx,
      isEdit: false,
      currentRow: null as null | GridCategoryModel,
    })

    const initGridCategoryList = async () => {
      try {
        let res = await getGridCategoryListApi()
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          const list = lodashGet(res, 'data.data.list')
          state.tableData = list
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
        let res = await deleteGridCategoryApi(id)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          ElMessage.success('删除成功')
          initGridCategoryList()
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('删除时发生错误')
      }
    }

    const handleDelete = (row: GridCategoryModel) => {
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
      state.gridCategoryFormRef?.resetForm()
    }

    const handleEdit = (row: GridCategoryModel) => {
      state.isEdit = true
      state.dialogVisible = true
      state.currentRow = row
    }

    const handleCreate = () => {
      state.isEdit = false
      state.dialogVisible = true
      state.currentRow = null
    }

    const handleSubmit = async () => {
      try {
        let gridCategoryForm = await state.gridCategoryFormRef?.handleSubmit()
        let res = null
        if (gridCategoryForm) {
          if (state.isEdit) {
            // 编辑
            res = await updateGridCategoryApi({
              ...gridCategoryForm,
              id: state.currentRow?.id,
            })
          } else {
            //新增
            res = await createGridCategoryApi({
              ...gridCategoryForm,
            })
          }
          const code = lodashGet(res, 'data.code')
          const message = lodashGet(res, 'data.message')
          if (code === SUCCESS_CODE) {
            state.dialogVisible = false
            ElMessage.success(`${message}`)
            initGridCategoryList()
            state.gridCategoryFormRef?.resetForm()
          } else {
            ElMessage.error(`${message}`)
          }
        }
      } catch (e) {
        ElMessage.error(`${state.isEdit ? '更新' : '创建'}时发生错误`)
      }
    }

    const dialogTitle = computed(() => {
      return state.isEdit ? '编辑分类' : '新增分类'
    })

    watch(
      () => route.params.categoryID,
      () => {
        initGridCategoryList()
      },
      {
        immediate: true,
      }
    )

    return {
      ...toRefs(state),
      handleDelete,
      handleCancel,
      handleCreate,
      handleSubmit,
      handleEdit,
      dialogTitle,
    }
  },
})
</script>

<style lang="scss">
.category-list {
  &__table {
    margin-top: 24px;
  }
  &__pagination {
    margin-top: 24px;
    text-align: right;
  }
}
</style>
