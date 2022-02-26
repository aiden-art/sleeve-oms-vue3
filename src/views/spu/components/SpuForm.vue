<template>
  <div class="spec-form">
    <el-form ref="ELFormRef" size="small" :model="spuForm" label-width="120px" :rules="spuFormRules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="spuForm.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="副标题" prop="subtitle">
        <el-input v-model="spuForm.subtitle" placeholder="请输入副标题"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="spuForm.price" placeholder="请输入价格"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-input v-model="spuForm.categoryId"></el-input>
      </el-form-item>
      <el-form-item label="默认sku" prop="defaultSkuId">
        <el-input v-model="spuForm.defaultSkuId"></el-input>
      </el-form-item>
      <el-form-item label="是否上架" prop="online">
        <el-switch
          v-model="spuForm.online"
          :active-value="1"
          :inactive-value="0"
          active-text="上架"
          inactive-text="下架"
        ></el-switch>
      </el-form-item>
      <el-form-item label="主图" prop="img">
        <div class="flex banner-form__upload">
          <el-image
            v-if="spuForm.img"
            style="width: 100px; height: 100px"
            :src="spuForm.img"
            :preview-src-list="previewList"
          ></el-image>
          <el-upload
            class="ml-2 banner-form__upload"
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
      <el-form-item label="主题图" prop="forThemeImg">
        <div class="flex banner-form__upload">
          <el-image
            v-if="spuForm.forThemeImg"
            style="width: 100px; height: 100px"
            :src="spuForm.forThemeImg"
            :preview-src-list="previewList"
          ></el-image>
          <el-upload
            class="ml-2 banner-form__upload"
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
      <el-form-item label="轮播图" prop="spuImgs">
        <div class="flex banner-form__upload">
          <el-image
            v-if="spuForm.forThemeImg"
            style="width: 100px; height: 100px"
            :src="spuForm.forThemeImg"
            :preview-src-list="previewList"
          ></el-image>
          <el-upload
            class="ml-2 banner-form__upload"
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
      <el-form-item label="详情图" prop="spuDetailImgs">
        <div class="flex banner-form__upload">
          <el-image
            v-if="spuForm.forThemeImg"
            style="width: 100px; height: 100px"
            :src="spuForm.forThemeImg"
            :preview-src-list="previewList"
          ></el-image>
          <el-upload
            class="ml-2 banner-form__upload"
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
      <el-form-item label="标签" prop="spuDetailImgs">
        <el-input v-model="spuForm.tags"></el-input>
      </el-form-item>
      <el-form-item label="选择规格" prop="spuKeys">
        <el-input v-model="spuForm.spuKeys"></el-input>
      </el-form-item>
      <el-form-item label="可视规格" prop="sketchSpecId">
        <el-input v-model="spuForm.sketchSpecId"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="spuForm.description"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, reactive, toRefs, computed } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { Plus } from '@element-plus/icons'
import { FileHandler, ElFile } from 'element-plus/lib/components/upload/src/upload.type'
import { uploadFileToOSS } from '@/api/upload'
import { SpuModel } from '@/api/spu'
import { get as lodashGet } from 'lodash'
import { SUCCESS_CODE } from '@/config/constant'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
  // 规格名操作表单，用于编辑和新增
  name: 'SpuForm',
  components: { Plus },
  props: {
    defaultData: {
      type: Object as PropType<null | SpuModel>,
      default: null,
    },
  },
  setup(props) {
    const state = reactive({
      spuForm: {
        id: undefined,
        title: '',
        subtitle: '',
        defaultSkuId: 0,
        img: '',
        forThemeImg: '',
        tags: '',
        description: '',
        sketchSpecId: 0,
      } as SpuModel,
      spuList: [],
      ELFormRef: null as null | ELFormCtx,
      fileList: [] as ElFile[],
    })

    const spuFormRules = {
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

    const handleSubmit = (): Promise<SpuModel> => {
      return new Promise((resolve) => {
        state.ELFormRef?.validate((valid) => {
          if (valid) {
            resolve(state.spuForm)
          }
        })
      })
    }

    const previewList = computed(() => {
      return [state.spuForm.img]
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
          state.spuForm.img = res.data.data.url
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
      state.spuForm = {
        id: undefined,
        title: '',
      } as SpuModel
    }

    watch(
      () => props.defaultData,
      (val) => {
        if (val) {
          state.spuForm = val
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
      spuFormRules,
      handleSubmit,
      resetForm,
      previewList,
      beforeUpload,
      handleFileChange,
      uploadImageToOSS,
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
