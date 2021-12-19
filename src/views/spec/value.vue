<template>
  <div class="spec-list">
    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <SpecValueForm ref="specValueFormRef" :default-data="currentRow" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-row class="mb-4">
      <el-col :span="24">
        <el-button size="small" type="primary" @click="handleCreate">创建规格值</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-card class="spec-list__table" shadow="hover">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="value" label="规格值名称" />
        <el-table-column prop="extend" label="扩展" />
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
import { getSpecKeyApi, deleteSpecValueApi, updateSpecValueApi, createSpecValueApi, SpecValueModel } from '@/api/spec'
import { SUCCESS_CODE } from '@/config/constant'
import SpecValueForm from './components/SpecValueForm.vue'

type SpecValueFormCtx = InstanceType<typeof SpecValueForm>

export default defineComponent({
  name: 'CategoryList',
  components: { SpecValueForm },
  setup() {
    const route = useRoute()
    const state = reactive({
      dialogVisible: false,
      tableData: [],
      specValueFormRef: null as null | SpecValueFormCtx,
      isEdit: false,
      currentRow: null as null | SpecValueModel,
      specKeyId: Number(route.params.specKeyId),
    })

    const initSpecValueList = async () => {
      try {
        if (!state.specKeyId) return
        let res = await getSpecKeyApi(state.specKeyId)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          const list = lodashGet(res, 'data.data.specValues')
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
        let res = await deleteSpecValueApi(id)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          ElMessage.success('删除成功')
          initSpecValueList()
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('删除时发生错误')
      }
    }

    const handleDelete = (row: SpecValueModel) => {
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
      state.specValueFormRef?.resetForm()
    }

    const handleEdit = (row: SpecValueModel) => {
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
        let specValueForm = await state.specValueFormRef?.handleSubmit()
        let res = null
        if (specValueForm) {
          if (state.isEdit) {
            // 编辑
            res = await updateSpecValueApi({
              ...specValueForm,
              id: state.currentRow?.id,
            })
          } else {
            //新增
            res = await createSpecValueApi({
              ...specValueForm,
            })
          }
          const code = lodashGet(res, 'data.code')
          const message = lodashGet(res, 'data.message')
          if (code === SUCCESS_CODE) {
            state.dialogVisible = false
            ElMessage.success(`${message}`)
            initSpecValueList()
            state.specValueFormRef?.resetForm()
          } else {
            ElMessage.error(`${message}`)
          }
        }
      } catch (e) {
        ElMessage.error(`${state.isEdit ? '更新' : '创建'}时发生错误`)
      }
    }

    const dialogTitle = computed(() => {
      return state.isEdit ? '编辑规格值' : '新增规格值'
    })

    watch(
      () => route.params.specKeyId,
      () => {
        initSpecValueList()
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
