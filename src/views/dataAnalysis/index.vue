<template>
  <div class="dataAnalysis_container">
    <div class="main">
      <div class="register">
        <el-row>
          <el-col :span="4" class="left">
            <p class="label">注册分析</p>
            <el-col :span="24">
              <el-button>日</el-button>
            </el-col>
            <el-col :span="24">
              <el-button>月</el-button>
            </el-col>
            <el-col :span="24">
              <el-button>年</el-button>
            </el-col>
          </el-col>
          <el-col :span="20">
            <div id="main" style="width: 100%;height: 400px;"></div>
          </el-col>
        </el-row>
      </div>
      <div class="order">
        <el-row>
          <el-col :span="4" class="left">
            <p class="label">订单分析</p>
            <el-col :span="24">
              <el-button>日</el-button>
            </el-col>
            <el-col :span="24">
              <el-button>月</el-button>
            </el-col>
            <el-col :span="24">
              <el-button>年</el-button>
            </el-col>
          </el-col>
          <el-col :span="20">
            <div id="order" style="width: 100%;height: 400px;"></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: "dataAnalysis",
    data() {
      return {
        charts: '',
        opinion: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
        opinionData: [
          {value: 335, name: '直接访问'},
          {value: 310, name: '邮件营销'},
          {value: 234, name: '联盟广告'},
          {value: 135, name: '视频广告'},
          {value: 1548, name: '搜索引擎'}
        ]
      }
    },
    created() {

    },
    mounted() {
      this.$nextTick(function () {
        this.drawPie('main');
        this.drawPie('order')
      })
    },
    methods: {
      drawPie(id) {
        this.charts = echarts.init(document.getElementById(id))
        this.charts.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['one','two']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            name:'时间',
            type: 'category',
            boundaryGap: false,
            data: ['周一','周二','周三','周四','周五','周六','周日']
          },
          yAxis: {
            name:'单位（人）',
            type: 'value'
          },
          series: [
            {
              name:'one',
              type:'line',
              stack: '总量',
              data:[120, 132, 101, 134, 90, 230, 210]
            },
            {
              name:'two',
              type:'line',
              stack: '总量',
              data:[220, 182, 191, 234, 290, 330, 310]
            }
          ]
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .dataAnalysis_container {
    .main {
      width: 80%;
      min-width: 1100px;
      margin: 0 auto;
      .register,.order{
        .left{
          text-align: center;
          .label{
            margin-top: 20px;
            padding: 10px;
            font-size: 16px;
          }
          .el-col{
            margin: 10px auto;
          }
        }
      }
    }
  }
</style>
