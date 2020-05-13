<template>
    <div>
      <!-- 1.面包屑导航 -->

      <!-- 3. 组件名当做双标签调用 使用属性传 要传的数据 子组件使用prop数组接收 数据 并在模板中当做data数据使用 传字符串 双引号内还要使用单引号 -->
      <Breadcrumb :firstmenu="'用户管理'" :secondarymenu="'用户列表'"></Breadcrumb>
      <!--卡片-->
      <el-card class="box-card">
        <div class="text item">
          <el-row :gutter="20">
            <el-col :span="10"><div class="grid-content bg-purple"><el-input placeholder="请输入内容" clearable @clear="getUserList" v-model="queryInfo.query" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input></div></el-col>
            <el-col :span="4"><div class="grid-content bg-purple"><el-button type="primary" @click="dialogVisible = true">添加用户</el-button></div></el-col>
            <el-col :span="10"><div class="grid-content bg-purple"></div></el-col>

          </el-row>
          <!--表格组件-->
          <el-table
            :data="userList"
            border
            style="width: 100%">
            <!--每一列-->
            <el-table-column prop="id" label="id" width="70px"></el-table-column>
            <el-table-column prop="username" label="用户名" ></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="手机号" ></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column label="状态">
              <!--// 设置状态 不需要设置prop值，这里使用作用域插槽显示对应的数据结构， 注意： scope是临时变量
              在临时变量中通过row属性来接收对应的数据对象-->
              <template #default="{ row }">
                <el-switch
                  @change="userStateChange(row)"
                  v-model="row.mg_state"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                <el-button @click="removeUser(row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false"><el-button type="warning" icon="el-icon-star-off" size="mini"></el-button></el-tooltip>
              </template>

            </el-table-column>

          </el-table>
          <!-- 分页组件 -->
          <!-- laout : 用来指定对应的布局结构
           page-sizes： 选项 一页多少条数据
           -->
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[2, 4, 6, 8]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
          <!-- 对话框 -->
          <div>
            <el-dialog
              title="添加用户"
              :visible.sync="dialogVisible"
              width="50%"
              @close="addDialogClosed">
              <!-- 对话框表单结构 model 绑定表单数据源-->
              <el-form :model="addForm" status-icon :rules="addFormRules" ref="addRef" label-width="70px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                  <el-input type="text" v-model="addForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password">
                  <el-input type="pass" v-model="addForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input type="text" v-model="addForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                  <el-input type="text" v-model="addForm.mobile" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUserInfo">确 定</el-button>
            </span>
            </el-dialog>
          </div>
        </div>
      </el-card>
    </div>
</template>

<script>
  // 使用面包屑
  // 1. 导入公共子组件
  import Breadcrumb from '../subComponents/breadcrumb.vue'
    export default {
      name: 'Users',
      data() {
        // 定义邮箱校验规则
        const checkEmail = (rule, value, callback) => {
          //  设置邮箱的正则表达式
          const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          if (regEmail.test(value)) {
            // 合法
            return callback()
          }
          // 失败
          callback(new Error('请输入合法邮箱'))
        }
        // 定义邮箱校验规则
        const checkMobile = (rule, value, callback) => {
          //  设置邮箱的正则表达式
          const regMobile = /^1[3456789]\d{9}$/
          if (regMobile.test(value)) {
            // 合法
            return callback()
          }
          // 失败
          callback(new Error('请输入合法手机号'))
        }

        return {
            queryInfo: {
              query: '',
              pagenum: 1, // 默认显示 第一页
              pagesize: 2// 每页两条数据
            },
          userList: [],
          total: 0,
          dialogVisible: false,
          // 表单数据对象
          addForm:{
            username: '',
            password: '',
            email: '',
            mobile: ''
          },
          // 表单验证对象
          addFormRules: {
              username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
              ],
              password: [
                { required: true, message: '请输入用密码', trigger: 'blur' },
                { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
              ],
              email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                // 调用自定义校验规则
                { validator: checkEmail, trigger: 'blur' }
              ],
              mobile: [
                { required: true, message: '请输入手机号', trigger: 'blur' },
                // 调用自定义校验规则
                { validator: checkMobile, trigger: 'blur' }
              ]

          }

          }
      },
      methods: {
        // 获取 用户信息列表
        async getUserList() {
          const { data: res } = await this.$http.get('users', {
            params: this.queryInfo
          })
          console.log(res)
          // 如果获取失败 提示框提示用户
          if (res.meta.status !== 200) return this.$message(res.meta.msg)
          // 成功 则进行业务逻辑
          this.userList = res.data.users
          this.total = res.data.total
          // 清空value值
          // this.queryInfo.query = ''
        },
        // 监听pagesize改变事件 ，
        handleSizeChange(newSize) {
          // console.log(newSize)
          // 获取到改变的值 赋值给 queryInfo 再重新获取数据 渲染 （因为getUserList 中传参传的是queryInfo 所以可以达到改变参数的效果）
          this.queryInfo.pagesize = newSize
          this.getUserList()
        },
        // 监听当前页数改变事件
        handleCurrentChange(newPage) {
          this.queryInfo.pagenum = newPage
          this.getUserList()
        },
        // 监听状态改变事件
        async userStateChange(userInfo) {
          // console.log(userInfo.id)
          const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
          // console.log(res)
          // 更改状态失败
          if (res.meta.status !== 200) {
            // 避免修改失败时 数据库中的没有修改 而页面上的被修了 这里取反值 重置
            userInfo.mg_state = !userInfo.mg_state
            this.$message.error('更改状态失败！')
            return
          }
          // 成功
          this.$message.success('更新状态成功')
        },
        // 添加用户 请求数据
        addUserInfo() {
          // 先验证
          // 这里asyns 发生了函数嵌套 所以 将async 移到 嵌套的额函数体前面
          this.$refs.addRef.validate(async valid => {
            if (!valid) return

            const { data: res } = await this.$http.post('users', this.addForm)
            // console.log(res)
            if (res.meta.status !== 201) {
              return this.$message.error('添加失败，稍后重试')
            }
            // 成功
            this.$message.success('添加成功')
            // 重新渲染
            this.getUserList()
            // 关闭对话框
            this.dialogVisible = false
          })
        },
        // 监听对话框关闭事件
        addDialogClosed() {
          // 重置表单  使用this.$refs 找到表单的 别名 调用 resetFields()
          this.$refs.addRef.resetFields()
        },
         removeUser(id) {
          this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 确认
              const { data: res } = await this.$http.delete(`users/${id}`)
              // console.log(this)
              console.log(res)
            // 如果数据总数 % 每页数量== 0 则 页码 -1 重新渲染
            if ((this.total - 1) % this.queryInfo.pagesize === 0) {
              this.queryInfo.pagenum = this.queryInfo.pagenum <= 0 ? 1 : this.queryInfo.pagenum -= 1
            }
            // console.log(this.total - 1)
            // console.log(this.queryInfo.pagesize)
            // console.log((this.total - 1) % this.queryInfo.pagesize)
            // 重新渲染
            this.getUserList()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
      created() {
        this.getUserList()
      },
      components:{
        // 2. 注册到父组件上
        Breadcrumb
      }
    }
</script>

<style scoped>

</style>
