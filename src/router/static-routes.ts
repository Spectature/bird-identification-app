import type { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/',
    component: () => import('@/views/identify-img/select-img.vue'),
    meta: {
      title: '选择图片',
    },
  },
  {
    path: '/res/:imagePath',
    component: () => import('@/views/identify-img/result.vue'),
    meta: {
      title: '识别结果',
    },
  },
  {
    path: '/today-img',
    component: () => import('@/views/today-img/today-img.vue'),
    meta: {
      title: '今日趣图',
    },
  },
  {
    path: '/bird-nest',
    component: () => import('@/views/bird-nest/bird-nest.vue'),
    meta: {
      title: '鸟窝探秘',
    },
  },
  {
    path: '/sub',
    component: () => import('@/subcontract/views/sub/sub.vue'),
    meta: {
      title: '分包',
    },
  },
  // {
  //   path: '/:pathMatch(.*)',
  //   meta: {
  //     title: '找不到页面',
  //   },
  //   component: () => import('~/views/exception/error.vue'),
  // },
] as RouteRecordRaw[];
