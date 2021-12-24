import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)

// 全局时间过滤器
Vue.filter('timeFilter', (originTime) => {
  const nt = new Date(originTime)
  const y = nt.getFullYear()
  const m = (nt.getMonth() + 1 + '').padStart(2, '0')
  const d = (nt.getDate() + '').padStart(2, '0')

  const hh = (nt.getHours() + '').padStart(2, '0')
  const mm = (nt.getMinutes() + '').padStart(2, '0')
  const ss = (nt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
