<template>
  <div class="category-form">
    <el-form ref="ELFormRef" size="small" :model="categoryForm" label-width="80px" :rules="categoryFormRules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="categoryForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="index">
        <el-input-number v-model="categoryForm.index"></el-input-number>
      </el-form-item>
      <el-form-item label="显示上线" prop="online">
        <el-switch
          v-model="categoryForm.online"
          :active-value="1"
          :inactive-value="0"
          active-text="上线"
          inactive-text="下线"
        ></el-switch>
      </el-form-item>
      <el-form-item label="图片" prop="img">
        <div class="banner-form__upload flex">
          <el-image
            v-if="categoryForm.img"
            style="width: 100px; height: 100px"
            :src="categoryForm.img"
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
        <el-input v-model="categoryForm.description"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, watch, reactive, toRefs } from 'vue'
import { get as lodashGet } from 'lodash'
import { Plus } from '@element-plus/icons'
import { FileHandler, ElFile } from 'element-plus/lib/components/upload/src/upload.type'
import { uploadFileToOSS } from '@/api/upload'
import { ElMessage, ElForm } from 'element-plus'
import { SUCCESS_CODE } from '@/config/constant'
import { CategoryModel } from '@/api/category'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
  // banner操作表单，用于编辑和新增
  name: 'CategoryForm',
  components: { Plus },
  props: {
    defaultData: {
      type: Object as PropType<null | CategoryModel>,
      default: null,
    },
  },
  setup(props) {
    const state = reactive({
      categoryForm: {
        name: '',
        description: '',
        img: '',
        online: 0,
        index: 0,
      } as CategoryModel,
      ELFormRef: null as null | ELFormCtx,
      fileList: [] as ElFile[],
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

    const previewList = computed(() => {
      return [state.categoryForm.img]
    })

    const beforeUpload = () => {
      return true
    }
    const handleFileChange: FileHandler = (file) => {
      state.fileList = []
      state.fileList.push(file.raw)
    }

    const uploadImageToOSS = async () => {
      try {
        const form = new FormData()
        const file = state.fileList[0]
        form.append('file', file)
        const res = await uploadFileToOSS(form)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          state.categoryForm.img = res.data.data.url
          ElMessage.success(`${message}`)
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('上传时发生错误')
      }
    }

    const handleSubmit = (): Promise<CategoryModel> => {
      return new Promise((resolve) => {
        state.ELFormRef?.validate((valid) => {
          if (valid) {
            resolve(state.categoryForm)
          }
        })
      })
    }
    const resetForm = () => {
      state.categoryForm = {
        name: '',
        description: '',
        img: '',
        online: 0,
        index: 0,
      }
    }

    watch(
      () => props.defaultData,
      (val) => {
        if (val) {
          state.categoryForm = val
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
      previewList,
      beforeUpload,
      handleFileChange,
      uploadImageToOSS,
      handleSubmit,
      resetForm,
    }
  },
})
</script>

<style lang="scss">
.category-form {
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
