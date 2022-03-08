<template>
  <div class="spu-list">
    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <SkuForm v-if="dialogVisible" ref="SkuFormRef" :default-data="currentRow" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-row class="mb-4">
      <el-col :span="24">
        <el-button size="small" type="primary" @click="handleCreate">添加SKU</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-card class="spec-list__table" shadow="hover">
      <template v-if="tableData.length === 0">
        <el-skeleton :rows="18" animated />
      </template>
      <template v-else>
        <el-table :data="tableData" stripe style="width: 100%">
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
          <el-table-column prop="spuId" label="spu_id" />
          <el-table-column prop="discountPrice" label="折扣" />
          <el-table-column prop="price" label="价格(元)" />
          <el-table-column prop="online" label="是否上架" />
          <el-table-column prop="code" label="编码" />
          <el-table-column prop="stock" label="库存(个)" />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button class="font-normal" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button class="font-normal" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <el-pagination
        v-model:pageSize="pageSize"
        v-model:currentPage="currentPage"
        small
        background
        class="spec-list__pagination"
        :page-sizes="[10, 20, 50, 100]"
        layout="prev, pager, next"
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
import { getSkuListApi, deleteSkuApi, SkuModel, updateSkuApi, createSkuApi } from '@/api/sku'
import { SUCCESS_CODE } from '@/config/constant'
import SkuForm from './components/SkuForm.vue'

type SkuFormCtx = InstanceType<typeof SkuForm>

export default defineComponent({
  name: 'SkuList',
  components: { SkuForm },
  setup() {
    const router = useRouter()
    const state = reactive({
      dialogVisible: false,
      tableData: [],
      total: 0,
      SkuFormRef: null as null | SkuFormCtx,
      isEdit: false,
      currentRow: null as null | SkuModel,
      currentPage: 1,
      pageSize: 10,
    })

    const initSkuList = async () => {
      try {
        let res = await getSkuListApi({
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
        let res = await deleteSkuApi(id)
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

    const handleDelete = (row: SkuModel) => {
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

    const handleSpecValue = (row: SkuModel) => {
      router.push({
        path: `/spec-value/${row.id}`,
      })
    }

    const handleEdit = (row: SkuModel) => {
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
        let specKeyValue = await state.SkuFormRef?.handleSubmit()
        let res = null
        if (specKeyValue) {
          if (state.isEdit) {
            // 编辑
            res = await updateSkuApi({
              ...specKeyValue,
              id: state.currentRow?.id,
            })
          } else {
            //新增
            res = await createSkuApi(specKeyValue)
          }
          const code = lodashGet(res, 'data.code')
          const message = lodashGet(res, 'data.message')
          if (code === SUCCESS_CODE) {
            state.dialogVisible = false
            ElMessage.success(`${message}`)
            initSkuList()
            state.SkuFormRef?.resetForm()
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
