<template>
  <div class="category-form">
    <el-form ref="ELFormRef" :model="gridCategoryForm" label-width="80px" :rules="gridCategoryFormRules">
      <el-form-item label="名称" prop="title">
        <el-input v-model="gridCategoryForm.title" placeholder="请填写标题"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="index">
        <el-input-number v-model="gridCategoryForm.index"></el-input-number>
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="gridCategoryForm.categoryId" placeholder="请填写分类" @change="handleCategoryChange">
          <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片" prop="img">
        <ImageUpload v-model="gridCategoryForm.img" :limit="1" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, reactive, toRefs } from 'vue'
import { get as lodashGet, cloneDeep } from 'lodash'
import { ElMessage, ElForm } from 'element-plus'
import { SUCCESS_CODE } from '@/config/constant'
import { GridCategoryModel } from '@/api/gridCategory'
import { CategoryModel, getSubCategoryListApi } from '@/api/category'
import ImageUpload from '@/components/ImageUpload/index.vue'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
  // 操作表单，用于编辑和新增
  name: 'GridCategoryForm',
  components: { ImageUpload },
  props: {
    defaultData: {
      type: Object as PropType<null | GridCategoryModel>,
      default: null,
    },
  },
  setup(props) {
    const state = reactive({
      gridCategoryForm: {
        title: '',
        img: '',
        index: 0,
        categoryId: undefined,
        rootCategoryId: undefined,
      } as GridCategoryModel,
      ELFormRef: null as null | ELFormCtx,
      categoryList: [] as CategoryModel[],
    })

    const gridCategoryFormRules = {
      name: [
        {
          required: true,
          message: '名称不能为空',
          trigger: 'blur',
        },
      ],
      img: [
        {
          required: true,
          message: '图片不能为空',
          trigger: 'blur',
        },
      ],
    }

    const handleCategoryChange = (categoryId: number) => {
      const selectItem = state.categoryList.find((item) => item.id === categoryId)
      state.gridCategoryForm.rootCategoryId = selectItem?.parentId
    }

    const handleSubmit = (): Promise<GridCategoryModel> => {
      return new Promise((resolve) => {
        state.ELFormRef?.validate((valid) => {
          if (valid) {
            resolve(state.gridCategoryForm)
          }
        })
      })
    }
    const resetForm = () => {
      state.gridCategoryForm = {
        title: '',
        img: '',
        index: 0,
        categoryId: undefined,
        rootCategoryId: undefined,
      }
    }

    const getSubCategoryList = async () => {
      try {
        let res = await getSubCategoryListApi()
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          const list = lodashGet(res, 'data.data.list')
          state.categoryList = list
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {}
    }

    watch(
      () => props.defaultData,
      (val) => {
        if (val) {
          state.gridCategoryForm = cloneDeep(val)
        } else {
          resetForm()
        }
      },
      {
        immediate: true,
      }
    )

    getSubCategoryList()

    return {
      ...toRefs(state),
      gridCategoryFormRules,
      handleCategoryChange,
      handleSubmit,
      resetForm,
    }
  },
})
</script>

<style lang="scss">
.category-form {
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    display: flex;
    @include flex(row, center, center);
    .el-icon {
      margin: 0;
    }
  }
}
</style>
