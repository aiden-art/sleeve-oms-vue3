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
            <div class="flex banner-form__upload">
              <el-image
                v-if="themeForm.titleImg"
                style="width: 60px; height: 60px"
                :src="themeForm.titleImg"
                :preview-src-list="previewTitleImgList"
              ></el-image>
              <el-upload
                class="ml-2 banner-form__upload"
                action=""
                list-type="picture-card"
                :http-request="uploadTitleImageToOSS"
                :show-file-list="false"
                :on-change="handleTitleImgFileChange"
                :before-upload="beforeUpload"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :lg="11">
          <el-form-item label="入口图" prop="entranceImg">
            <div class="flex banner-form__upload">
              <el-image
                v-if="themeForm.entranceImg"
                style="width: 60px; height: 60px"
                :src="themeForm.entranceImg"
                :preview-src-list="previewEntranceImgList"
              ></el-image>
              <el-upload
                class="ml-2 banner-form__upload"
                action=""
                list-type="picture-card"
                :http-request="uploadEntranceImageToOSS"
                :show-file-list="false"
                :on-change="handleEntranceImgFileChange"
                :before-upload="beforeUpload"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :lg="11">
          <el-form-item label="外部图" prop="internalTopImg">
            <div class="flex banner-form__upload">
              <el-image
                v-if="themeForm.internalTopImg"
                style="width: 60px; height: 60px"
                :src="themeForm.internalTopImg"
                :preview-src-list="previewInternalImgList"
              ></el-image>
              <el-upload
                class="ml-2 banner-form__upload"
                action=""
                list-type="picture-card"
                :http-request="uploadInternalImageToOSS"
                :show-file-list="false"
                :on-change="handleInternalImgFileChange"
                :before-upload="beforeUpload"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, reactive, toRefs, computed } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { Plus } from '@element-plus/icons'
import { FileHandler, ElFile } from 'element-plus/lib/components/upload/src/upload.type'
import { uploadFileToOSS } from '@/api/upload'
import { ThemeModel } from '@/api/theme'
import { get as lodashGet } from 'lodash'
import { SUCCESS_CODE } from '@/config/constant'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
  // 规格名操作表单，用于编辑和新增
  name: 'ThemeForm',
  components: { Plus },
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
      titleImgFileList: [] as ElFile[],
      entranceImgFileList: [] as ElFile[],
      internalImgFileList: [] as ElFile[],
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

    const previewTitleImgList = computed(() => {
      return [state.themeForm.titleImg]
    })
    const previewEntranceImgList = computed(() => {
      return [state.themeForm.entranceImg]
    })
    const previewInternalImgList = computed(() => {
      return [state.themeForm.internalTopImg]
    })

    const beforeUpload = () => {
      return true
    }

    const handleTitleImgFileChange: FileHandler = (file) => {
      state.titleImgFileList = []
      state.titleImgFileList.push(file.raw)
    }

    const handleEntranceImgFileChange: FileHandler = (file) => {
      state.entranceImgFileList = []
      state.entranceImgFileList.push(file.raw)
    }

    const handleInternalImgFileChange: FileHandler = (file) => {
      state.internalImgFileList = []
      state.internalImgFileList.push(file.raw)
    }

    const uploadTitleImageToOSS = async () => {
      try {
        const form = new FormData()
        const file = state.titleImgFileList[0]
        form.append('file', file)
        const res = await uploadFileToOSS(form)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          state.themeForm.titleImg = res.data.data.url
          ElMessage.success(`${message}`)
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('上传时发生错误')
      }
    }

    const uploadEntranceImageToOSS = async () => {
      try {
        const form = new FormData()
        const file = state.entranceImgFileList[0]
        form.append('file', file)
        const res = await uploadFileToOSS(form)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          state.themeForm.entranceImg = res.data.data.url
          ElMessage.success(`${message}`)
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('上传时发生错误')
      }
    }

    const uploadInternalImageToOSS = async () => {
      try {
        const form = new FormData()
        const file = state.internalImgFileList[0]
        form.append('file', file)
        const res = await uploadFileToOSS(form)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          state.themeForm.internalTopImg = res.data.data.url
          ElMessage.success(`${message}`)
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('上传时发生错误')
      }
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
      previewTitleImgList,
      previewEntranceImgList,
      previewInternalImgList,
      beforeUpload,
      handleTitleImgFileChange,
      handleEntranceImgFileChange,
      handleInternalImgFileChange,
      uploadTitleImageToOSS,
      uploadEntranceImageToOSS,
      uploadInternalImageToOSS,
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
