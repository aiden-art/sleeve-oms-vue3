<template>
  <div class="banner-item-form">
    <el-form ref="ELFormRef" size="small" :model="bannerItemForm" label-width="80px" :rules="bannerItemFormRules">
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
        <div class="banner-form__upload flex">
          <el-image
            v-if="bannerItemForm.img"
            style="width: 100px; height: 100px"
            :src="bannerItemForm.img"
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
import { BannerItemModel } from '@/api/banner'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
  // banner操作表单，用于编辑和新增
  name: 'BannerItemForm',
  components: { Plus },
  props: {
    defaultData: {
      type: Object as PropType<null | BannerItemModel>,
      default: null,
    },
  },
  setup(props) {
    const typeOptions = ref([
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
    ])

    let bannerItemForm = ref<BannerItemModel>({
      name: '',
      keyword: '',
      type: undefined,
      img: '',
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

    const ELFormRef = ref<null | ELFormCtx>(null)

    const fileList = ref<ElFile[]>([])

    const previewList = computed(() => {
      return [bannerItemForm.value.img]
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
          bannerItemForm.value.img = res.data.data.url
          ElMessage.success(`${message}`)
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('上传时发生错误')
      }
    }

    const handleSubmit = (): Promise<BannerItemModel> => {
      return new Promise((resolve) => {
        ELFormRef.value?.validate((valid) => {
          if (valid) {
            resolve(bannerItemForm.value)
          }
        })
      })
    }
    const resetForm = () => {
      bannerItemForm.value = {
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
          bannerItemForm.value = val
        } else {
          resetForm()
        }
      },
      {
        immediate: true,
      }
    )

    return {
      bannerItemForm,
      bannerItemFormRules,
      previewList,
      beforeUpload,
      uploadImageToOSS,
      handleFileChange,
      ELFormRef,
      handleSubmit,
      resetForm,
      typeOptions,
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
