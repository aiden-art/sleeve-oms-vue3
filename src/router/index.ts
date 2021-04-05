/*
 * @Author: genfa.zeng
 * @Date: 2021-02-01 10:14:04
 * @LastEditors: genfa.zeng
 * @LastEditTime: 2021-02-01 15:06:53
 * @Description:
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import layout from '../layout/index.vue'
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: layout,
    meta: { icon: 'el-icon-s-home', title: '系统首页', showLink: true },
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashBoard/index.vue'),
        meta: { icon: 'el-icon-s-home', title: '首页', showLink: true },
      },
    ],
  },
  {
    path: '/clientData',
    name: 'ClientData',
    component: layout,
    redirect: '/clientData/orderList',
    meta: {
      icon: 'el-icon-s-data',
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
      icon: 'el-icon-picture',
      title: 'Banner管理',
      showLink: true,
    },
    children: [
      {
        path: '/banner/list',
        name: 'BannerList',
        component: () => import('@/views/banner/bannerList.vue'),
        meta: {
          icon: '',
          title: 'banner列表',
          showLink: true,
        },
      },
      {
        path: '/banner/add',
        name: 'BannerAdd',
        component: () => import('@/views/banner/bannerAdd.vue'),
        meta: {
          icon: '',
          title: '创建banner',
          showLink: true,
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
      icon: 'el-icon-files',
      title: '分类管理',
      showLink: true,
    },
    children: [
      {
        path: '/category/list',
        name: 'CategoryList',
        component: () => import('../components/HelloWorld.vue'),
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
      icon: 'el-icon-s-grid',
      title: '六宫格管理',
      showLink: true,
    },
    children: [
      {
        path: '/grid/list',
        name: 'GridList',
        component: () => import('../components/HelloWorld.vue'),
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
      icon: 'el-icon-present',
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
      icon: 'el-icon-shopping-bag-1',
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
      icon: 'el-icon-shopping-bag-2',
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
      icon: 'el-icon-film',
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
      icon: 'el-icon-reading',
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
