import Vue from 'vue'
import VueRouter from 'vue-router'
import { AUTH_LAYOUT, DEFAULT_LAYOUT } from '@/constants/layout'
import authenticate from '@/middleware/authenticate'
import redirectIfAuthenticated from '@/middleware/redirectIfAuthenticated'
import callback from '@/middleware/callback'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      layout: DEFAULT_LAYOUT,
      requiresLogin: true,
    },
    redirect: '/settings/base',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: {
      layout: DEFAULT_LAYOUT,
      requiresLogin: true,
    },
    component: () => import('@/views/settings/Index.vue'),
    children: [
      {
        path: 'base',
        name: 'Base',
        meta: {
          layout: DEFAULT_LAYOUT,
          requiresLogin: true,
        },
        component: () => import('@/components/Settings/BaseSetting.vue'),
      },
      {
        path: 'currency',
        name: 'Currency',
        meta: {
          layout: DEFAULT_LAYOUT,
          requiresLogin: true,
        },
        component: () => import('@/components/Settings/CurrencySetting.vue'),
      },
      {
        path: 'menu',
        name: 'Menu',
        meta: {
          layout: DEFAULT_LAYOUT,
          requiresLogin: true,
        },
        component: () => import('@/components/Settings/MenuSetting.vue'),
      },
    ],
  },
  {
    path: '/store',
    name: 'store',
    meta: {
      layout: DEFAULT_LAYOUT,
      requiresLogin: true,
    },
    component: () => import('@/views/store/Index.vue'),
    children: [
      {
        path: 'categories',
        name: 'StoreCategories',
        meta: {
          layout: DEFAULT_LAYOUT,
          requiresLogin: true,
        },
        component: () => import('@/components/Store/CategoriesStore.vue'),
      },
      {
        path: 'groups',
        name: 'StoreGroups',
        meta: {
          layout: DEFAULT_LAYOUT,
          requiresLogin: true,
        },
        component: () => import('@/components/Store/GroupsStore.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      layout: AUTH_LAYOUT,
    },
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/callback',
    meta: {
      layout: 'auth',
    },
    component: () => import('@/views/Login.vue'),
    beforeEnter: callback,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach(authenticate)
router.beforeEach(redirectIfAuthenticated)

export default router
