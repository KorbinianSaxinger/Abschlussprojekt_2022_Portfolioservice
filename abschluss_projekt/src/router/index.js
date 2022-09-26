import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/components/Home";
import About from "@/components/footerpages/About";
import Contact from "@/components/footerpages/Contact";
import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import Landingpage from "@/components/landingpage";
import Chart from "@/components/portfolios/chart";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'landing',
    component: Landingpage
  },
  {
    path: '/Home',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/Login',
    name: 'login',
    component: Login
  },
  {
    path: '/Register',
    name: 'register',
    component: Register
  },
  {
    path: '/about',
    name: 'about',
    component: About
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../components/About.vue')
  },
  {
    path: '/Contact',
    name: 'contact',
    component: Contact
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../components/Contact')
  },
  {
    path: '/chart',
    name: 'chart',
    component: Chart
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../components/Contact')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
