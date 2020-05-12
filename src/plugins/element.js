import Vue from 'vue'
// 导入各种element的小组件
import { Form, FormItem, Input, Button, Message, Container, Header, Aside, Main } from 'element-ui'
// 注册 在vue实例
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.prototype.$message = Message
