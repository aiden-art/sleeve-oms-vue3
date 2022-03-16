<template>
  <div class="banner-item-form">
    <el-form ref="ELFormRef" :model="bannerItemForm" label-width="80px" :rules="bannerItemFormRules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="bannerItemForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="关键字" prop="keyword">
        <el-input v-model="bannerItemForm.keyword" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="bannerItemForm.type" placeholder="请选择类型">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片" prop="img">
        <ImageUpload v-model="bannerItemForm.img" :limit="1" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, watch, reactive, toRefs } from 'vue'
import { ElForm } from 'element-plus'
import { BannerItemModel } from '@/api/banner'
import ImageUpload from '@/components/ImageUpload/index.vue'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
  // banner操作表单，用于编辑和新增
  name: 'BannerItemForm',
  components: { ImageUpload },
  props: {
    defaultData: {
      type: Object as PropType<null | BannerItemModel>,
      default: null,
    },
  },
  setup(props) {
    const state = reactive({
      typeOptions: [
        {
          value: 1,
          label: 'Option1',
        },
        {
          value: 2,
          label: 'Option2',
        },
        {
          value: 3,
          label: 'Option3',
        },
      ],
      bannerItemForm: {
        name: '',
        keyword: '',
        type: undefined,
        img: '',
      } as BannerItemModel,
      ELFormRef: null as null | ELFormCtx,
    })

    const bannerItemFormRules = {
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

    const previewList = computed(() => {
      return [state.bannerItemForm.img]
    })

    const handleSubmit = (): Promise<BannerItemModel> => {
      return new Promise((resolve) => {
        state.ELFormRef?.validate((valid) => {
          if (valid) {
            resolve(state.bannerItemForm)
          }
        })
      })
    }

    const resetForm = () => {
      state.bannerItemForm = {
        name: '',
        type: undefined,
        keyword: '',
        img: '',
      }
    }

    watch(
      () => props.defaultData,
      (val) => {
        if (val) {
          state.bannerItemForm = val
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
      bannerItemFormRules,
      previewList,
      handleSubmit,
      resetForm,
    }
  },
})
</script>

<style lang="scss">
.banner-item-form {
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
