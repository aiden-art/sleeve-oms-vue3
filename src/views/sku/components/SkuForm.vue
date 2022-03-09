<template>
  <div class="spec-form">
    <el-form ref="ELFormRef" size="small" :model="skuForm" :rules="skuFormRules">
      <el-row justify="space-between">
        <el-col :lg="11">
          <el-form-item label="标题" prop="title">
            <el-input v-model="skuForm.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="价格" prop="price">
            <el-input-number v-model="skuForm.price" class="w-full"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="折扣价" prop="discountPrice">
            <el-input-number v-model="skuForm.discountPrice" class="w-full"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="库存" prop="stock">
            <el-input-number v-model="skuForm.stock" class="w-full"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="SPU" prop="spuId">
            <el-select v-model="skuForm.spuId" class="w-full" placeholder="选择SPU">
              <el-option v-for="item in spuList" :key="item.id" :label="`${item.id} ${item.title}`" :value="item.id">
                {{ `${item.id} ${item.title}` }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="是否上架" prop="online">
            <el-switch
              v-model="skuForm.online"
              class="w-full"
              :active-value="1"
              :inactive-value="0"
              active-text="上架"
              inactive-text="下架"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="图片" prop="img">
            <ImageUpload v-model="skuForm.img" :limit="1" />
          </el-form-item>
        </el-col>
        <template v-if="skuForm.specs && spuSpecList && spuSpecList.length > 0 && skuForm.specs.length > 0">
          <el-col v-for="(item, index) in skuForm.specs" :key="index" :lg="11">
            <el-form-item v-if="spuSpecList[index]" :label="`选择${item.key}`" :prop="`specs.${index}.valueId`">
              <el-select v-model="item.valueId" class="w-full" placeholder="选择规格值">
                <el-option
                  v-for="specValue in spuSpecList[index].specValues"
                  :key="specValue.id"
                  :label="`${specValue.id} ${specValue.value}`"
                  :value="specValue.id"
                >
                  {{ `${specValue.id} ${specValue.value}` }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, reactive, toRefs, computed } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import ImageUpload from '@/components/ImageUpload/index.vue'
import { SkuModel } from '@/api/sku'
import { getSpuListApi, getSpuSpecApi, SpuModel, SpuSpecModel } from '@/api/spu'
import { get as lodashGet } from 'lodash'
import { SUCCESS_CODE } from '@/config/constant'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
  name: 'SkuForm',
  components: { ImageUpload },
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
        spuId: undefined,
        online: 0,
        img: '',
      } as SkuModel,
      spuList: [] as SpuModel[],
      spuSpecDetail: {} as SpuSpecModel,
      ELFormRef: null as null | ELFormCtx,
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
            resolve({ ...state.skuForm, code: code.value })
          }
        })
      })
    }

    const initSpuList = async () => {
      try {
        let res = await getSpuListApi()
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          const list = lodashGet(res, 'data.data.list')
          state.spuList = list
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('获取spu列表发生错误')
      }
    }

    const initSpecsData = () => {
      const skuSpecs = state.skuForm.specs
      console.log('skuSpecs', skuSpecs)
      if (!skuSpecs || skuSpecs.length === 0) {
        state.spuSpecDetail.specKeys.forEach((item) => {
          state.skuForm.specs.push({
            key: item.name,
            keyId: item.id,
            valueId: undefined,
          })
        })
      }
    }

    const getSpuSpecDetail = async (spuId: number) => {
      try {
        let res = await getSpuSpecApi(spuId)
        const code = lodashGet(res, 'data.code')
        const message = lodashGet(res, 'data.message')
        if (code === SUCCESS_CODE) {
          state.spuSpecDetail = res.data.data
          //初始化规格数据
          initSpecsData()
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {
        console.log(e)
        ElMessage.error('获取spu列表发生错误')
      }
    }

    const spuSpecList = computed(() => state.spuSpecDetail.specKeys)

    const code = computed(() => {
      const { spuId, specs } = state.skuForm
      let codePrefix = `${spuId}$`
      specs.forEach((spec, index) => {
        codePrefix += `${spec.keyId}-${spec.valueId}${index === specs.length - 1 ? '' : '#'}`
      })
      return codePrefix
    })

    const resetForm = () => {
      state.skuForm = {
        id: undefined,
        title: '',
        price: 0,
        discountPrice: 0,
        stock: 0,
        spuId: undefined,
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

    //查询商品详情
    watch(
      () => state.skuForm.spuId,
      (val) => {
        if (val) {
          getSpuSpecDetail(val)
        } else {
          state.spuSpecDetail = {} as SpuSpecModel
        }
      },
      {
        immediate: true,
      }
    )

    initSpuList()

    return {
      ...toRefs(state),
      skuFormRules,
      handleSubmit,
      resetForm,
      spuSpecList,
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
