<template>
  <div class="spec-form">
    <el-form ref="ELFormRef" size="small" :model="specKeyForm" label-width="120px" :rules="categoryFormRules">
      <el-form-item label="规格名名称" prop="name">
        <el-input v-model="specKeyForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="规格名描述" prop="description">
        <el-input v-model="specKeyForm.description"></el-input>
      </el-form-item>

      <el-form-item label="单位" placeholder="请输入单位" prop="unit">
        <el-input v-model="specKeyForm.unit"></el-input>
      </el-form-item>
      <el-form-item label="是否标准" prop="standard">
        <el-switch
          v-model="specKeyForm.standard"
          :active-value="1"
          :inactive-value="0"
          active-text="标准"
          inactive-text="非标准"
        ></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, reactive, toRefs } from 'vue'
import { ElForm } from 'element-plus'
import { SpecKeyModel } from '@/api/spec'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
  // 规格名操作表单，用于编辑和新增
  name: 'SpecKeyForm',
  props: {
    defaultData: {
      type: Object as PropType<null | SpecKeyModel>,
      default: null,
    },
  },
  setup(props) {
    const state = reactive({
      specKeyForm: {
        name: '',
        description: '',
        unit: '',
        standard: 0,
      } as SpecKeyModel,
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

    const handleSubmit = (): Promise<SpecKeyModel> => {
      return new Promise((resolve) => {
        state.ELFormRef?.validate((valid) => {
          if (valid) {
            resolve(state.specKeyForm)
          }
        })
      })
    }
    const resetForm = () => {
      state.specKeyForm = {
        name: '',
        description: '',
        unit: '',
        standard: 0,
      }
    }

    watch(
      () => props.defaultData,
      (val) => {
        if (val) {
          state.specKeyForm = val
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
