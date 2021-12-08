<template>
  <div class="banner-form">
    <el-form size="small" :model="bannerForm" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="bannerForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="bannerForm.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          class="banner-form__upload"
          action=""
          :http-request="uploadImageToOSS"
          :show-file-list="false"
          :on-change="handleFileChange"
          :before-upload="beforeUpload"
        >
          <el-image
            v-if="bannerForm.img"
            style="width: 100px; height: 100px"
            :src="bannerForm.img"
            :initial-index="1"
          ></el-image>
          <el-icon v-else class="banner-form__icon flex justify-center items-center">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述" placeholder="请输入描述">
        <el-input v-model="bannerForm.description"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { get as lodashGet } from 'lodash'
import { Plus } from '@element-plus/icons'
import { FileHandler, ElFile } from 'element-plus/lib/components/upload/src/upload.type'
import { uploadFileToOSS } from '@/api/upload'
import { ElMessage } from 'element-plus'
export default defineComponent({
  // banner操作表单，用于编辑和新增
  name: 'BannerForm',
  components: { Plus },
  setup() {
    const bannerForm = reactive({
      name: '',
      title: '',
      description: '',
      img: '',
    })

    const fileList = ref<ElFile[]>([])

    const beforeUpload = () => {
      return true
    }
    const handleFileChange: FileHandler = (file) => {
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
        if (code === '00000') {
          console.log(res)
          ElMessage.success(`${message}`)
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('上传时发生错误')
      }
    }

    return {
      bannerForm,
      beforeUpload,
      uploadImageToOSS,
      handleFileChange,
    }
  },
})
</script>

<style lang="scss">
.banner-form {
  &__upload {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409eff;
    }
  }
  &__icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
  }
}
</style>
