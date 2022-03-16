<template>
  <div class="spu-list">
    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <ThemeForm v-if="dialogVisible" ref="SpuFormRef" :default-data="currentRow" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-row class="mb-4">
      <el-col :span="24">
        <el-button type="primary" @click="handleCreate">添加专题</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-card class="spec-list__table" shadow="hover">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="img" label="标题图">
          <template #default="scope">
            <el-image
              v-if="scope.row.titleImg"
              class="block max-w-1/2"
              :src="scope.row.titleImg"
              :preview-src-list="[scope.row.titleImg]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="tplName" label="模板名" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="entranceImg" label="入口图">
          <template #default="scope">
            <el-image
              v-if="scope.row.entranceImg"
              class="block max-w-1/2"
              :src="scope.row.entranceImg"
              :preview-src-list="[scope.row.entranceImg]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="internalTopImg" label="外链图">
          <template #default="scope">
            <el-image
              v-if="scope.row.internalTopImg"
              class="block max-w-1/2"
              :src="scope.row.internalTopImg"
              :preview-src-list="[scope.row.internalTopImg]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button class="font-normal" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button class="font-normal" type="text" size="small" @click="handleAddSpu(scope.row)">新增SPU</el-button>
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
import { getThemeListApi, deleteThemeApi, ThemeModel, updateThemeApi, createThemeApi } from '@/api/theme'
import { SUCCESS_CODE } from '@/config/constant'
import ThemeForm from './components/ThemeForm.vue'

type ThemeForm = InstanceType<typeof ThemeForm>

export default defineComponent({
  name: 'SkuList',
  components: { ThemeForm },
  setup() {
    const router = useRouter()
    const state = reactive({
      dialogVisible: false,
      tableData: [],
      total: 0,
      SpuFormRef: null as null | ThemeForm,
      isEdit: false,
      currentRow: null as null | ThemeModel,
      currentPage: 1,
      pageSize: 10,
    })

    const initSkuList = async () => {
      try {
        let res = await getThemeListApi({
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
        let res = await deleteThemeApi(id)
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

    const handleDelete = (row: ThemeModel) => {
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

    const handleEdit = (row: ThemeModel) => {
      console.log(row)
      state.isEdit = true
      state.dialogVisible = true
      state.currentRow = row
    }

    const handleCreate = () => {
      state.isEdit = false
      state.dialogVisible = true
      state.currentRow = null
    }

    const handleAddSpu = (row: ThemeModel) => {
      router.push({
        path: `/theme/spu-list/${row.id}`,
      })
    }

    const handleSubmit = async () => {
      try {
        let specKeyValue = await state.SpuFormRef?.handleSubmit()
        let res = null
        if (specKeyValue) {
          if (state.isEdit) {
            // 编辑
            res = await updateThemeApi({
              ...specKeyValue,
              id: state.currentRow?.id,
            })
          } else {
            //新增
            res = await createThemeApi(specKeyValue)
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
      return state.isEdit ? '编辑专题' : '新增专题'
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
      handleCreate,
      handleSubmit,
      handleEdit,
      handleAddSpu,
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
