<template>
  <el-upload
    action=""
    list-type="picture-card"
    :limit="limit"
    :http-request="uploadImageToOSS"
    :on-preview="handleImagePreview"
    :on-remove="handleRemove"
    :on-change="handleFileChange"
    :before-upload="beforeUpload"
    :file-list="fileList"
  >
    <el-icon><plus /></el-icon>
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <img style="width: 240px" :src="dialogImageUrl" alt="" />
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { FileHandler, UploadFile } from 'element-plus/lib/components/upload/src/upload.type'
import { get as lodashGet } from 'lodash'
import { SUCCESS_CODE } from '@/config/constant'
import { uploadFileToOSS, UploadResModel } from '@/api/upload'
import { BaseResponseModel } from '@/api/apiTypes'
import ImagePreview from '@/components/ImagePreview'

type ModelValueType = undefined | string | string[]

type DefaultFileListType = {
  url: string
}

export default defineComponent({
  name: 'ImageUpload',
  components: { Plus },
  props: {
    modelValue: {
      type: [String, Array] as PropType<ModelValueType>,
      default: () => [],
    },
    limit: {
      type: Number,
      default: undefined,
    },
  },
  emits: ['on-change', 'update:modelValue'],
  setup(props, { emit }) {
    const state = reactive({
      dialogImageUrl: '',
      dialogVisible: false,
      file: {} as null | UploadFile,
      fileList: [] as DefaultFileListType[],
      imageList: [] as string[],
    })

    const uploadImageToOSS = async () => {
      try {
        const form = new FormData()
        const file = state.file
        if (file) {
          form.append('file', file.raw)
          const res = await uploadFileToOSS(form)
          const code = lodashGet(res, 'data.code')
          const message = lodashGet(res, 'data.message')
          if (code === SUCCESS_CODE) {
            ElMessage.success(`${message}`)
          } else {
            ElMessage.error(`${message}`)
          }
          return res.data
        } else {
          ElMessage.error('上传失败')
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('上传时发生错误')
      }
    }

    const handleFileChange: FileHandler = (file) => {
      const fileResponse = file.response as null | BaseResponseModel<UploadResModel>
      //添加文件时
      if (!fileResponse) {
        state.file = file
      } else {
        state.file = null
        //上传成功时
        if (fileResponse.code === SUCCESS_CODE) {
          const OSSUrl = fileResponse.data.url
          file.url = OSSUrl
          state.imageList.push(OSSUrl)
          if (props.limit === 1) {
            emitEvents(OSSUrl)
          } else {
            emitEvents(state.imageList)
          }
        }
      }
    }

    const emitEvents = (payload: string | string[]) => {
      emit('on-change', payload)
      emit('update:modelValue', payload)
    }

    const beforeUpload = () => {
      return true
    }

    const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
      const leaveFileUrls = fileList.map((file) => (file.url ? file.url : ''))
      state.imageList = leaveFileUrls
      if (props.limit === 1) {
        emitEvents('')
      } else {
        emitEvents(state.imageList)
      }
    }

    const handleImagePreview = (file: UploadFile) => {
      if (!file.url) return
      const urls = [file.url]
      ImagePreview.init({
        urlList: urls,
        zIndex: 3000,
        hideOnClickModal: false,
      })
    }

    const setDefaultFileList = (modelValue: ModelValueType) => {
      if (Array.isArray(modelValue)) {
        state.imageList = modelValue
        state.fileList = modelValue.map((e) => ({
          url: e,
        }))
      } else {
        if (props.limit === 1) {
          if (modelValue) {
            state.fileList = [
              {
                url: modelValue,
              },
            ]
          }
        } else {
          state.fileList = []
        }
      }
    }

    watch(
      () => props.modelValue,
      (val) => {
        setDefaultFileList(val)
      },
      {
        immediate: true,
      }
    )

    return {
      ...toRefs(state),
      beforeUpload,
      uploadImageToOSS,
      handleRemove,
      handleFileChange,
      handleImagePreview,
    }
  },
})
</script>
