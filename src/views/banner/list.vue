<template>
  <div class="banner-list">
    <!-- 查询 -->
    <el-card shadow="hover">
      <el-form :inline="true" :model="queryForm" class="banner-list__query">
        <el-row :gutter="48">
          <el-col :md="8" :sm="24">
            <el-form-item class="container" label="ID">
              <el-input v-model="queryForm.id" placeholder="请输入ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="8" :sm="24">
            <el-form-item class="container" label="名称">
              <el-input v-model="queryForm.name" placeholder="请输入名称"></el-input>
            </el-form-item>
          </el-col>
          <template v-if="isAdvanced">
            <el-col :md="8" :sm="24">
              <el-form-item class="container" label="标题">
                <el-input v-model="queryForm.title" placeholder="请输入标题"></el-input>
              </el-form-item>
            </el-col>
          </template>
          <el-col :md="8" :sm="24">
            <span class="flex content-center">
              <el-button class="font-normal" type="primary" @click="onQuery">查询</el-button>
              <el-button class="font-normal" @click="onReset">重置</el-button>
              <el-link type="primary" class="ml-2 font-normal" :underline="false" @click="handleAnvanced">
                <span class="flex items-center">
                  {{ isAdvanced ? '收起' : '展开' }}
                  <template v-if="isAdvanced">
                    <el-icon size="18px" class="ml-1"><arrow-up /></el-icon>
                  </template>
                  <template v-else>
                    <el-icon size="18px" class="ml-1"><arrow-down /></el-icon>
                  </template>
                </span>
              </el-link>
            </span>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <BannerForm ref="bannerFormRef" :default-data="currentRow" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-row class="mt-4">
      <el-col :span="24">
        <el-button type="primary" @click="handleCreate">新增</el-button>
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
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button class="font-normal" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button class="font-normal" type="text" size="small" @click="handleBannerItem(scope.row)">
              新增Item
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button class="font-normal" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:pageSize="pageSize"
        v-model:currentPage="currentPage"
        small
        class="banner-list__pagination"
        :page-sizes="[10, 20, 50, 100]"
        layout="sizes,prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch, reactive, toRefs } from 'vue'
import { get as lodashGet } from 'lodash'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, ArrowUp } from '@element-plus/icons'
import {
  getBannerListApi,
  deleteBannerApi,
  BannerModel,
  BannerQueryType,
  editBannerApi,
  createBannerApi,
} from '@/api/banner'
import { SUCCESS_CODE } from '@/config/constant'
import BannerForm from './components/BannerForm.vue'

type BannerFormCtx = InstanceType<typeof BannerForm>

export default defineComponent({
  name: 'BannerList',
  components: { ArrowDown, ArrowUp, BannerForm },
  setup() {
    const router = useRouter()
    const state = reactive({
      queryForm: {
        id: undefined,
        name: '',
        title: '',
      } as BannerQueryType,
      dialogVisible: false,
      tableData: [],
      total: 0,
      isAdvanced: false,
      bannerFormRef: null as null | BannerFormCtx,
      isEdit: false,
      currentRow: null as null | BannerModel,
      currentPage: 1,
      pageSize: 10,
    })

    const handleAnvanced = () => {
      state.isAdvanced = !state.isAdvanced
    }

    const onQuery = () => {
      initBannerList()
    }

    const onReset = () => {
      state.queryForm = {
        id: undefined,
        name: '',
        title: '',
      }
      initBannerList()
    }

    const initBannerList = async () => {
      try {
        let res = await getBannerListApi({
          pageNum: state.currentPage,
          pageSize: state.pageSize,
          ...state.queryForm,
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
        let res = await deleteBannerApi(id)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          ElMessage.success('删除成功')
          initBannerList()
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('删除时发生错误')
      }
    }

    const handleDelete = (row: BannerModel) => {
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
      state.bannerFormRef?.resetForm()
    }

    const handleBannerItem = (row: BannerModel) => {
      router.push({
        path: `/banner/item-list/${row.id}`,
      })
    }

    const handleEdit = (row: BannerModel) => {
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
        let bannerForm = await state.bannerFormRef?.handleSubmit()
        let res = null
        if (bannerForm) {
          if (state.isEdit) {
            // 编辑
            res = await editBannerApi({
              ...bannerForm,
              id: state.currentRow?.id,
            })
          } else {
            //新增
            res = await createBannerApi(bannerForm)
          }
          const code = lodashGet(res, 'data.code')
          const message = lodashGet(res, 'data.message')
          if (code === SUCCESS_CODE) {
            state.dialogVisible = false
            ElMessage.success(`${message}`)
            initBannerList()
            state.bannerFormRef?.resetForm()
          } else {
            ElMessage.error(`${message}`)
          }
        }
      } catch (e) {
        ElMessage.error(`${state.isEdit ? '更新' : '创建'}时发生错误`)
      }
    }

    const dialogTitle = computed(() => {
      return state.isEdit ? '编辑Banner' : '新增Banner'
    })

    watch(
      () => state.currentPage,
      () => {
        initBannerList()
      }
    )

    watch(
      () => state.pageSize,
      () => {
        initBannerList()
      }
    )

    initBannerList()

    return {
      ...toRefs(state),
      onQuery,
      onReset,
      handleAnvanced,
      handleEdit,
      handleDelete,
      handleCancel,
      handleBannerItem,
      handleCreate,
      handleSubmit,
      dialogTitle,
    }
  },
})
</script>

<style lang="scss">
.banner-list {
  &__table {
    margin-top: 24px;
  }
  &__pagination {
    margin-top: 24px;
    text-align: right;
  }
}
</style>
