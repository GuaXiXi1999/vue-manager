<template>
  <div>
    <!-- 卡片 -->
    <el-card>
      <el-row>
      <!-- 搜索框 -->
      <el-col :span="8">
        <div style="margin-top: 15px;">
          <el-input placeholder="请输入内容" class="input-with-select" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="orderList"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="50px">
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="200">
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="180">
        </el-table-column>
          <el-table-column
            prop="pay_status"
            label="是否付款">
            <template #default="{ row }">

            <el-tag type="danger" v-if="row.pay_status == 0">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
            </template>
          </el-table-column>

        <el-table-column
          prop="is_send"
          label="是否发货">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="下单时间">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
    export default {
        name: 'Order',
        data() {
          return {
          //  请求订单管理数据 的参数体
            queryInfo: {
              query: '',
              pagenum: 1,
              pagesize: 5
            },
            // 请求到的数据列表 作为 渲染表格的数据源
            orderList: [],
            // 数据总数
            total: 0
          }
      },
      methods: {
          async getOrderList() {
            const { data: res } = await this.$http.get('orders', {
              params: this.queryInfo
            })
            if (res.meta.status !== 200) return this.$message.error('数据请求失败')
            this.orderList = res.data.goods
            this.total = res.data.total
            console.log(res)
            console.log(this.orderList)
          },
        // handleCurrentChange  页数发生变化时
        handleCurrentChange(newPage) {
          console.log(newPage)
          this.queryInfo.pagenum = newPage
          this.getOrderList()
        },
        // handleSizeChange  每页显示数量发生变化时
        handleSizeChange(newSize) {
          console.log(newSize)
          this.queryInfo.pagesize = newSize
          this.getOrderList()
        }
      },
      created() {
          this.getOrderList()
      }
    }
</script>

<style scoped>

</style>
