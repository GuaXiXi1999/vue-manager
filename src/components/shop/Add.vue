<template>
  <div>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        :closable="false"
        show-icon>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeName-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addFrom" :rules="addFromRules" ref="addFormRef">
      <!-- 标签页 -->
        <el-tabs :tab-position="'left'"
                 v-model="activeName"
                 @tab-click="tabClick"
                 :before-leave="beforeTabsEvent"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 表单结构 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFrom.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFrom.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFrom.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                  v-model="addFrom.goods_cat"
                  :options="cateList"
                  :props="cateProps"
                  @change="handleChange">
                </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox border v-for="item2 in item.attr_vals" v-model="checked" :key="item2">{{ item2 }}</el-checkbox>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-dialog
                title="图片预览"
                :visible.sync="picDialogVisible"
                width="50%">
                <img :src="picPath" style="width: 100%" alt="">
              </el-dialog>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本 -->
            <quill-editor v-model="addFrom.goods_introduce"/>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
    export default {
        name: 'add',
      data() {
          return {
            // 控制 步骤条
            activeIndex: 0,
            activeName: '0',
            // 表单数据对象
            addFrom: {
              goods_name: '',
              goods_price: '',
              goods_number: '',
              goods_weight: '',
              goods_cat: [],
              // 图片数组
              pics: [],
              attrs: [],
              goods_introduce: ''
            },
            addFromRules: {
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
              ],
              goods_cat: [
                { required: true, message: '请选择三级商品分类', trigger: 'change' }
              ]
            },
            cateList: [],
            // 选中时的数组 级联选择器的数据
            selectedCateKeys: [],
            // 级联选择器配置对象
            cateProps: {
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              expandTrigger:'hover'
            },
            manyData: [],
            onlyData: [],
            // 控制复选框
            checked: true,
            // 图片url
            uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
            // 上传图片的请求头
            headerObj:{
              Authorization: window.sessionStorage.getItem('token')
            },
            picDialogVisible: false,
            // 预览图片的路径地址
            picPath: ''
          }
      },
      methods: {
          // 监听tabs的click事件
        async tabClick() {
          this.activeIndex = this.activeName
          if (this.activeIndex === '1') {
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
              params: {
                sel: 'many'
              }
            })
            if (res.meta.status !== 200) return this.$message.error('数据获取失败')
            // 成功 将attr_vals 属性中的字符串改造成数组 最后将数据保存到 manyData
            res.data.forEach(item => {
              item.attr_vals = item.attr_vals.length > 0 ? item.attr_vals.split(',') : []
            })
            this.manyData = res.data
          } else if (this.activeIndex === '2') {
            // 请求索引为2 的面板 ： 商品属性
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
              params: {
                sel: 'only'
              }
            })
            if (res.meta.status !== 200) return this.$message.error('数据获取失败')
            this.onlyData = res.data
            console.log(this.onlyData)
          }
        },
        // 获取级联选择器中 的数据
        async getCateList() {
          const { data: res } = await this.$http.get('categories')
          if (res.meta.status !== 200) return this.$message.error('数据获取失败')
          // 成功 则保存数据
          this.cateList = res.data
          // console.log(this.cateList)
        },
        handleChange() {
          // 数组程度不等于3 清空数组
          if (this.addFrom.goods_cat.length !== 3) {
            this.addFrom.goods_cat = []
          }
        },
        // 监听离开标签页之前的事件 钩子函数
        beforeTabsEvent(newActiveName, oldActiveName) {
          // 判断 第一个面板 判断是否 填写了三级分类
          if (oldActiveName === '0' && this.addFrom.goods_cat.length !== 3) {
            this.$message.error('请选择三级分类')
            // 阻止切换
            return false
          }
        },
        // 图片预览
        handlePreview(file) {
          // console.log(file)
          this.picPath = file.response.data.url
          this.picDialogVisible = true
          // console.log(this.picPath)
        },
        // 图片删除
        handleRemove(file) {
          // 获取要删除的路径
          const filePath = file.response.data.tmp_path
          const i = this.addFrom.pics.findIndex(item => item.pic === filePath)
          this.addFrom.pics.splice(i, 1)
          console.log(this.addFrom)
          console.log(i)
        },
        // 图片添加成功
        handleSuccess(res, file) {
          const imgPath = { pic: res.data.tmp_path }
          // 追加到数组
          this.addFrom.pics.push(imgPath)
          console.log(this.addFrom)
        },
        // 点击添加商品
        addGoods() {
          this.$refs.addFormRef.validate(async valid => {
            if (!valid) return this.$message.error('请填写必要的表单项')
            // 根据接口参数 进行数据请求
            console.log(this.addFrom)
            // 添加动态参数
            this.manyData.forEach(item => {
              const newObj = {
                attr_id: item.attr_id,
                attr_value: item.attr_value
              }
              this.addFrom.attrs.push(newObj)
            })
            // 添加j静态属性
            this.onlyData.forEach(item => {
              const newObj = {
                attr_id: item.attr_id,
                attr_value: item.attr_value
              }
              this.addFrom.attrs.push(newObj)
            })
            // 将 goods_cat 改造成字符串
            this.addFrom.goods_cat = this.addFrom.goods_cat.join(',')
            console.log(this.addFrom)
            // 请求数据
            const { data: res } = await this.$http.post('goods', this.addFrom)
            if (res.meta.status !== 200) return this.$message.error('添加失败')
            // 成功跳转到商品列表
            this.$router.push('/goods')
            console.log(res)
            console.log(this.manyData)
          })
        }
      },
      created() {
        this.getCateList()
      },
      computed: {
          cateId() {
            return this.addFrom.goods_cat[2] || null
          }
      }
    }
</script>

<style scoped>
  .el-steps{
    margin-top: 20px;
  }
  .el-button{
    margin-top: 20px;
  }
</style>
