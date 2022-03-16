<template>
  <div class="category-form">
    <el-form ref="ELFormRef" :model="categoryForm" label-width="80px" :rules="categoryFormRules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="categoryForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="index">
        <el-input-number v-model="categoryForm.index"></el-input-number>
      </el-form-item>
      <el-form-item label="显示上线" prop="online">
        <el-switch
          v-model="categoryForm.online"
          :active-value="1"
          :inactive-value="0"
          active-text="上线"
          inactive-text="下线"
        ></el-switch>
      </el-form-item>
      <el-form-item label="图片" prop="img">
        <ImageUpload v-model="categoryForm.img" :limit="1" />
      </el-form-item>
      <el-form-item label="描述" placeholder="请输入描述" prop="description">
        <el-input v-model="categoryForm.description"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, reactive, toRefs } from 'vue'
import { ElForm } from 'element-plus'
import { CategoryModel } from '@/api/category'
import ImageUpload from '@/components/ImageUpload/index.vue'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
  // banner操作表单，用于编辑和新增
  name: 'CategoryForm',
  components: { ImageUpload },
  props: {
    defaultData: {
      type: Object as PropType<null | CategoryModel>,
      default: null,
    },
  },
  setup(props) {
    const state = reactive({
      categoryForm: {
        name: '',
        description: '',
        img: '',
        online: 0,
        index: 0,
      } as CategoryModel,
      ELFormRef: null as null | ELFormCtx,
    })

    const categoryFormRules = {
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

    const handleSubmit = (): Promise<CategoryModel> => {
      return new Promise((resolve) => {
        state.ELFormRef?.validate((valid) => {
          if (valid) {
            resolve(state.categoryForm)
          }
        })
      })
    }
    const resetForm = () => {
      state.categoryForm = {
        name: '',
        description: '',
        img: '',
        online: 0,
        index: 0,
      }
    }

    watch(
      () => props.defaultData,
      (val) => {
        if (val) {
          state.categoryForm = val
        } else {
          resetForm()
        }
      },
      {
        immediate: true,
      }
    )

    return {
      ...toRefs(state),
      categoryFormRules,
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
