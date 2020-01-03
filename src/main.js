import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 导入nprogress.进度条
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 配置路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 请求拦截
// 在request拦截器中展示进度条 NProgress.start()
axios.interceptors.request.use(config =>{
  nprogress.start()
  config.headers.Authorization=window.sessionStorage.getItem('token')
  //  必须return config
  return config
})
// 在response拦截器中隐藏进度条 NProgress.done()
axios.interceptors.response.use(config=>{
  nprogress.done()
  return config
})
Vue.prototype.$http = axios

// 公共样式
import '@/css/style.css'
// 引入element
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element.js'

import ZkTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', ZkTable)

Vue.config.productionTip = false
// 时间
Vue.filter('dateFormat',function(originVal){
  const dt =new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

 return `${y}-${m}-${d} ${hh}:${mm}:${ss} `
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
