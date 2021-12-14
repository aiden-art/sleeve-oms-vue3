<template>
  <div class="banner-item-list">
    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <BannerItemForm ref="bannerItemFormRef" :default-data="currentRow" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-row class="mt-4">
      <el-col :span="24">
        <el-button size="small" type="primary" @click="handleCreate">新增</el-button>
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
        <el-table-column prop="keyword" label="关键字" />
        <el-table-column prop="type" label="类型" />
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
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { get as lodashGet } from 'lodash'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { SUCCESS_CODE } from '@/config/constant'
import {
  getBannerDetailApi,
  createBannerItemApi,
  deleteBannerItemApi,
  editBannerItemApi,
  BannerItemModel,
} from '@/api/banner'
import BannerItemForm from './components/BannerItemForm.vue'

type BannerItemFormCtx = InstanceType<typeof BannerItemForm>

export default defineComponent({
  name: 'BannerList',
  components: { BannerItemForm },
  setup() {
    const route = useRoute()

    const state = reactive({
      dialogVisible: false,
      tableData: [],
      bannerItemFormRef: null as null | BannerItemFormCtx,
      isEdit: false,
      currentRow: null as null | BannerItemModel,
    })

    const initBannerItemList = async () => {
      try {
        const bannerID = Number(route.params.bannerID)
        let res = await getBannerDetailApi(bannerID)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          const list = lodashGet(res, 'data.data.bannerItems')
          state.tableData = list
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('查询时发生错误')
      }
    }

    initBannerItemList()

    const deleteBannerItem = async (id: number) => {
      try {
        let res = await deleteBannerItemApi(id)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          ElMessage.success('删除成功')
          initBannerItemList()
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('删除时发生错误')
      }
    }

    const handleDelete = (row: BannerItemModel) => {
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
      state.bannerItemFormRef?.resetForm()
    }

    const handleEdit = (row: BannerItemModel) => {
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
        let bannerItemForm = await state.bannerItemFormRef?.handleSubmit()
        let res = null
        if (bannerItemForm) {
          if (state.isEdit) {
            // 编辑
            res = await editBannerItemApi({
              ...bannerItemForm,
              id: state.currentRow?.id,
            })
          } else {
            //新增
            res = await createBannerItemApi({
              ...bannerItemForm,
              bannerId: Number(route.params.bannerID),
            })
          }
          const code = lodashGet(res, 'data.code')
          const message = lodashGet(res, 'data.message')
          if (code === SUCCESS_CODE) {
            state.dialogVisible = false
            ElMessage.success(`${message}`)
            initBannerItemList()
            state.bannerItemFormRef?.resetForm()
          } else {
            ElMessage.error(`${message}`)
          }
        }
      } catch (e) {
        ElMessage.error(`${state.isEdit ? '更新' : '创建'}时发生错误`)
      }
    }

    const dialogTitle = computed(() => {
      return state.isEdit ? '编辑BannerItem' : '新增BannerItem'
    })

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
.banner-item-list {
  &__table {
    margin-top: 24px;
  }
}
</style>
