import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'// 导入element
// import 'element-ui/lib/theme-chalk/index.css'
import './assets/global.less' // 导入全局样式
import './assets/fonts/iconfont.css' // 导入字体图标
import ZkTable from 'vue-table-with-tree-grid' // 导入商品分类去 表格插件
// 导入富文本插件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//导入进度条插件
import NProgress from 'nprogress'
//导入进度条样式
import 'nprogress/nprogress.css'
// 注册 表格插件
import axios from 'axios' // 导入axios
Vue.use(VueQuillEditor /* { default global options } */)
Vue.use(ZkTable)

// 将axios添加到vue原型对象上
Vue.prototype.$http = axios
// 隐藏 NProgress 插件的进度环
NProgress.configure({ showSpinner: false })
// 设置请求拦截器
axios.interceptors.request.use(config => {
  // 请求之前显示进度条
  NProgress.start()
  // console.log(config)
  // 文档要求  必须在请求头中使用  Authorization字段提供（携带）token令牌
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
//在response拦截器中，隐藏进度条
axios.interceptors.response.use(config =>{
  //当进入response拦截器，表示请求已经结束，我们就结束进度条
  NProgress.done()
  return config
})

// 配置url基准值
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
