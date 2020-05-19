<template>
  <div>
    <el-card>
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
  // 导入echarts
  import echarts from 'echarts'
  // 导入lodash
  import _ from 'lodash'
    export default {
        name: 'Report',
      data() {
          return {
            options: {
              title: {
                text: '用户来源'
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#E9EEF3'
                  }
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  boundaryGap: false
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ]
            }
          }
      },
      // 内存 和界面初始化完毕
      async mounted() {
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(document.getElementById('main'))
        // 指定图表的配置项和数据
        const { data: res } = await this.$http.get('reports/type/1')
        if (res.meta.status !== 200) return this.$message.error('数据获取失败')
        // 使用lodash中的merge方法 合并对象
        const resObj = _.merge(res.data, this.options)
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(resObj)
      }
    }
</script>

<style scoped>

</style>
