<template>
    <div>
      <el-card>
        <el-alert
          title="注意:只允许为第三季分类设置参数！"
          type="warning"
          show-icon
          :closable="false">
        </el-alert>
        请选择商品分类
        <el-cascader
          v-model="selectedCateKeys"
          :options="cateList"
          :props="cateProps"
          @change="handleChange">
        </el-cascader>
        <!-- 标签页组件 -->
        <el-tabs v-model="activeName" @tab-click="tabsHandleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addManyDialogVisible = true">添加参数</el-button>
          <!-- 动态参数的表格 -->
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <!-- 展开列 -->
            <el-table-column
              type="expand">
              <template #default="{ row }">
                <el-tag class="expandTag"
                        v-for="item in row.attr_vals"
                        :key="item.attr_id"
                        closable
                        @close="removeTag"
                >{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(row)" width="100px">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#">
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称">
            </el-table-column>
            <el-table-column
              label="操作">
              <template #default="{ row }">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteMany(row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled">添加属性</el-button>
          <!-- 静态属性的表格 -->
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              type="expand">
            </el-table-column>
            <el-table-column
              type="index"
              label="#">
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称">
            </el-table-column>
            <el-table-column
              label="操作">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
        <!-- 添加 动态参数 模态框 -->
        <el-dialog
          title="添加动态参数"
          :visible.sync="addManyDialogVisible"
          width="50%"
          :before-close="handleClose">
          <el-form ref="addManyForm" :model="addManyForm" label-width="110px" :rules="addManyFormRules">
            <el-form-item label="动态参数名称：" prop="attr_name">
              <el-input v-model="addManyForm.attr_name"></el-input>
            </el-form-item>
            <el-form-item label="添加标签：" prop="attr_name">
              <el-input v-model="addManyForm.attr_vals" placeholder="若添加多个标签，请用英文逗号分隔"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
    <el-button @click="addManyDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addMany">确 定</el-button>
  </span>
        </el-dialog>
      </el-card>
    </div>
</template>

<script>
    export default {
        name: 'Params',
        data() {
          return {
            // 商品分类信息
            cateList: [],
            // 级联选择器配置对象
            cateProps: {
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              expandTrigger:'hover'
            },
            // 级联选择器双向绑定的数组
            selectedCateKeys: [],
            // 获取表格数据 穿的 获取类型 many 与 only
            activeName: 'many',
            isSel: '',
            tableData: [],
            // 控制添加动态参数对话框
            addManyDialogVisible: false,
            // 添加动态参数 表单对象
            addManyForm: {
              attr_name: '',
              attr_sel: 'many',
              attr_vals: ''
            },
            // 添加框校验
            addManyFormRules: {
              attr_name: [
                { required: true, message: '请输入动态参数名称', trigger: 'blur' }
              ],
              attr_vals: [
                { required: true, message: '请输入动态参数名称', trigger: 'blur' }
              ]
            }
          }
        },
        methods: {
          async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('数据获取失败')
            // 成功 则保存数据
            this.cateList = res.data
          },
          // 级联选择器 状态发生变化 就会出发点额函数  改变时要请求数据
          async handleChange() {
            // 数组程度不等于3 清空数组
            if (this.selectedCateKeys.length !== 3) {
              this.selectedCateKeys = []
              this.tableData = []
              return
            }
            // 每次联机选择器 的状态发生变化 都要重新获取数据 渲染表格
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
              params: {
                sel: this.activeName
              }
            })
            // 请求失败
            if (res.meta.status !== 200) return this.$message.error('请求数据失败！')

            // 成功
            // 展开列 的 内容 为多个标签 请求的数据 是字符串 这里 将字符串转化为数组
            res.data.forEach(item => {
              // 改造数据 根据逗号分隔  返回的是数组
              item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
              // 添加字段 避免 新增tag按钮 同时操作
              item.inputVisible = false
              item.inputValue = ''
            })
            this.tableData = res.data
          },
          // 标签页改变事件
          tabsHandleClick() {
            // console.log(this.activeName)
            this.handleChange()
          },
          // 展开中的tag标签 失焦 以及 enter事件
          async handleInputConfirm(row) {
            // 将value值 添加到页面
            // 非空
            if (row.inputValue.trim().length === 0) {
              row.inputValue = ''
              row.inputVisible = false
              return
            }
            // 数据合法 添加到row 清空value值
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            // 添加到数据库
            const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
              attr_name: row.attr_name,
              attr_sel: row.attr_sel,
              attr_vals: row.attr_vals.join(',')
              // 数据库中的attr_vals 是以字符串类型传
            })
            if (res.meta.status !== 200) return this.$message.error('提交数据失败！')
            // 成功
            row.inputValue = ''
            row.inputVisible = false
            this.$message.success('提交成功')
          },
          // 点击显示input
          showInput(row) {
            row.inputVisible = true
            // 点击聚焦
            this.$nextTick(_ => {
              this.$refs.saveTagInput.$refs.input.focus()
            })
          },
          // 点击添加动态参数
          async addMany() {
            // console.log(this.cateList)
            // console.log(this.selectedCateKeys)
            const { data: res } = await this.$http.post(`categories/${this.selectedCateKeys[2]}/attributes`, {
              attr_name: this.addManyForm.attr_name,
              attr_sel: this.addManyForm.attr_sel,
              attr_vals: this.addManyForm.attr_vals
            })
            if (res.meta.status !== 201) return this.$message.error('添加失败')
            this.tableData.push(res.data)
            console.log(res)
            console.log(this.tableData)
            this.addManyDialogVisible = false
          },
          // 添加动态框关闭
          handleClose() {},
          // 点击删除 动态参数
           deleteMany(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              const { data: res } = await this.$http.delete(`categories/${row.cat_id}/attributes/${row.attr_id}`)
              if (res.meta.status !== 200) return this.$message.error('删除失败')
              this.$message.success('删除成功')
              this.handleChange()
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          },
          // 添加静态参数 删除tag 事件
          removeTag() {

          }
        },
        computed: {
          isBtnDisabled() {
            return this.selectedCateKeys.length !== 3
          },
          // 返回3级id
          cateId() {
            return this.selectedCateKeys.length === 3 ? this.selectedCateKeys[2] : null
          }
        },
        created() {
            this.getCateList()
        }

    }
</script>

<style scoped>
  .expandTag{
    margin-right: 10px;
  }
</style>
