import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入nprogress的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // 开始nprogress
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config=>{
  // 结束nprogress
  NProgress.done()
  return config
})

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)

// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

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
