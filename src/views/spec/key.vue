<template>
  <div class="spec-list">
    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <SpecKeyForm ref="specKeyFormRef" :default-data="currentRow" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-row class="mb-4">
      <el-col :span="24">
        <el-button size="small" type="primary" @click="handleCreate">创建规格名</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-card class="spec-list__table" shadow="hover">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="unit" label="单位" />
        <el-table-column prop="standard" label="标准" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button class="font-normal" type="text" size="small" @click="handleSpecValue(scope.row)">
              规格值
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
        class="spec-list__pagination"
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
import { getSpecKeyListApi, deleteSpecKeyApi, SpecKeyModel, updateSpecKeyApi, createSpecKeyApi } from '@/api/spec'
import { SUCCESS_CODE } from '@/config/constant'
import SpecKeyForm from './components/SpecKeyForm.vue'

type SpecFormCtx = InstanceType<typeof SpecKeyForm>

export default defineComponent({
  name: 'SpecKeyList',
  components: { SpecKeyForm },
  setup() {
    const router = useRouter()
    const state = reactive({
      dialogVisible: false,
      tableData: [],
      total: 0,
      specKeyFormRef: null as null | SpecFormCtx,
      isEdit: false,
      currentRow: null as null | SpecKeyModel,
      currentPage: 1,
      pageSize: 10,
    })

    const initCategoryList = async () => {
      try {
        let res = await getSpecKeyListApi({
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
        let res = await deleteSpecKeyApi(id)
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

    const handleDelete = (row: SpecKeyModel) => {
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
      state.specKeyFormRef?.resetForm()
    }

    const handleSpecValue = (row: SpecKeyModel) => {
      router.push({
        path: `/spec-value/${row.id}`,
      })
    }

    const handleEdit = (row: SpecKeyModel) => {
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
        let specKeyValue = await state.specKeyFormRef?.handleSubmit()
        let res = null
        if (specKeyValue) {
          if (state.isEdit) {
            // 编辑
            res = await updateSpecKeyApi({
              ...specKeyValue,
              id: state.currentRow?.id,
            })
          } else {
            //新增
            res = await createSpecKeyApi(specKeyValue)
          }
          const code = lodashGet(res, 'data.code')
          const message = lodashGet(res, 'data.message')
          if (code === SUCCESS_CODE) {
            state.dialogVisible = false
            ElMessage.success(`${message}`)
            initCategoryList()
            state.specKeyFormRef?.resetForm()
          } else {
            ElMessage.error(`${message}`)
          }
        }
      } catch (e) {
        ElMessage.error(`${state.isEdit ? '更新' : '创建'}时发生错误`)
      }
    }

    const dialogTitle = computed(() => {
      return state.isEdit ? '编辑规格名' : '新增规格名'
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
      handleSpecValue,
      handleCreate,
      handleSubmit,
      handleEdit,
      dialogTitle,
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
