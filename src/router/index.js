import Vue from 'vue'
import VueRouter from 'vue-router'
import { AUTH_LAYOUT } from '@/constants/layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      layout: AUTH_LAYOUT,
    },
    component: () => import('@/views/Login.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
