import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/components/Home";
import About from "@/components/footerpages/About";
import Contact from "@/components/footerpages/Contact";
import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import Landingpage from "@/components/landingpage";
import addPortfolio from "@/components/portfolio/addPortfolio";

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
  },
  {
    path: '/Contact',
    name: 'contact',
    component: Contact
  },
  {
    path: '/adPortfolio',
    name: 'adPortfolio',
    component: addPortfolio
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
