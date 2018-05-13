<template>
  <div class="dataAnalysis_container">
    <div class="main">
      <div class="register">
        <el-row>
          <el-col :span="4" class="left">
            <p class="label">注册分析</p>
            <el-col :span="24">
              <el-button @click="getreport(1,'day')">日</el-button>
            </el-col>
            <el-col :span="24">
              <el-button @click="getreport(1,'month')">月</el-button>
            </el-col>
            <el-col :span="24">
              <el-button @click="getreport(1,'year')">年</el-button>
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
              <el-button @click="getreport(2,'day')">日</el-button>
            </el-col>
            <el-col :span="24">
              <el-button @click="getreport(2,'month')">月</el-button>
            </el-col>
            <el-col :span="24">
              <el-button @click="getreport(2,'year')">年</el-button>
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
  import Qs from 'qs';
  import echarts from 'echarts'
  import datePickGroup from '@/components/datePickGroup'
  import {timestampToTime} from '@/common/common.js'

  export default {
    name: "dataAnalysis",
    components: {datePickGroup},
    data() {
      return {
        charts: '',
      }
    },
    created() {
      this.getreport(1)
      this.getreport(2)
    },
    mounted() {
      this.$nextTick(function () {
        // this.drawPie('main');
        // this.drawPie('order')
      })
    },
    methods: {
      timestampToTime: timestampToTime,
      drawPie(id, data, time) {
        this.charts = echarts.init(document.getElementById(id))
        this.charts.setOption({
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            name: '时间',
            type: 'category',
            data: time,
            boundaryGap: false,
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0,
              rotate: 45
            }
          },
          yAxis: {
            type: 'value',
            max: (Math.max.apply(null, data)) + 5,
          },
          series: [{
            data: data,
            type: 'line'
          },
            // {
            //   data: [920, 932, 901, 934, 1290, 1330, 1320],
            //   type: 'line'
            // }
          ]
        })
      },
      sortNumber(a,b) {
        return a - b
      },
      //获取数据  new Date(), year: '2018', month: '5', day: '13'
      getreport(type, date = 'day') {
        this.$http({
          url: "/report/getreport",
          method: "POST",
          data: {type: type, date: date},
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          transformRequest: [function (data) {
            let json = JSON.stringify(Qs.parse(data));
            return json;
          }]
        }).then(data => {
          if (type == 2) {
            let time = [], count = [];
            // this.orderData = data;
            data.map((item,index) => {
              //数量处理
              count.push(item.count);
              //时间处理
              let _date = new Date();
              let month = _date.getMonth() + 1;
              let day = _date.getDate();
              let _time = '';
              if (date == 'day') {
                let starttime = _date.getFullYear() + '-' + month + '-' + day + ' 00:00:00';
                 _time = this.timestampToTime((new Date(starttime).setHours(item.time)) + ''.slice(0, 10));
                _time = (_time+'').slice(0,10)+'\n'+ (_time+'').slice(11,17)+"   ";
              }else if(date == 'month') {
                let starttime = _date.getFullYear() + '-' + month;
                 _time = (this.timestampToTime((new Date(starttime).setDate(item.time))+''.slice(0,10))+'').slice(0,10);
              }else {
                // let temp = [];
                // temp.push(item.time);
                // temp.sort(this.sortNumber);
                // item = temp;
                // let starttime = _date.getFullYear()+'-'+'01'+'-'+'01';
                //  _time = (this.timestampToTime((new Date(starttime).setMonth(item[index]))+''.slice(0,10))+'').slice(0,7);
                _time = item.time;
              }
              time.push(_time);
            })
            time.sort(this.sortNumber);
            this.drawPie('order', count, time)
          }else {
            let time = [], count = [];
            // this.orderData = data;
            data.map(item => {
              //数量处理
              count.push(item.count);
              //时间处理
              let _date = new Date();
              let month = _date.getMonth() + 1;
              let day = _date.getDate();
              let _time = '';
              if (date == 'day') {
                let starttime = _date.getFullYear() + '-' + month + '-' + day + ' 00:00:00';
                _time = this.timestampToTime((new Date(starttime).setHours(item.time)) + ''.slice(0, 10));
                _time = (_time+'').slice(0,10)+'\n'+ (_time+'').slice(11,17)+"   ";
              }else if(date == 'month') {
                let starttime = _date.getFullYear() + '-' + month;
                _time = (this.timestampToTime((new Date(starttime).setDate(item.time))+''.slice(0,10))+'').slice(0,10);
              }else {
                // let starttime = _date.getFullYear()+'-'+'01'+'-'+'01';
                // _time = (this.timestampToTime((new Date(starttime).setMonth(item.time))+''.slice(0,10))+'').slice(0,7);
                _time = item.time;
              }
              time.push(_time);
            })
            time.sort(this.sortNumber);
            this.drawPie('main', count, time)
          }
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
      .register, .order {
        .left {
          text-align: center;
          .label {
            margin-top: 20px;
            padding: 10px;
            font-size: 16px;
          }
          .el-col {
            margin: 10px auto;
          }
        }
      }
    }
  }
</style>
