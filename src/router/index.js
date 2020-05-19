// export default router
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Users from '../components/users/Users.vue'
import Welcome from '../components/Welcome.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/shop/Cate.vue'
import Goods from '../components/shop/Goods.vue'
import Params from '../components/shop/Params.vue'
import Add from '../components/shop/Add.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'
Vue.use(VueRouter)
// 导入模板
// 配置路由规则
const router = new VueRouter({
  routes:[
    { path: '/', redirect:'/login' },
    { path:'/login', component:Login },
    {
      path:'/Home',
      component: Home,
      redirect: '/Welcome',
      children : [
        { path: '/Welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/goods', component: Goods },
        { path: '/orders', component: Order },
        { path: '/params', component: Params },
        { path: '/goods/add', component: Add },
        { path: '/reports', component: Report }
      ]
    }
  ]
})

// 监听路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路由  from 从哪个路由跳转过来的 next() 执行下一个操作
  // 如果要去login 页面则 进入判断
  if (to.path === '/login') {
    return next()
  }
  // 如果不是去login 判断有没有保存token
  const token = window.sessionStorage.getItem('token')
  // 如果没获取到 token 则强制跳转到 login界面
  if (!token) return next('/login')
  // 如果拿到了 则放行
  next()
})

export default router
