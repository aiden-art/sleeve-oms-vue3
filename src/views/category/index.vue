<template>
  <div class="category-list">
    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <CategoryForm ref="categoryFormRef" :default-data="currentRow" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-row class="mb-4">
      <el-col :span="24">
        <el-button type="primary" @click="handleCreate">创建分类</el-button>
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
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="index" label="排序" />
        <el-table-column prop="online" label="状态" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button class="font-normal" type="text" size="small" @click="handleBannerItem(scope.row)">
              子分类
            </el-button>
            <el-divider direction="vertical"></el-divider>
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
        class="category-list__pagination"
        :page-sizes="[10, 20, 50, 100]"
        layout="sizes,prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, watch, reactive } from 'vue'
import { get as lodashGet } from 'lodash'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getCategoryListApi,
  deleteCategoryApi,
  CategoryModel,
  updateCategoryApi,
  createCategoryApi,
} from '@/api/category'
import { SUCCESS_CODE } from '@/config/constant'
import CategoryForm from './components/CategoryForm.vue'

type CategoryFormCtx = InstanceType<typeof CategoryForm>

export default defineComponent({
  name: 'CategoryList',
  components: { CategoryForm },
  setup() {
    const router = useRouter()
    const state = reactive({
      dialogVisible: false,
      tableData: [],
      total: 0,
      categoryFormRef: null as null | CategoryFormCtx,
      isEdit: false,
      currentRow: null as null | CategoryModel,
      currentPage: 1,
      pageSize: 10,
    })

    const initCategoryList = async () => {
      try {
        let res = await getCategoryListApi({
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
        let res = await deleteCategoryApi(id)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          ElMessage.success('删除成功')
          initCategoryList()
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('删除时发生错误')
      }
    }

    const handleDelete = (row: CategoryModel) => {
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
      state.categoryFormRef?.resetForm()
    }

    const handleBannerItem = (row: CategoryModel) => {
      router.push({
        path: `/category/sub/${row.id}`,
      })
    }

    const handleEdit = (row: CategoryModel) => {
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
        let bannerForm = await state.categoryFormRef?.handleSubmit()
        let res = null
        if (bannerForm) {
          if (state.isEdit) {
            // 编辑
            res = await updateCategoryApi({
              ...bannerForm,
              id: state.currentRow?.id,
            })
          } else {
            //新增
            res = await createCategoryApi(bannerForm)
          }
          const code = lodashGet(res, 'data.code')
          const message = lodashGet(res, 'data.message')
          if (code === SUCCESS_CODE) {
            state.dialogVisible = false
            ElMessage.success(`${message}`)
            initCategoryList()
            state.categoryFormRef?.resetForm()
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
      () => state.currentPage,
      () => {
        initCategoryList()
      }
    )

    watch(
      () => state.pageSize,
      () => {
        initCategoryList()
      }
    )

    initCategoryList()

    return {
      ...toRefs(state),
      handleDelete,
      handleCancel,
      handleBannerItem,
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
