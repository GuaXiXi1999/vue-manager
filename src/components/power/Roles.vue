<template>
    <div>
      <el-card>
        <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        <el-table :data="rolesList" border>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <!-- 渲染对应的权限列表 -->
            <template #default="{ row }">
              <el-row v-for="(item1, i1) in row.children" :key="item1.id" :class="['bdBottom','itemsCenter', i1===0?'bdTop':'']">
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="removeRights(row, item1.id)">{{ item1.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="['bdBottom','itemsCenter', i2===0?'bdTop':'']">
                    <!-- 二级 -->
                    <el-col :span="6">
                      <el-tag @close="removeRights(row, item2.id)" type="success" closable>{{ item2.authName }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级 -->
                    <el-col :span="18">
                        <el-tag closable @close="removeRights(row, item3.id)" type="warning" v-for="(item3,) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            label="#">
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称">
          </el-table-column>
          <el-table-column
            prop="roleDesc"
            label="角色描述">
          </el-table-column>
          <el-table-column
            prop=""
            label="#操作">
            <template #default="{ row }">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(row)">编辑</el-button>
              <el-button @click="removeRole(row.id)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              <!--<el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">-->
                <el-button type="warning" icon="el-icon-star-off" size="mini" @click="showRightDialog(row)">分配权限</el-button>
              <!--</el-tooltip>-->
            </template>
          </el-table-column>

        </el-table>

        <!-- 添加对话框 -->
        <div>
          <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="resetAdd"
            >
            <!-- 对话框表单结构 model 绑定表单数据源-->
            <el-form :model="addRole" ref="addRoleFrom" :rules="addRules" label-width="80px" class="demo-ruleForm">
              <el-form-item label="角色名称" prop="name">
                <el-input type="text" v-model="addRole.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="desc">
                <el-input type="pass" v-model="addRole.desc" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addRoleConfirm">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <!-- 分配权限对话框 -->
        <el-dialog
          title="分配权限"
          :visible.sync="setRightDialogVisible"
          width="50%"
          @close="rightDialogClosed"
        >
          <!-- 树形控件的内容 default-expand-all: 默认展开所有节点
          default-expanded-keys： 默认选中展开的节点 以key选中
          -->
          <el-tree
            ref="treeRef"
            :data="rightsList"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="defaultKeys"
            :props="treeProps">
          </el-tree>
          <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRights">确 定</el-button>
  </span>
        </el-dialog>
        <!-- 编辑对话框-->
        <!-- 编辑角色对话框 -->
        <div>
          <el-dialog
            title="编辑角色"
            :visible.sync="editDialogVisible"
            width="50%">
            <!-- 对话框表单结构 model 绑定表单数据源-->
            <el-form :model="editRoles" ref="editRoleFrom" :rules="addRules" label-width="80px" class="demo-ruleForm">
              <el-form-item label="角色名称" prop="name">
                <el-input type="text" v-model="editRoles.name"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="desc">
                <el-input type="text" v-model="editRoles.desc"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editRoleConfirm">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </el-card>
    </div>
</template>

<script>
    export default {
        name: 'Roles',
      data() {
          return {
            // addRoleFrom:'',
            rolesList: [],
            // 控制添加框显示与隐藏
            addDialogVisible: false,
            // 分配权限
            setRightDialogVisible: false,
            addRole:{},
          //  树形控件的数据源
            rightsList: [],
            // 默认选中展开的节点 以key选中
            defaultKeys: [],
            // 只需要获取权限三的所有id 放到数据组即可

            // 指定节点的字段
            treeProps: {
              label: 'authName',
              children: 'children'
            },
            // 获取的对应行 的角色信息
            editRoles: {
              id: '',
              name: '',
              desc: ''
            },
            // 存角色id
            roleId: '',
            // 添加框校验规则
            addRules: {
              name: [
                { required: true, message: '请输入角色名称', trigger: 'blur' }
              ],
              desc: [
                { required: true, message: '请输入角色描述', trigger: 'blur' }
              ]
            },
            // 编辑校验规则
            // editFormRules: {
            //   roleName: [
            //     { required: true, message: '请输入名称', trigger: 'blur' }
            //   ],
            //   roleDesc: [
            //     { required: true, message: '请输入描述', trigger: 'blur' }
            //   ]
            // },
            // 控制编辑框
            editDialogVisible: false
          }
      },
      methods: {
          // 渲染数据
        async getRolesList() {
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) return this.$message.error('获取数据失败')
            this.rolesList = res.data
          },
        // 删除指定权限 指定权限
        async removeRights(role, rid) {
            const confirmRes = await this.$confirm('此操作将永久删除该文件,是否继续？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err => err)
          if (confirmRes !== 'confirm') return this.$message.info('取消了删除')
          // 发起请求
          const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rid}`)
          if (res.meta.status !== 200) return this.$message.error('修改失败')
          // 删除成功
          this.$message.success('修改成功')
          role.children = res.data
        },
        // 删除角色
        async removeRole(id) {
          // 警告弹框
          const confirmRemoveRole = await this.$confirm('此操作将永久删除该文件,是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)
          if (confirmRemoveRole !== 'confirm') return this.$message.info('取消了删除')

          const { data: res } = await this.$http.delete(`roles/${id}`)
          if (res.meta.status !== 200) return this.$message.error('删除失败！')
          // 删除成功
          this.$message.success('删除成功！')
          // 重新渲染
          this.getRolesList()
        },
        // 添加框中 点击确认
        async addRoleConfirm() {
          // 获取数据
          const { data: res } = await this.$http.post('roles', {
            roleName: this.addRole.name,
            roleDesc: this.addRole.desc
          })
          if (res.meta.status !== 201) return this.$message.error('添加失败')
          this.$message.success('添加成功')
          this.getRolesList()
          // 关闭添加框
          this.addDialogVisible = false
        },
        resetAdd() {
          this.$refs.addRoleFrom.resetFields()
        },
        // 点击分配权限按钮 弹框 请求数据
        async showRightDialog(role) {
          // 保存 角色的id
          this.roleId = role.id
          // 获取到所有的权限数据数据
          const { data: res } = await this.$http.get('rights/tree')
          if (res.meta.status !== 200) return this.$message.error('数据请求错误')
          this.rightsList = res.data
          // 调用递归方法
          this.getrights3Keys(role, this.defaultKeys)
          // 弹框
          this.setRightDialogVisible = true
        },
        // 定义递归方法获取所有权限3的id push到 defaultKeys
        getrights3Keys(node, arr) {
          // 判断是不是3级节点  根据有没有children字段
          if (!node.children) return arr.push(node.id)
          // 不是3级节点 遍历的调用自己
          node.children.forEach(item => {
            this.getrights3Keys(item, arr)
          })
        },
        // 点击确定 提交权限  提交的接口需要 传123级的权限id 这里使用 element提供的方法
        // 获取选中以及半选中的id 并拼接给数组keys 请求数据时传参 成功就重新渲染数据 并关闭弹框、
        async saveRights() {
          // 获取123级所有的权限id  使用扩展运算符 合并数组
          const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedNodes()
          ].join(',')
          // 发请求
          const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
            rids: keys
          })
          // 失败
          if (res.meta.status !== 200) return this.$message.error('提交失败失败')
          // 成功  初始化数据
          this.getRolesList()
          this.setRightDialogVisible = false
        },
        // 监听对话框关闭事件
        rightDialogClosed() {
          this.defaultKeys = []
        },
        // 点击编辑按钮
        async showEditDialog(row) {
          // 获取数据 对应id数据 渲染在input中
          this.editRoles.id = row.id
          this.editRoles.name = row.roleName
          this.editRoles.desc = row.roleDesc
          // console.log(row)
          // 请求数据
          // const { data: res } = await this.$http.get(`roles/${id}`)
          // console.log(res)
          // if (res.meta.status !== 200) return this.$message.error('获取数据失败')
          // this.editRoles.roleName = res.data.roleName
          // this.editRoles.roleDesc = res.data.roleDesc
          // this.editRoles.id = id
          this.editDialogVisible = true
          // console.log(this.editRoles)
        },
        // 重置编辑框
        resetEdit() {
          // this.$refs.editRoleFrom.resetFields()
        },
        // 点击提交 编辑信息
        async editRoleConfirm() {
          const { data: res } = await this.$http.put(`roles/${this.editRoles.id}`, {
            roleName: this.editRoles.name,
            roleDesc: this.editRoles.desc
          })
          if (res.meta.status !== 200) return this.$message.error('提交失败')
          this.$message.success('修改成功')
          this.getRolesList()
          this.editDialogVisible = false
        }

    },
      created() {
        this.getRolesList()
      }
    }
</script>

<style scoped>
  .el-tag{
    margin: 10px;
  }
  .bdBottom{
    border-bottom: 1px solid #eee;
  }
  .bdTop{
    border-top: 1px solid #eee;
  }
  .itemsCenter{
    display: flex;
    align-items: center;
  }

</style>
