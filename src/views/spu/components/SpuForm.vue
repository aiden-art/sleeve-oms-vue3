<template>
  <div class="spec-form">
    <el-form ref="ELFormRef" :model="spuForm" :rules="spuFormRules">
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
            <el-select v-model="spuForm.categoryId" placeholder="选择分类" style="width: 100%">
              <el-option
                v-for="item in globalDataStore.subCategoryList"
                :key="item.id"
                :label="`${item.name}`"
                :value="item.id"
              >
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
            <ImageUpload v-model="spuForm.img" :limit="1" />
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="主题图" prop="forThemeImg">
            <ImageUpload v-model="spuForm.forThemeImg" :limit="1" />
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="轮播图" prop="spuImgs">
            <ImageUpload v-model="spuForm.spuImgs" />
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="详情图" prop="spuDetailImgs">
            <ImageUpload v-model="spuForm.spuDetailImgs" />
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="标签" prop="tags">
            <el-input v-model="spuForm.tags"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item label="规格" prop="specKeys">
            <el-select v-model="spuForm.specKeys" style="width: 100%" multiple placeholder="选择规格">
              <el-option v-for="item in specKeyList" :key="item.id" :value="item.id" :label="`${item.id} ${item.name}`">
                {{ item.id + item.name }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="11">
          <el-form-item v-if="spuForm.specKeys && spuForm.specKeys?.length > 0" label="可视规格" prop="sketchSpecId">
            <el-select v-model="spuForm.sketchSpecId" placeholder="选择可视规格" style="width: 100%">
              <el-option v-for="item in specKeysList" :key="item" :value="item.id" :label="`${item.id} ${item.name}`">
                {{ `${item.id} ${item.name}` }}
              </el-option>
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
import { defineComponent, PropType, watch, reactive, toRefs, computed } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { SpuModel } from '@/api/spu'
import { getSpecKeyListApi, SpecKeyModel } from '@/api/spec'
import { CategoryModel } from '@/api/category'
import { get as lodashGet } from 'lodash'
import { SUCCESS_CODE } from '@/config/constant'
import ImageUpload from '@/components/ImageUpload/index.vue'
import { useGlobalData } from '@/store/global'

type ELFormCtx = InstanceType<typeof ElForm>

export default defineComponent({
  name: 'SpuForm',
  components: { ImageUpload },
  props: {
    defaultData: {
      type: Object as PropType<null | SpuModel>,
      default: null,
    },
  },
  setup(props) {
    const globalDataStore = useGlobalData()
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
        spuImgs: [] as string[],
        spuDetailImgs: [] as string[],
      } as SpuModel,
      specKeyList: [] as SpecKeyModel[],
      specKeyMap: new Map([]) as Map<number, string>,
      subCategoryList: [] as CategoryModel[],
      ELFormRef: null as null | ELFormCtx,
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

    const resetForm = () => {
      state.spuForm = {
        id: undefined,
        title: '',
      } as SpuModel
    }

    const specKeysList = computed(() => {
      if (state.spuForm.specKeys && state.spuForm.specKeys.length > 0) {
        return state.spuForm.specKeys?.map((e) => ({
          id: e,
          name: state.specKeyMap.get(e),
        }))
      }
      return []
    })

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
          if (list && list.length > 0) {
            list.forEach((item: SpecKeyModel) => {
              if (item.id) {
                state.specKeyMap.set(item.id, item.name)
              }
            })
          }
          state.specKeyList = list
        } else {
          ElMessage.error(`${message}`)
        }
      } catch (e) {}
    }
    getSpecKeyList()
    return {
      ...toRefs(state),
      spuFormRules,
      handleSubmit,
      resetForm,
      specKeysList,
      globalDataStore,
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
