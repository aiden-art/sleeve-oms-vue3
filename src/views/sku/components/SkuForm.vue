<template>
  <div class="spec-form">
    <el-form ref="ELFormRef" size="small" :model="skuForm" label-width="120px" :rules="skuFormRules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="skuForm.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input-number v-model="skuForm.price"></el-input-number>
      </el-form-item>
      <el-form-item label="折扣价" prop="discountPrice">
        <el-input-number v-model="skuForm.discountPrice"></el-input-number>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input-number v-model="skuForm.stock"></el-input-number>
      </el-form-item>
      <el-form-item label="SPU" prop="spuId">
        <el-select v-model="skuForm.spuId">
          <el-option v-for="item in spuList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否上架" prop="online">
        <el-switch
          v-model="skuForm.online"
          :active-value="1"
          :inactive-value="0"
          active-text="上架"
          inactive-text="下架"
        ></el-switch>
      </el-form-item>
      <el-form-item label="图片" prop="img">
        <div class="flex banner-form__upload">
          <el-image
            v-if="skuForm.img"
            style="width: 100px; height: 100px"
            :src="skuForm.img"
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
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, reactive, toRefs, computed } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { Plus } from '@element-plus/icons'
import { FileHandler, ElFile } from 'element-plus/lib/components/upload/src/upload.type'
import { uploadFileToOSS } from '@/api/upload'
import { SkuModel } from '@/api/sku'
import { get as lodashGet } from 'lodash'
import { SUCCESS_CODE } from '@/config/constant'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
  // 规格名操作表单，用于编辑和新增
  name: 'SkuForm',
  components: { Plus },
  props: {
    defaultData: {
      type: Object as PropType<null | SkuModel>,
      default: null,
    },
  },
  setup(props) {
    const state = reactive({
      skuForm: {
        id: undefined,
        title: '',
        price: 0,
        discountPrice: 0,
        stock: 0,
        spuId: 0,
        online: 0,
        img: '',
      } as SkuModel,
      spuList: [],
      ELFormRef: null as null | ELFormCtx,
      fileList: [] as ElFile[],
    })

    const skuFormRules = {
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

    const handleSubmit = (): Promise<SkuModel> => {
      return new Promise((resolve) => {
        state.ELFormRef?.validate((valid) => {
          if (valid) {
            resolve(state.skuForm)
          }
        })
      })
    }

    const previewList = computed(() => {
      return [state.skuForm.img]
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
          state.skuForm.img = res.data.data.url
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
      state.skuForm = {
        id: undefined,
        title: '',
        price: 0,
        discountPrice: 0,
        stock: 0,
        spuId: 0,
        online: 0,
        img: '',
      } as SkuModel
    }

    watch(
      () => props.defaultData,
      (val) => {
        if (val) {
          state.skuForm = val
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
      skuFormRules,
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
