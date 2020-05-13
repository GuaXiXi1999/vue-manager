// export default router
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Users from '../components/users/Users.vue'
import Welcome from '../components/Welcome.vue'
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
        { path: '/users', component: Users }
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
