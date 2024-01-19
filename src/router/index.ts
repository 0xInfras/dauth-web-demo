import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import KycPage from "../views/KycPage.vue"
import CheckOut from "../views/CheckOut.vue"
import FiatOrder from "../views/FiatOrder.vue"
import CryptoOrder from "../views/CryptoOrder.vue"
import PayWithCrypto from "../views/PayWithCrypto.vue"
import PayWithFiat from "../views/PayWithFiat.vue"
import CheckOutFiat from "../views/CheckOutFiat.vue"
import TgLoginView from '../views/TgLogin.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    name: 'KycPage',
    path: '/KycPage',
    component: KycPage
  },
  {
    name: 'CheckOut',
    path: '/CheckOut',
    component: CheckOutFiat
  },
  {
    name: 'FiatOrder',
    path: '/FiatOrder',
    component: FiatOrder
  },
  {
    name: 'CryptoOrder',
    path: '/CryptoOrder',
    component: CryptoOrder
  },
  {
    name: 'PayWithFiat',
    path: '/PayWithFiat',
    component: PayWithFiat
  },
  {
    name: 'PayWithCrypto',
    path: '/PayWithCrypto',
    component: PayWithCrypto
  },
  {
    name: 'TgLogin',
    path: '/TgLogin',
    component: TgLoginView
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
