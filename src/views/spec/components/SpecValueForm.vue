<template>
  <div class="spec-form">
    <el-form ref="ELFormRef" :model="specValueForm" label-width="120px" :rules="specValueFormRules">
      <el-form-item label="规格值名称" prop="name">
        <el-input v-model="specValueForm.value" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="扩展" placeholder="请填写规格值扩展" prop="unit">
        <el-input v-model="specValueForm.extend"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, reactive, toRefs } from 'vue'
import { ElForm } from 'element-plus'
import { SpecValueModel } from '@/api/spec'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
  // 规格值操作表单，用于编辑和新增
  name: 'SpecValueForm',
  props: {
    defaultData: {
      type: Object as PropType<null | SpecValueModel>,
      default: null,
    },
  },
  setup(props) {
    const state = reactive({
      specValueForm: {
        value: '',
        extend: '',
      } as SpecValueModel,
      ELFormRef: null as null | ELFormCtx,
    })

    const specValueFormRules = {
      value: [
        {
          required: true,
          message: '规格值不能为空',
          trigger: 'blur',
        },
      ],
    }

    const handleSubmit = (): Promise<SpecValueModel> => {
      return new Promise((resolve) => {
        state.ELFormRef?.validate((valid) => {
          if (valid) {
            resolve(state.specValueForm)
          }
        })
      })
    }
    const resetForm = () => {
      state.specValueForm = {
        value: '',
        extend: '',
      }
    }

    watch(
      () => props.defaultData,
      (val) => {
        if (val) {
          state.specValueForm = val
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
      specValueFormRules,
      handleSubmit,
      resetForm,
    }
  },
})
</script>

<style lang="scss">
.spec-form {
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
