/*
 * @Author: genfa.zeng
 * @Date: 2022-03-13 14:33:43
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2022-03-13 15:06:44
 * @FilePath: /sleeve-oms/src/store/global.ts
 * @Description:
 */
import { defineStore } from 'pinia'
import { getSubCategoryListApi, CategoryModel } from '@/api/category'
import { get as lodashGet } from 'lodash'
import { SUCCESS_CODE } from '@/config/constant'
import { getSpuListApi, SpuModel } from '@/api/spu'

type GlobalDataStateType = {
  subCategoryList: CategoryModel[]
  subCategoryMap: Map<number, string>
  spuList: SpuModel[]
}

export const useGlobalData = defineStore('globalData', {
  state: (): GlobalDataStateType => {
    return {
      subCategoryList: [],
      spuList: [],
      subCategoryMap: new Map([]),
    }
  },
  actions: {
    async getStoreSubCategoryList() {
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
    async getStoreSpuList() {
      try {
        const res = await getSpuListApi()
        const code = lodashGet(res, 'data.code')
        if (code === SUCCESS_CODE) {
          const list = lodashGet(res, 'data.data.list')
          this.spuList = list
        }
      } catch (e) {
        return e
      }
    },
  },
})
