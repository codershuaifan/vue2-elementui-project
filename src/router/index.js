import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
// const Login = () => import('../components/Login.vue')
import Home from '../views/home/Home.vue'
// const Home = () => import('../views/home/Home.vue')
import Welcome from '../components/home/Welcome.vue'
// const Welcome = () => import('../components/home/Welcome.vue')

import Users from '../components/users/Users.vue'
// const Users = () => import('../components/users/Users.vue')
import Rights from '../components/power/Rights.vue'
// const Rights = () => import('../components/power/Rights.vue')
import Roles from '../components/power/Roles.vue'
// const Roles = () => import('../components/power/Roles.vue')

import Cate from '../components/goods/Cate.vue'
// const Cate = () => import('../components/goods/Cate.vue')
import Params from '../components/goods/Params.vue'
// const Params = () => import('../components/goods/Params.vue')
import Goods from '../components/goods/Goods.vue'
// const Goods = () => import('../components/goods/Goods.vue')

import Add from '../components/goods/Add.vue'
// const Add = () => import('../components/goods/Add.vue')
import Orders from '../components/orders/Orders.vue'
// const Orders = () => import('../components/orders/Orders.vue')
import Reports from '../components/reports/Reports.vue'
// const Reports = () => import('../components/reports/Reports.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Reports
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') next()
  const istoken = window.sessionStorage.getItem('token')
  if (!istoken) next('/login')
  else next()
})

export default router
