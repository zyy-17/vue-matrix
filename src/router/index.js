import { createRouter, createWebHistory } from 'vue-router'

import IndexView from '@/views/index/index.vue'
import ClazzView from '@/views/clazz/index.vue'
import DeptView from '@/views/dept/index.vue'
import EmpView from '@/views/emp/index.vue'
import LogView from '@/views/log/index.vue'
import StuView from '@/views/stu/index.vue'
import EmpReportView from '@/views/report/emp/index.vue'
import StuReportView from '@/views/report/stu/index.vue'
import LayoutView from '@/views/layout/index.vue'
import LoginView from '@/views/login/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
     path: '/',
     name: '',
     component: LayoutView,
     redirect: '/index', //重定向
     children: [
      {path: 'index', name: 'index', component: IndexView},
      {path: 'clazz', name: 'clazz', component: ClazzView},
      {path: 'stu', name: 'stu', component: StuView},
      {path: 'dept', name: 'dept', component: DeptView},
      {path: 'emp', name: 'emp', component: EmpView},
      {path: 'log', name: 'log', component: LogView},

      {path: 'report/emp', name: 'empReport', component: EmpReportView},
      {path: 'report/stu', name: 'stuReport', component: StuReportView},
     ]
    },
    {path: '/login', name: 'login', component: LoginView}
  ]
})

//导航守卫 - 未登录用户只能访问登录页，已登录用户访问登录页自动跳转首页
router.beforeEach((to, from, next) => {
  const loginUser = localStorage.getItem('loginUser')
  if (to.path === '/login') {
    //已登录用户访问登录页时自动跳转到首页
    if (loginUser) {
      next('/index')
    } else {
      next()
    }
  } else {
    //未登录用户访问受保护页面时跳转到登录页
    if (!loginUser) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router