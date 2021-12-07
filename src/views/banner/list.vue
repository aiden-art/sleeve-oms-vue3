<template>
  <div class="banner-list">
    <!-- 查询 -->
    <el-card shadow="hover">
      <el-form size="mini" :inline="true" :model="queryForm" class="banner-list__query">
        <el-form-item label="ID">
          <el-input v-model="queryForm.id" placeholder="请输入ID"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="queryForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="queryForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 列表 -->
    <el-card class="banner-list__table" shadow="hover">
      <el-table size="small" :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="title" label="标题" />
        <el-table-column label="操作" width="120">
          <template #default>
            <el-button type="text" size="small">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="banner-list__pagination" small layout="prev, pager, next" :total="50"> </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { get as lodashGet } from 'lodash'
import { ElMessage } from 'element-plus'
import { getBannerListApi } from '@/api/banner'
export default defineComponent({
  name: 'BannerList',
  setup() {
    const queryForm = reactive({
      id: '',
      name: '',
      title: '',
    })

    const onQuery = () => {
      return ''
    }

    const tableData = ref([])

    const initBannerList = async () => {
      try {
        let res = await getBannerListApi()
        const code = lodashGet(res, 'data.code')
        if (code === '00000') {
          const list = lodashGet(res, 'data.data.list')
          tableData.value = list
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('查询banner列表发生错误')
      }
    }

    initBannerList()

    return {
      queryForm,
      onQuery,
      tableData,
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
