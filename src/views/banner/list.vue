<template>
  <div class="banner-list">
    <!-- 查询 -->
    <el-card shadow="hover">
      <el-form size="small" :inline="true" :model="queryForm" class="banner-list__query">
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
              <el-button class="font-normal" size="small" type="primary" @click="onQuery">查询</el-button>
              <el-button class="font-normal" size="small" @click="onReset">重置</el-button>
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
          <el-button @click="dialogVisible = false">取消</el-button>
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
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="description" label="描述" />
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
import { computed, defineComponent, ref, watch } from 'vue'
import { get as lodashGet } from 'lodash'
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
import BannerForm from './components/BannerForm.vue'

type BannerFormCtx = InstanceType<typeof BannerForm>

export default defineComponent({
  name: 'BannerList',
  components: { ArrowDown, ArrowUp, BannerForm },
  setup() {
    const queryForm = ref<BannerQueryType>({
      id: undefined,
      name: '',
      title: '',
    })

    const onQuery = () => {
      initBannerList()
    }

    const onReset = () => {
      queryForm.value = {
        id: undefined,
        name: '',
        title: '',
      }
      initBannerList()
    }
    const dialogVisible = ref(false)
    const tableData = ref([])
    const total = ref(0)

    const isAdvanced = ref(false)

    const bannerFormRef = ref<null | BannerFormCtx>(null)

    const isEdit = ref(false)

    const currentRow = ref<BannerModel | undefined>(undefined)

    const currentPage = ref(1)

    const pageSize = ref(10)

    const handleAnvanced = () => {
      isAdvanced.value = !isAdvanced.value
    }

    const initBannerList = async () => {
      try {
        let res = await getBannerListApi({
          pageNum: currentPage.value,
          pageSize: pageSize.value,
          ...queryForm.value,
        })
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        const totalNum = lodashGet(res, 'data.data.total')
        if (code === '00000') {
          const list = lodashGet(res, 'data.data.list')
          tableData.value = list
          total.value = totalNum
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('查询时发生错误')
      }
    }

    initBannerList()

    const deleteBannerItem = async (id: number) => {
      try {
        let res = await deleteBannerApi(id)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === '00000') {
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

    const handleEdit = (row: BannerModel) => {
      isEdit.value = true
      dialogVisible.value = true
      currentRow.value = row
    }

    const handleCreate = () => {
      isEdit.value = false
      dialogVisible.value = true
      currentRow.value = undefined
    }

    const handleSubmit = async () => {
      try {
        let bannerForm = await bannerFormRef.value?.handleSubmit()
        let res = null
        if (bannerForm) {
          if (isEdit.value) {
            // 编辑
            res = await editBannerApi({
              ...bannerForm,
              id: currentRow.value?.id,
            })
          } else {
            //新增
            res = await createBannerApi(bannerForm)
          }
          const code = lodashGet(res, 'data.code')
          const message = lodashGet(res, 'data.message')
          if (code === '00000') {
            dialogVisible.value = false
            ElMessage.success(`${message}`)
            initBannerList()
          } else {
            ElMessage.error(`${message}`)
          }
        }
      } catch (e) {
        ElMessage.error(`${isEdit.value ? '更新' : '创建'}时发生错误`)
      }
    }

    const dialogTitle = computed(() => {
      return isEdit.value ? '编辑Banner' : '新增Banner'
    })

    watch(
      () => currentPage.value,
      () => {
        initBannerList()
      }
    )

    watch(
      () => pageSize.value,
      () => {
        initBannerList()
      }
    )

    return {
      queryForm,
      onQuery,
      onReset,
      tableData,
      total,
      currentPage,
      pageSize,
      isAdvanced,
      handleAnvanced,
      handleDelete,
      dialogVisible,
      handleCreate,
      handleSubmit,
      bannerFormRef,
      handleEdit,
      currentRow,
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
