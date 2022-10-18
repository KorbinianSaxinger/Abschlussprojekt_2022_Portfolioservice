import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/components/Home";
import About from "@/components/footerpages/About";
import Contact from "@/components/footerpages/Contact";
import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import Landingpage from "@/components/landingpage";
import portfolioTabs from "@/components/portfolios/portfolioTabs";
import createPosition from "@/components/positions/createPosition";
import getAllPrices from "@/components/realtimedata/getAllPrices";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'landing',
    component: Landingpage
  },
  {
    path: '/getprices',
    name: 'getPrices',
    component: getAllPrices
  },
  {
    path: '/home',
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
  },
  {
    path: '/portfolios/:portfolioId',
    name: 'portfolios',
    props: true,
    component: portfolioTabs
  },
  {
    path: '/positions',
    name: 'createPosition',
    props: true,
    component: createPosition
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
