import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/home.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
    },
    component: () => import('../views/login.vue'),
  },
  {
    path: '/share-article',
    name: 'share-article',
    meta: {
      title: '分享',
    },
    component: () => import('../views/share-article.vue'),
  },
  {
    path: '/not-found',
    name: 'not-found',
    meta: {
      title: '404',
    },
    component: () => import('../views/404.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
