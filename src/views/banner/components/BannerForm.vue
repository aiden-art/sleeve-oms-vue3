<template>
  <div class="banner-form">
    <el-form ref="ELFormRef" size="small" :model="bannerForm" label-width="80px" :rules="bannerFormRules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="bannerForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="bannerForm.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="img">
        <div class="banner-form__upload flex">
          <el-image
            v-if="bannerForm.img"
            style="width: 100px; height: 100px"
            :src="bannerForm.img"
            :preview-src-list="previewList"
          ></el-image>
          <el-upload
            class="banner-form__upload ml-2"
            action=""
            list-type="picture-card"
            :http-request="uploadImageToOSS"
            :show-file-list="false"
            :on-change="handleFileChange"
            :before-upload="beforeUpload"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="描述" placeholder="请输入描述" prop="description">
        <el-input v-model="bannerForm.description"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, watch } from 'vue'
import { get as lodashGet } from 'lodash'
import { Plus } from '@element-plus/icons'
import { FileHandler, ElFile } from 'element-plus/lib/components/upload/src/upload.type'
import { uploadFileToOSS } from '@/api/upload'
import { ElMessage, ElForm } from 'element-plus'
import { SUCCESS_CODE } from '@/config/constant'
import { BannerModel } from '@/api/banner'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
  // banner操作表单，用于编辑和新增
  name: 'BannerForm',
  components: { Plus },
  props: {
    defaultData: {
      type: Object as PropType<BannerModel>,
      default: null,
    },
  },
  setup(props) {
    let bannerForm = ref<BannerModel>({
      name: '',
      title: '',
      description: '',
      img: '',
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

    const ELFormRef = ref<null | ELFormCtx>(null)

    const fileList = ref<ElFile[]>([])

    const previewList = computed(() => {
      return [bannerForm.value.img]
    })

    const beforeUpload = () => {
      return true
    }
    const handleFileChange: FileHandler = (file) => {
      fileList.value = []
      fileList.value.push(file.raw)
    }

    const uploadImageToOSS = async () => {
      try {
        const form = new FormData()
        const file = fileList.value[0]
        form.append('file', file)
        const res = await uploadFileToOSS(form)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          bannerForm.value.img = res.data.data.url
          ElMessage.success(`${message}`)
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('上传时发生错误')
      }
    }

    const handleSubmit = (): Promise<BannerModel> => {
      return new Promise((resolve) => {
        ELFormRef.value?.validate((valid) => {
          if (valid) {
            resolve(bannerForm.value)
          }
        })
      })
    }
    const resetForm = () => {
      bannerForm.value = {
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
          bannerForm.value = val
        } else {
          resetForm()
        }
      },
      {
        immediate: true,
      }
    )

    return {
      bannerForm,
      bannerFormRules,
      previewList,
      beforeUpload,
      uploadImageToOSS,
      handleFileChange,
      ELFormRef,
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
