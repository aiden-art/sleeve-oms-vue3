<template>
  <div class="spec-form">
    <el-form ref="ELFormRef" :model="themeForm" :rules="themeFormRules">
      <el-row justify="space-between">
        <el-col :xs="24" :lg="11">
          <el-form-item label="标题" prop="title">
            <el-input v-model="themeForm.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :lg="11">
          <el-form-item label="名称" prop="name">
            <el-input v-model="themeForm.name" placeholder="请输入名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :lg="11">
          <el-form-item label="主题描述" prop="description">
            <el-input v-model="themeForm.description"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :lg="11">
          <el-form-item label="模版名" prop="tplName">
            <el-input v-model="themeForm.tplName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :lg="11">
          <el-form-item label="是否上线" prop="online">
            <el-switch
              v-model="themeForm.online"
              :active-value="1"
              :inactive-value="0"
              active-text="上线"
              inactive-text="下线"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :lg="11">
          <el-form-item label="标题图" prop="titleImg">
            <ImageUpload v-model="themeForm.titleImg" :limit="1" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :lg="11">
          <el-form-item label="入口图" prop="entranceImg">
            <ImageUpload v-model="themeForm.entranceImg" :limit="1" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :lg="11">
          <el-form-item label="外部图" prop="internalTopImg">
            <ImageUpload v-model="themeForm.internalTopImg" :limit="1" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, reactive, toRefs } from 'vue'
import { ElForm } from 'element-plus'
import { ThemeModel } from '@/api/theme'
import ImageUpload from '@/components/ImageUpload/index.vue'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
  // 规格名操作表单，用于编辑和新增
  name: 'ThemeForm',
  components: { ImageUpload },
  props: {
    defaultData: {
      type: Object as PropType<null | ThemeModel>,
      default: null,
    },
  },
  setup(props) {
    const state = reactive({
      themeForm: {} as ThemeModel,
      spuList: [],
      ELFormRef: null as null | ELFormCtx,
    })

    const themeFormRules = {
      title: [
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

    const handleSubmit = (): Promise<ThemeModel> => {
      return new Promise((resolve) => {
        state.ELFormRef?.validate((valid) => {
          if (valid) {
            resolve(state.themeForm)
          }
        })
      })
    }

    const resetForm = () => {
      state.themeForm = {
        id: undefined,
        title: '',
      } as ThemeModel
    }

    watch(
      () => props.defaultData,
      (val) => {
        if (val) {
          state.themeForm = val
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
      themeFormRules,
      handleSubmit,
      resetForm,
    }
  },
})
</script>

<style lang="scss">
.spec-form {
  .el-upload--picture-card {
    width: 60px;
    height: 60px;
    display: flex;
    @include flex(row, center, center);
    .el-icon {
      margin: 0;
      font-size: 12px;
    }
  }
}
</style>
