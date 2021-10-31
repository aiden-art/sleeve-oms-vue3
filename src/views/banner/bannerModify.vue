<template>
  <div class="modify-container">
    <div class="modify-container__header">
      <span>修改Banner</span>
      <span class="back" @click="back"> <i class="el-icon-back"></i> 返回 </span>
    </div>
    <el-divider></el-divider>
    <div class="modify-container__wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form ref="formRef" :model="form" status-icon label-width="100px" @submit.prevent>
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" size="medium" placeholder="请填写名称"></el-input>
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" size="medium" placeholder="请填写标题"></el-input>
            </el-form-item>
            <el-form-item label="主图" prop="img">
              <el-input v-model="form.img" size="medium" placeholder="请填写主图"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model="form.description" size="medium" type="textarea" :rows="4" placeholder="请输入描述">
              </el-input>
            </el-form-item>
            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm('form')">保 存</el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { BannerModel, editBannerApi, getBannerDetailApi } from '@/api/banner'

export default defineComponent({
  //banner编辑
  name: 'BannerModify',
  props: {
    bannerId: {
      type: Number,
      required: true,
      default: null,
    },
  },
  emits: ['on-back'],
  setup(props, { emit }) {
    const formRef = ref<HTMLDivElement | null>(null)
    const form = ref<BannerModel>({
      id: 0,
      img: '',
      name: '',
      title: '',
      description: '',
    })

    //查询banner详情
    async function getBannerDetail(id: number) {
      let { data: response } = await getBannerDetailApi(id)
      form.value = response.data
    }

    // 修改banner
    async function editBanner(info: BannerModel) {
      let result = await editBannerApi(info)
      ElMessage.success(`${result.data.message}`)
    }

    function submitForm() {
      editBanner(form.value!)
    }

    function resetForm() {
      if (formRef.value) {
        // formRef.value.resetFields()
      }
    }

    //返回
    function back() {
      emit('on-back')
    }

    getBannerDetail(props.bannerId)

    return {
      form,
      formRef,
      submitForm,
      resetForm,
      back,
    }
  },
})
</script>
<style lang="scss">
.modify-container {
  &__header {
    @include flex(row, space-between, center);
  }
  .back {
    cursor: pointer;
  }
}
</style>
