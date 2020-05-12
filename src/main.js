import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'// 导入element
// import 'element-ui/lib/theme-chalk/index.css'
import './assets/global.less' // 导入全局样式
import './assets/fonts/iconfont.css' // 导入字体图标
import axios from 'axios' // 导入axios
// 将axios添加到vue原型对象上
Vue.prototype.$http = axios
// Vue.prototype.$http = axios
// 配置url基准值
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
