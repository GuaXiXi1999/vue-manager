<template>
    <div>
      <el-card>
        <el-row>
          <!-- 搜索框 -->
          <el-col :span="8">
            <div style="margin-top: 15px;">
              <el-input placeholder="请输入内容" class="input-with-select" v-model="keyword" @input="IsEmpty" clearable>
                <el-button slot="append" icon="el-icon-search" @click="isQuery"></el-button>
              </el-input>
            </div>
          </el-col>
          <!-- 添加商品按钮 -->
          <el-col :span="5">
            <div style="margin-top: 15px;" class="GoodsAddBtn">
              <el-button type="primary" @click="addShop">添加商品</el-button>
            </div>
          </el-col>
        </el-row>
        <!-- 商品列表区域 -->
        <el-table
          :data="GoodstableData"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            label="#"
            width="50px">
          </el-table-column>
          <el-table-column
            prop="goods_name"
            label="商品名称">
          </el-table-column>
          <el-table-column
            prop="goods_price"
            label="商品价格(元)"
            width="100px">
          </el-table-column>
          <el-table-column
            prop="goods_weight"
            label="商品重量"
            width="100px">
          </el-table-column>
          <el-table-column
            prop="upd_time"
            label="创建时间"
            width="180px">
          </el-table-column>
          <el-table-column
            label="操作"
          width="140px">
            <template #default="{ row }">
              <!-- 编辑按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGood(row)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGood(row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>

        <!-- 添加商品弹框 -->
        <el-dialog
          title="添加商品"
          :visible.sync="addGoodDialogVisible"
          width="50%">
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
          <el-button @click="addGoodDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addGoodDialogVisible = false">确 定</el-button>
  </span>
        </el-dialog>

        <!-- 编辑商品弹框 -->
        <el-dialog
          title="编辑商品"
          :visible.sync="editGoodDialogVisible"
          width="50%">
          <el-form :model="editGoodData" :rules="rules" ref="editRuleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="editGoodData.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="goods_price">
              <el-input v-model="editGoodData.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="goods_number">
              <el-input v-model="editGoodData.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="重量" prop="goods_weight">
              <el-input v-model="editGoodData.goods_weight"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="editGoodDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="decideEdit">确 定</el-button>
  </span>
        </el-dialog>
      </el-card>
    </div>
</template>

<script>
    export default {
        name: 'Goods',
      data() {
          return {
            // 获取商品数据 传参内容 根据条件传参的参数体
            queryInfo: {
              query:'',
              pagenum: 1,
              pagesize: 10
            },
            // 渲染列表的数据
            GoodstableData: [],
            total: 0,
            // 根据搜索框关键字 显示对应内容
            keyword: '',
            // 空值添加框的值
            addGoodDialogVisible: false,
            // 控制 编辑弹框的值
            editGoodDialogVisible:false,
            // 编辑提交商品 参数体
            editGoodData: {
              goods_name:'',
              goods_price:'',
              goods_number:'',
              goods_weight:'',
              goods_cat: ''
            },
            // 编辑表单校验规则
            rules:{
              goods_name: [
                { required: true, message: '请输入商品名称', trigger: 'blur' }
              ],
              goods_price: [
                { required: true, message: '请输入商品价格', trigger: 'blur' }
              ],
              goods_number: [
                { required: true, message: '请输入商品数量', trigger: 'blur' }
              ],
              goods_weight: [
                { required: true, message: '请输入商品重量', trigger: 'blur' }
              ]
            }
          }
      },
      methods: {
          // 格式化时间戳
          myTime() {
            // this.GoodstableData.forEach((item) => {
            //   console.log(item.upd_time)
            // })
            console.log(this.GoodstableData)
          },
          async getGoodsList() {
            const { data: res } = await this.$http('goods', {
              params: this.queryInfo
            })
            // 信息获取失败
            if (res.meta.status !== 200) return this.$message.error('商品信息获取失败')
            this.GoodstableData = res.data.goods
            this.total = res.data.total
            // console.log(this.GoodstableData)
            this.GoodstableData.forEach((item) => {
              const time = new Date(item.upd_time)
              const y = time.getFullYear()
              const m = time.getMonth() + 1
              const d = time.getDate()
              const h = time.getHours()
              const min = time.getMinutes()
              const s = time.getSeconds()
              item.upd_time = `${y}-${m}-${d}-${h}-${min}-${s}`
            })
          },
        // 每页显示...条数据 变化时
          handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
          },
        // 页数 变化时
        handleCurrentChange(newPage) {
          this.queryInfo.pagenum = newPage

          this.getGoodsList()
        },
        // 点击放大镜 根据关键字显示对应内容
        isQuery() {
            this.queryInfo.query = this.keyword
          this.getGoodsList()
        },
        // 键盘抬起时 判断搜索框中是否有内容
        IsEmpty() {
            // 判断data中的keyword s是否为空值 为空值则 重置查询属性 获取所有商品数据并重新渲染
          if (this.keyword) return
          this.queryInfo.query = ''
          this.getGoodsList()
        },
        // 删除数据
        async deleteGood(id) {
          const { data: res } = await this.$http.delete(`goods/${id}`)
          if (res.meta.status !== 200) return this.$message.error('删除失败！')
          // 成功
          this.$message.success('删除成功！')
          this.getGoodsList()
        },
        // 添加商品
        // addGoods() {
        //     // 显示弹框
        //   this.addGoodDialogVisible = true
        // }
        // 点击编辑按钮
        async editGood(row) {
            const { data: res } = await this.$http.get(`goods/${row.goods_id}`)
            if (res.meta.status !== 200) return this.$message.error('获取数据失败')
          // 将对应行的数据 存入参数体中
          this.editGoodData.id = row.goods_id
          this.editGoodData.goods_name = res.data.goods_name
          this.editGoodData.goods_price = res.data.goods_price
          this.editGoodData.goods_number = res.data.goods_number
          this.editGoodData.goods_weight = res.data.goods_weight
          this.editGoodData.goods_cat = res.data.goods_cat
          // 弹框
          this.editGoodDialogVisible = true
        },
        // 点击确定编辑
        async decideEdit() {
            const { data: res } = await this.$http.put(`goods/${this.editGoodData.id}`, {
              goods_name: this.editGoodData.goods_name,
              goods_price: this.editGoodData.goods_price,
              goods_number: this.editGoodData.goods_number,
              goods_weight: this.editGoodData.goods_weight,
              goods_cat: this.editGoodData.goods_cat
        })
          console.log(res)
          if (res.meta.status !== 200) return this.$message.error('修改失败')
          this.getGoodsList()
          this.editGoodDialogVisible = false
        },
        // 点击添加商品
        addShop() {
            // 点击添加按钮 使用哦push 进行跳转
            this.$router.push('/goods/add')
        }
      },
      created() {
          this.getGoodsList()
        this.myTime()
      },
      mounted() {
      }
    }
</script>

<style scoped>
  .GoodsAddBtn{
    margin-left: 16px;
  }
</style>
