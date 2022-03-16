<template>
  <div class="banner-form">
    <el-form ref="ELFormRef" :model="bannerForm" label-width="80px" :rules="bannerFormRules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="bannerForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="bannerForm.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="img">
        <ImageUpload v-model="bannerForm.img" :limit="1" />
      </el-form-item>
      <el-form-item label="描述" placeholder="请输入描述" prop="description">
        <el-input v-model="bannerForm.description"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, reactive, toRefs } from 'vue'
import { ElForm } from 'element-plus'
import { BannerModel } from '@/api/banner'
import ImageUpload from '@/components/ImageUpload/index.vue'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
  // banner操作表单，用于编辑和新增
  name: 'BannerForm',
  components: { ImageUpload },
  props: {
    defaultData: {
      type: Object as PropType<BannerModel | null>,
      default: null,
    },
  },
  setup(props) {
    const state = reactive({
      bannerForm: {
        name: '',
        title: '',
        description: '',
        img: '',
      } as BannerModel,
      ELFormRef: null as null | ELFormCtx,
    })

    const bannerFormRules = {
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

    const handleSubmit = (): Promise<BannerModel> => {
      return new Promise((resolve) => {
        state.ELFormRef?.validate((valid) => {
          if (valid) {
            resolve(state.bannerForm)
          }
        })
      })
    }

    const resetForm = () => {
      state.bannerForm = {
        name: '',
        title: '',
        description: '',
        img: '',
      }
    }

    watch(
      () => props.defaultData,
      (val) => {
        if (val) {
          state.bannerForm = val
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
      bannerFormRules,
      handleSubmit,
      resetForm,
    }
  },
})
</script>

<style lang="scss">
.banner-form {
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
