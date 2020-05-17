<template>
  <el-card>
    <el-button @click="showCateDialog">添加分类</el-button>
    <!-- 表格样式 树形控件 data： 数据源 :columns： 设置表格中 列 的配置项 -->
    <zk-table
      ref="table"
      index-text="#"
      :data="cateList"
      :columns="columns"
      :expand-type=false
      :selection-type = false
      show-index>
      <!--// 定义第二列模板列-->
      <template #isOK="{ row }">
        <i :class="row.cat_deleted ? 'el-icon-error' : 'el-icon-success'"></i>
      </template>
      <!--// 定义第三列模板列-->
      <template #order="{ row }">
        <el-tag v-if="row.cat_level===0" size="mini">一级</el-tag>
        <el-tag v-else-if="row.cat_level===1" size="mini" type="success">二级</el-tag>
        <el-tag v-else type="warning">三级</el-tag>
      </template>
      <!--// 定义第四列模板列-->
      <template #option>
        <el-button type="primary" icon="el-icon-edit">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete">删除</el-button>
      </template>
    </zk-table>
    <div>
      <!-- 添加弹框 -->
      <el-dialog
        title="提示"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="hideAddDialog"
      >
        <el-form ref="addCateRef" :model="addCateForm" :rules="addRules" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级名称">
            <!-- 级联选择器 -->
            <div class="block">
              <!-- v-model :绑定选中的值(数组) options：数据源 props：指定配置对象  change-on-select=true: 可以选中任意一级 -->
              <el-cascader
                v-model="selectedKeys"
                :options="options"
                :props="CascaderProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
      </el-dialog>
    </div>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
    export default {
        name: 'Cate',
        data() {
          return {
            cateList:[],
            // 查询数据传参对象
            queryInfo: {
              type: '3',
              pagenum:1,
              pagesize: 6
            },
            // 总条数
            total: 0,
            // 表格列中的配置项
            columns: [
              // 第一列
              {
                label: '分类名称',
                prop: 'cat_name'
              },
              // 第二列
              {
                label: '是否有效',
                type: 'template',
                // 这一列使用的模板名称
                template: 'isOK'
              },
              // 第三列
              {
                label: '排序',
                type: 'template',
                // 这一列使用的模板名称
                template: 'order'
              },
              // 第四列
              {
                label: '操作',
                type: 'template',
                template: 'option'
              }
            ],
            // 控制添加弹框变量
            addDialogVisible : false,
            // 添加框表单数据对象
            addRules: {
              cat_name: [
                { required: true, message: '请输入分类名称', trigger: 'blur' }
              ]
            },
          //  定义级联选择器选中的值
            selectedKeys:'',
            // 添加分类数据对象
            addCateForm: {},
            // 级联选择器的配置对象
            CascaderProps: {
              label:'cat_name', // 指定要显示的值的属性
              value: 'cat_id',
              children :'children',
              expandTrigger: 'hover',
              checkStrictly: true
            },
            // 级联选择器的数据源
            options: []
          }
        },
      methods: {
          async getCateList() {
            const { data: res } = await this.$http.get('categories', {
              params: this.queryInfo
            })
            if (res.meta.status !== 200) return this.$message.error('获取数据失败')
            console.log(res)
            this.cateList = res.data.result
            this.total = res.data.total
          },
        // 级联选择器 改变触发事件
        handleChange() {
          // console.log(this.selectedKeys)
          // 用户选择时
          if (this.selectedKeys.length > 0) {
            this.addCateForm.cat_pid = this.selectedKeys[(this.selectedKeys.length) - 1]
            // 层级
            this.addCateForm.cat_level = this.selectedKeys.length
          } else {
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
          }
        },
        // 点击显示添加框
        async showCateDialog() {
            // 获取数据
          const { data: res } = await this.$http.get('categories', {
            params:{
              type:2
            }
          })
          if (res.meta.status !== 200) return this.$message.error('获取数据失败')
          // 成功
          // console.log(res)
          this.options = res.data
          this.addDialogVisible = true
        },
        // 添加分类框中点击确定 提交数据
        addCate() {
          console.log(this.addCateForm)
          this.$refs.addCateRef.validate(async valid => {
            if (!valid) return
            // 发请求
            const { data: res } = await this.$http.post('categories', this.addCateForm)
            if (res.meta.status !== 201) return this.$message.error('提交失败')
            // 成功
            this.getCateList()
          })
          this.addDialogVisible = false
        },
        // 添加框关闭
        hideAddDialog() {
            // 重置表单
          this.$refs.addCateRef.resetFields()
          this.addCateForm = {}
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0
        },
        // 分页区块
        // handleCurrentChange  页数发生变化时
        handleCurrentChange(newPage) {
          console.log(newPage)
          this.queryInfo.pagenum = newPage
          this.getCateList()
        },
        // handleSizeChange  每页显示数量发生变化时
        handleSizeChange(newSize) {
          console.log(newSize)
          this.queryInfo.pagesize = newSize
          this.getCateList()
        }
      },
      created() {
          this.getCateList()
      }
    }
</script>

<style scoped>

</style>
