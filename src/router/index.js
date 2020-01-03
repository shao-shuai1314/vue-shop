import Vue from 'vue'
import VueRouter from 'vue-router'
// import login from '@/components/login/login'
const login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/login/login')
// import home from '@/components/home/home'
const home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/home/home')

// import welcome from '@/components/home/welcome'
const welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/home/welcome')


// import user from '@/components/user/user'
const user = () => import(/* webpackChunkName: "user-rights-roles" */ '@/components/user/user')

// import rights from '@/components/power/rights'
const rights = () => import(/* webpackChunkName: "user-rights-roles" */ '@/components/power/rights')

// import roles from '@/components/power/roles'
const roles = () => import(/* webpackChunkName: "user-rights-roles" */ '@/components//power/roles')

// import cate from '@/components/goods/cate'
const cate = () => import(/* webpackChunkName: "cate" */ '@/components/goods/cate')

// import report from '@/components/report/report'
const report = () => import(/* webpackChunkName: "report-order" */ '@/components/report/report')

// import order from '@/components/order/order'
const order = () => import(/* webpackChunkName: "report-order" */ '@/components/order/order')




Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    redirect:"/welcome",
    children:[
      {path:'/welcome',component:welcome},
      {path:'/users',component:user},
      {path:'/rights',component:rights},
      {path:'/roles',component:roles},
      {path:'/categories',component:cate},
      {path:'/reports',component:report},
      {path:'/orders',component:order}




    ]
  }
]

const router = new VueRouter({
  mode:'history',
  routes
})

export default router
