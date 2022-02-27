<template>
  <div class="spec-form">
    <el-form ref="ELFormRef" size="small" :model="spuForm" :rules="spuFormRules">
      <el-row justify="space-between">
        <el-col :lg="11">
          <el-form-item label="标题" prop="title">
            <el-input v-model="spuForm.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="副标题" prop="subtitle">
            <el-input v-model="spuForm.subtitle" placeholder="请输入副标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="价格" prop="price">
            <el-input v-model="spuForm.price" placeholder="请输入价格"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="分类" prop="categoryId">
            <el-select v-model="spuForm.categoryId" placeholder="选择分类">
              <el-option v-for="item in subCategoryList" :key="item.id" :value="item.id">
                {{ item.id + item.name }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="默认sku" prop="defaultSkuId">
            <el-input v-model="spuForm.defaultSkuId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="是否上架" prop="online">
            <el-switch
              v-model="spuForm.online"
              :active-value="1"
              :inactive-value="0"
              active-text="上架"
              inactive-text="下架"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="主图" prop="img">
            <div class="flex banner-form__upload">
              <el-image
                v-if="spuForm.img"
                style="width: 60px; height: 60px"
                :src="spuForm.img"
                :preview-src-list="[spuForm.img]"
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
        </el-col>
        <el-col :lg="11">
          <el-form-item label="主题图" prop="forThemeImg">
            <div class="flex banner-form__upload">
              <el-image
                v-if="spuForm.forThemeImg"
                style="width: 60px; height: 60px"
                :src="spuForm.forThemeImg"
                :preview-src-list="[spuForm.forThemeImg]"
              ></el-image>
              <el-upload
                class="ml-2 banner-form__upload"
                action=""
                list-type="picture-card"
                :http-request="uploadThemeImgToOSS"
                :show-file-list="false"
                :on-change="handleThemeImgFileChange"
                :before-upload="beforeUpload"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="轮播图" prop="spuImgs">
            <div class="flex banner-form__upload">
              <el-image
                v-for="(item, index) in spuForm.spuImgs || []"
                :key="index"
                style="width: 60px; height: 60px; margin-right: 4px"
                :src="item.img"
                :preview-src-list="spuForm.spuImgs"
              ></el-image>
              <el-upload
                class="ml-2 banner-form__upload"
                action=""
                list-type="picture-card"
                :http-request="uploadSpuImgsToOSS"
                :show-file-list="false"
                :on-change="handleSpuImgsFileChange"
                :before-upload="beforeUpload"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="详情图" prop="spuDetailImgs">
            <div class="flex banner-form__upload">
              <el-image
                v-for="(item, index) in spuForm.spuDetailImgs || []"
                :key="index"
                style="width: 60px; height: 60px; margin-right: 4px"
                :src="item.img"
                :preview-src-list="spuForm.spuDetailImgs"
              ></el-image>
              <el-upload
                class="ml-2 banner-form__upload"
                action=""
                list-type="picture-card"
                :http-request="uploadSpuDetailImgsToOSS"
                :show-file-list="false"
                :on-change="handleDetailImgsFileChange"
                :before-upload="beforeUpload"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="标签" prop="tags">
            <el-input v-model="spuForm.tags"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="规格" prop="spuKeys">
            <el-select v-model="spuForm.spuKeys" multiple placeholder="选择规格">
              <el-option v-for="item in specKeyList" :key="item.id" :value="item.id">
                {{ item.id + item.name }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item v-if="spuForm?.spuKeys?.length > 0" label="可视规格" prop="sketchSpecId">
            <el-select v-model="spuForm.sketchSpecId" placeholder="选择可视规格">
              <el-option v-for="item in spuForm.spuKeys" :key="item" :value="item">{{ item }}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="描述" prop="description">
            <el-input v-model="spuForm.description"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="11"></el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, reactive, toRefs } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { Plus } from '@element-plus/icons'
import { FileHandler, ElFile } from 'element-plus/lib/components/upload/src/upload.type'
import { uploadFileToOSS } from '@/api/upload'
import { SpuDetailImgModel, SpuImgModel, SpuModel } from '@/api/spu'
import { getSpecKeyListApi, SpecKeyModel } from '@/api/spec'
import { CategoryModel, getSubCategoryListApi } from '@/api/category'
import { get as lodashGet } from 'lodash'
import { SUCCESS_CODE } from '@/config/constant'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
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
        spuImgs: [] as SpuImgModel[],
        spuDetailImgs: [] as SpuDetailImgModel[],
      } as SpuModel,
      specKeyList: [] as SpecKeyModel[],
      subCategoryList: [] as CategoryModel[],
      ELFormRef: null as null | ELFormCtx,
      fileList: [] as ElFile[],
      themeFileList: [] as ElFile[],
      spuImgsFileList: [] as ElFile[],
      detailImgsFileList: [] as ElFile[],
    })

    const spuFormRules = {}

    const handleSubmit = (): Promise<SpuModel> => {
      return new Promise((resolve) => {
        state.ELFormRef?.validate((valid) => {
          if (valid) {
            resolve(state.spuForm)
          }
        })
      })
    }

    const beforeUpload = () => {
      return true
    }

    const handleFileChange: FileHandler = (file) => {
      state.fileList = []
      state.fileList.push(file.raw)
    }

    const handleThemeImgFileChange: FileHandler = (file) => {
      state.themeFileList = []
      state.themeFileList.push(file.raw)
    }
    const handleSpuImgsFileChange: FileHandler = (file) => {
      state.spuImgsFileList = []
      state.spuImgsFileList.push(file.raw)
    }
    const handleDetailImgsFileChange: FileHandler = (file) => {
      state.detailImgsFileList = []
      state.detailImgsFileList.push(file.raw)
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

    const uploadThemeImgToOSS = async () => {
      try {
        const form = new FormData()
        const file = state.themeFileList[0]
        form.append('file', file)
        const res = await uploadFileToOSS(form)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          state.spuForm.forThemeImg = res.data.data.url
          ElMessage.success(`${message}`)
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('上传时发生错误')
      }
    }

    const uploadSpuImgsToOSS = async () => {
      try {
        const form = new FormData()
        const file = state.spuImgsFileList[0]
        state.spuImgsFileList = []
        form.append('file', file)
        const res = await uploadFileToOSS(form)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          if (!Array.isArray(state.spuForm.spuImgs)) {
            state.spuForm.spuImgs = []
          }
          if (state.spuForm.id) {
            state.spuForm.spuImgs.push({
              spuId: state.spuForm.id,
              img: res.data.data.url,
            })
          }

          ElMessage.success(`${message}`)
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('上传时发生错误')
      }
    }

    const uploadSpuDetailImgsToOSS = async () => {
      try {
        const form = new FormData()
        const file = state.detailImgsFileList[0]
        form.append('file', file)
        const res = await uploadFileToOSS(form)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          if (!Array.isArray(state.spuForm.spuDetailImgs)) {
            state.spuForm.spuDetailImgs = []
          }
          if (state.spuForm.id) {
            state.spuForm.spuDetailImgs.push({
              spuId: state.spuForm.id,
              img: res.data.data.url,
              index: 1,
            })
          }
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

    const getSpecKeyList = async () => {
      try {
        let res = await getSpecKeyListApi()
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          const list = lodashGet(res, 'data.data.list')
          state.specKeyList = list
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {}
    }

    const getSubCategoryList = async () => {
      try {
        let res = await getSubCategoryListApi()
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          const list = lodashGet(res, 'data.data.list')
          state.subCategoryList = list
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {}
    }
    getSubCategoryList()
    getSpecKeyList()
    return {
      ...toRefs(state),
      spuFormRules,
      handleSubmit,
      resetForm,
      beforeUpload,
      handleFileChange,
      handleThemeImgFileChange,
      handleSpuImgsFileChange,
      handleDetailImgsFileChange,
      uploadImageToOSS,
      uploadThemeImgToOSS,
      uploadSpuImgsToOSS,
      uploadSpuDetailImgsToOSS,
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
    }
  }
}
</style>
