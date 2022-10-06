import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import axios from 'vue-axios'

Vue.prototype.$http = axios;
export const bus = new Vue()

const token = localStorage.getItem('token');
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  axios,
  render: h => h(App)
}).$mount('#app')
