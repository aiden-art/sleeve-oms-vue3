/*
 * @Author: genfa.zeng
 * @Date: 2021-02-01 10:14:04
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-12-07 15:04:16
 * @Description:
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import {
  House,
  Cellphone,
  Picture,
  Menu as MenuIcon,
  Grid,
  Present,
  Suitcase,
  Pouring,
  Sunny,
  IceCream,
} from '@element-plus/icons'
import layout from '../layout/index.vue'
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: layout,
    meta: { icon: House, title: '系统首页', showLink: true },
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashBoard/index.vue'),
        meta: { icon: House, title: '首页', showLink: true },
      },
    ],
  },
  {
    path: '/clientData',
    name: 'ClientData',
    component: layout,
    redirect: '/clientData/orderList',
    meta: {
      icon: Cellphone,
      title: 'C端数据',
      showLink: true,
    },
    children: [
      {
        path: '/clientData/orderList',
        name: 'OrderList',
        component: () => import('../components/HelloWorld.vue'),
        meta: {
          icon: '',
          title: '订单列表',
          showLink: true,
        },
      },
      {
        path: '/clientData/userList',
        name: 'userList',
        component: () => import('../components/HelloWorld.vue'),
        meta: {
          icon: '',
          title: 'c端用户列表',
          showLink: true,
        },
      },
    ],
  },
  {
    path: '/banner',
    name: 'Banner',
    component: layout,
    redirect: '/banner/list',
    meta: {
      icon: Picture,
      title: 'Banner管理',
      showLink: true,
    },
    children: [
      {
        path: '/banner/list',
        name: 'BannerList',
        component: () => import('@/views/banner/list.vue'),
        meta: {
          icon: '',
          title: 'banner列表',
          showLink: true,
        },
      },
      {
        path: '/banner/item-list/:bannerID',
        name: 'BannerItemList',
        component: () => import('@/views/banner/itemList.vue'),
        meta: {
          hidden: true,
          icon: '',
          title: 'bannerItem列表',
          showLink: false,
        },
      },
    ],
  },
  {
    path: '/category',
    name: 'Category',
    component: layout,
    redirect: '/category/list',
    meta: {
      icon: MenuIcon,
      title: '分类管理',
      showLink: true,
    },
    children: [
      {
        path: '/category/list',
        name: 'CategoryList',
        component: () => import('../views/category/index.vue'),
        meta: {
          icon: '',
          title: '分类列表',
          showLink: true,
        },
      },
    ],
  },
  {
    path: '/grid',
    name: 'Grid',
    component: layout,
    redirect: '/grid/list',
    meta: {
      icon: Grid,
      title: '六宫格管理',
      showLink: true,
    },
    children: [
      {
        path: '/grid/list',
        name: 'GridList',
        component: () => import('../views/grid/index.vue'),
        meta: {
          icon: '',
          title: '六宫格列表',
          showLink: true,
        },
      },
    ],
  },
  {
    path: '/spec',
    name: 'Spec',
    component: layout,
    redirect: '/spec/list',
    meta: {
      icon: Suitcase,
      title: '规格管理',
      showLink: true,
    },
    children: [
      {
        path: '/spec/list',
        name: 'SpecList',
        component: () => import('../components/HelloWorld.vue'),
        meta: {
          icon: '',
          title: '规格名列表',
          showLink: true,
        },
      },
      {
        path: '/spec/add',
        name: 'SpecAdd',
        component: () => import('../components/HelloWorld.vue'),
        meta: {
          icon: '',
          title: '创建规格名',
          showLink: true,
        },
      },
    ],
  },
  {
    path: '/spu',
    name: 'Spu',
    component: layout,
    redirect: '/spu/list',
    meta: {
      icon: Present,
      title: 'SPU管理',
      showLink: true,
    },
    children: [
      {
        path: '/spu/list',
        name: 'SpuList',
        component: () => import('../components/HelloWorld.vue'),
        meta: {
          icon: '',
          title: 'Spu列表',
          showLink: true,
        },
      },
    ],
  },
  {
    path: '/sku',
    name: 'Sku',
    component: layout,
    redirect: '/sku/list',
    meta: {
      icon: IceCream,
      title: 'SKU管理',
      showLink: true,
    },
    children: [
      {
        path: '/sku/list',
        name: 'SkuList',
        component: () => import('../components/HelloWorld.vue'),
        meta: {
          icon: '',
          title: 'SKU列表',
          showLink: true,
        },
      },
    ],
  },
  {
    path: '/theme',
    name: 'Theme',
    component: layout,
    redirect: '/theme/list',
    meta: {
      icon: Pouring,
      title: '主题管理',
      showLink: true,
    },
    children: [
      {
        path: '/theme/list',
        name: 'ThemeList',
        component: () => import('../components/HelloWorld.vue'),
        meta: {
          icon: '',
          title: '主题列表',
          showLink: true,
        },
      },
    ],
  },
  {
    path: '/activity',
    name: 'Activity',
    component: () => import('../components/HelloWorld.vue'),
    redirect: '/activity/list',
    meta: {
      icon: Sunny,
      title: '活动管理',
      showLink: true,
    },
    children: [
      {
        path: '/activity/list',
        name: 'ActivityList',
        component: () => import('../components/HelloWorld.vue'),
        meta: {
          icon: '',
          title: '活动列表',
          showLink: true,
        },
      },
      {
        path: '/activity/templateList',
        name: 'TemplateList',
        component: () => import('../components/HelloWorld.vue'),
        meta: {
          icon: '',
          title: '优惠券模板列表',
          showLink: true,
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
