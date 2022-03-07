import { defineStore } from 'pinia'
import { getSubCategoryListApi, CategoryModel } from '@/api/category'
import { get as lodashGet } from 'lodash'
import { SUCCESS_CODE } from '@/config/constant'

type GlobalDataStateType = {
  subCategoryList: CategoryModel[]
  subCategoryMap: Map<number, string>
}

export const useGlobalData = defineStore('globalData', {
  state: (): GlobalDataStateType => {
    return {
      subCategoryList: [],
      subCategoryMap: new Map([]),
    }
  },
  actions: {
    async getSubCategoryList() {
      try {
        const res = await getSubCategoryListApi()
        const code = lodashGet(res, 'data.code')
        if (code === SUCCESS_CODE) {
          const list = lodashGet(res, 'data.data.list')
          if (list && list.length > 0) {
            list.forEach((item: CategoryModel) => {
              if (item.id) {
                this.subCategoryMap.set(item.id, item.name)
              }
            })
          }
          this.subCategoryList = list
        }
      } catch (e) {
        return e
      }
    },
  },
})
