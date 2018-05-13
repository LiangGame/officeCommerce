<template>
  <div class="scOrder_container">
    <div class="main">
      <el-row class="top" :gutter="10">
        <el-input v-model="userID" size="mini" style="width: 150px" placeholder="用户ID"></el-input>
        <el-input v-model="phone" size="mini" style="width: 150px" placeholder="手机号"></el-input>
        <el-input v-model="realName" size="mini" style="width: 150px" placeholder="姓名"></el-input>
        <el-select v-model="status" size="mini" placeholder="请选择订单状态" collapse-tags class="filter">
          <el-option
            v-for="item in payMents"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData">筛选</el-button>
      </el-row>
      <div class="table_container">
        <el-table
          :data="tableData"
          border
          :height="listHeight"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="订单号"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="userID"
            label='用户ID'
            align="center"
            width="80"
          >
            <!--:render-header="renderHeader"-->
          </el-table-column>
          <el-table-column
            prop="cerateTime"
            label="下单时间"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="count"
            label="购买数量"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="totalPrice"
            label="总金额"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="payTime"
            label="付款时间"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="payMent"
            label="支付方式"
            align="center">
            <template slot-scope="scope">
              {{scope.row.payMent | paymentsFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="订单状态"
            align="center">
            <template slot-scope="scope">
              {{scope.row.status | payStatusFilter}}
            </template>
            <!--:filters="filters"-->
            <!--:filter-method="loadData"-->
            <!--:filter-multiple="false"-->
            <!--filter-placement="bottom-end"-->
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="showOperate(scope.row.id)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div style="line-height: 32px">
        <el-pagination
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[50, 100, 500]"
          :page-size="50"
          layout="total,sizes, prev, pager, next"
          :total="totalCount"
          style="display: inline-block">
        </el-pagination>
        <span style="color: #666;">共计已付款金额：{{orderTotal}}元 </span>
      </div>

      <!--弹窗-->
      <el-dialog
        title="查看订单详情"
        :visible="visible"
        width="800px"
        :closeOnClickModal="false"
        :before-close="handleClose"
        class="goods_content_dialog">
        <el-row>
          <el-col :span="24">
            <el-col :span="5" :gutter="10">
              <img :src="fileUrl+goods.img" alt="" width="120" height="120">
            </el-col>
            <el-col :span="19">
              <p>{{goods.id}}</p>
              <p>数量：{{goods.count}}</p>
              <p style="color: #e93b3b;font-size: 18px;">金额：￥{{goods.totalPrice}}</p>
            </el-col>
          </el-col>
          <el-col :span="24" class="goodsInfo_bottom">
            <el-col :span="4">会员ID：</el-col>
            <el-col :span="20">{{goods.userID}}</el-col>
            <el-col :span="4">下单时间：</el-col>
            <el-col :span="20">{{timestampToTime(goods.cerateTime)}}</el-col>
            <el-col :span="4">订单状态：</el-col>
            <el-col :span="20">{{goods.status |payStatusFilter}}</el-col>
            <el-col :span="4">支付方式：</el-col>
            <el-col :span="20">{{goods.payMent |paymentsFilter}}</el-col>
            <!--<el-col :span="4" v-if="goods.status==0">剩余付款时间：</el-col>-->
            <!--<el-col :span="20" v-if="goods.status==0">{{goods.cerateTime}}</el-col>-->
            <el-col :span="4">收货地址：</el-col>
            <el-col :span="20">{{goods.payMent |paymentsFilter}}</el-col>
            <el-col :span="4">联系人：</el-col>
            <el-col :span="20">{{goods.payMent |paymentsFilter}}</el-col>
            <el-col :span="4">快递信息：</el-col>
            <el-col :span="20">
              <el-input v-model="expressage" size="mini" placeholder="输入如：顺丰快递0000000000" clearable style="width: 200px"></el-input>
            </el-col>
          </el-col>
          <el-col :span="24" align="center" v-if="goods.status<=5 && isReadOnly == 0">
            <el-button type="primary" :disabled="goods.status>=5" @click="confirmOrder(goods.id,goods.userID,goods.count,goods.goodID)">发货</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import Qs from 'qs';
  import {MessageBox, Message} from 'element-ui';
  import {getWinHeight, timestampToTime, fileUrl} from '@/common/common'

  export default {
    name: "index",
    data() {
      return {
        orderTotal:'',
        returnTotal:'',
        isReadOnly: this.Cookie.get('isReadOnly'),
        expressage:'',
        filter: '',
        fileUrl: fileUrl,
        listHeight: this.getWinHeight() - 145,
        userID: '',
        phone:'',
        realName:'',
        orderId:'',
        type: '0',
        tableData: [],
        //筛选条件
        payMent: [],
        status: '',
        payMents: [{
          value: '',
          label: '全部'
        },{
          value: 0,
          label: '未付款'
        }, {
          value: 2,
          label: '已付款'
        }, {
          value: 6,
          label: '已收货'
        }],
        status1: [{
          value: 1,
          label: '支付宝'
        }, {
          value: 2,
          label: '微信'
        }, {
          value: 3,
          label: '银行卡'
        }, {
          value: 4,
          label: '余额'
        }],
        // 分页
        currentPage: 1,
        pageCount: 50,
        totalCount: 0,
        //弹窗
        visible: false,
        goods: {}
      }
    },
    methods: {
      getWinHeight: getWinHeight,
      timestampToTime: timestampToTime,
      /* 分页 */
      handleCurrentChange(val) {
        this.currentPage = val;  // 当前页数
        this.loadData(this.datePicker);
      },
      handleSizeChange(val) {
        this.pageCount = val; // 每页条数
        this.loadData(this.datePicker);
      },
      //查看订单详情
      showOperate(id) {
        this.orderId = id;
        this.visible = true;
        this.$http({
          url: "/order/getOrderDetail",
          method: "GET",
          params: {id:id}
        }).then(data =>{
          if(data.errCode == 0){
            this.goods = data.info;
          }
        })
      },
      //发货
      confirmOrder(orderID, userID, count, goodID) {
        MessageBox({
          title: '提示',
          message: `确认发货？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              done();
              this.$http({
                url: "/order/confirmMallOrder",
                method: "POST",
                data: {orderID: this.orderId, type:3,trackingNumber:this.expressage},
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8'
                },
                transformRequest: [function (data) {
                  let _data = Qs.parse(data);
                  let json = JSON.stringify(_data);
                  return json;
                }]
              }).then(data => {
                console.log(data);
                if (data.errorCode == 0) {
                  this.visible = false;
                  Message({
                    showClose: true,
                    message: data.info,
                    type: 'success'
                  });
                  this.loadData();
                } else {
                  Message({
                    showClose: true,
                    message: data.info,
                    type: 'error'
                  });
                }
              }).catch(error => {
              })
              return true
            } else {
              done();
              return false
            }
          }
        })
      },
      //关闭弹窗
      handleClose(done) {
        this.visible = false;
      },
      //获取订单列表
      loadData() {
        let query = JSON.stringify({userID: this.userID, phone: this.phone,realName:this.realName});
        if(!this.userID&&!this.phone&&!this.realName){
          query = ""
        }
        const data = {
          type: 3,
          page: this.currentPage,
          pageSize: this.pageCount,
          payMent: this.payMent,
          status: this.status,
          query: query
        };
        console.log(JSON.stringify(data));
        this.$http({
          url: "/order/getListAdmin",
          method: "POST",
          data: data,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          transformRequest: [function (data) {
            let _data = Qs.parse(data);
            let json = JSON.stringify(_data);
            console.log(_data);
            return json;
          }]
        }).then(data => {
          console.log(data);
          if (data.errCode == 0) {
            this.totalCount = data.info.count;
            this.tableData = data.info.data.data;
            this.orderTotal = data.info.data.orderTotal
            this.returnTotal = data.info.data.returnTotal
            this.tableData.map(item => {
              item.cerateTime = this.timestampToTime(item.cerateTime)
              item.payTime = this.timestampToTime(item.payTime)
              console.log('303', item.status);


            })
            return true;
          } else {
            Message({
              showClose: true,
              message: data.info,
              type: 'error'
            });
          }
        }).catch(error => {
        })
      }
    },
    created() {
      this.loadData();
    }
  }
</script>

<style lang="less">
  .scOrder_container {
    @media screen and (max-width: 1280px) {
      .main {
        /*width: 1100px;*/
        margin: 0 auto;
      }
    }
    @media screen and (min-width: 1366px) {
      .main {
        width: 100%;
        margin: 0 auto;
      }
    }
    .main {
      border: solid 1px #e6e6e6;
      .top {
        margin-left: 0 !important;
        margin-right: 0 !important;
        /*margin: 10px 0;*/
        border: solid 1px rgba(69, 157, 255, 0.6);
        box-sizing: border-box;
        padding: 5px 15px;
        .el-button.is-circle {
          padding: 6px;
        }
        .el-input {
          display: inline-block;
          width: 70%;
        }
        .filter {
          .el-input {
            display: inline-block;
            width: 100%;
          }
        }
      }
      .table_container {
        .el-table {
          .has-gutter {
            th {
              color: #333;
              .cell {
                height: 30px;
                padding: 0;
                & > div {
                  padding: 0;
                  width: 100%;
                  height: 30px;
                  line-height: 30px;
                  .el-input {
                    width: 70px;
                    height: 30px;
                    float: left;
                  }
                  input {
                    width: 60px;
                    height: 25px;
                    margin-top: 2px;
                    float: left;
                    padding: 0 5px;
                  }
                  span {
                    float: left;
                  }
                  button {
                    float: left;
                    margin: 0 5px;
                  }
                  .el-button.is-circle {
                    padding: 5px;
                  }
                }
              }
            }
          }
          /*.el-button--small {*/
          /*padding: 4px 6px;*/
          /*}*/
        }
      }
    }
    .goods_content_dialog {
      .el-col {
        font-size: 16px;
        line-height: 2em;
      }
      .goodsInfo_bottom {
        margin-top: 5px;
        border-top: solid 2px #e6e6e6;
      }
    }
  }
</style>
