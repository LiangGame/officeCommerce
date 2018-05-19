<template>
    <div class="withdraw_container">
      <div class="main">
        <el-row class="top" :gutter="10">
          <!--<span>用户ID : </span>-->
          <el-input v-model="userID" size="mini" style="width: 150px" placeholder="用户ID"></el-input>
          <el-input v-model="realName" size="mini" style="width: 150px" placeholder="姓名"></el-input>
          <el-input v-model="phone" size="mini" style="width: 150px" placeholder="手机号"></el-input>
          <el-select v-model="status" size="mini" placeholder="请选择充值状态" collapse-tags class="filter">
            <el-option
              v-for="item in payMents"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getWithdrawals">筛选</el-button>
        </el-row>
        <!--Withdraw-->
        <div class="table_container">
          <el-table
            :data="tableData"
            border
            :height="listHeight"
            style="width: 100%">
            <el-table-column
              prop="id"
              label="编号"
              align="center">
            </el-table-column>
            <el-table-column
              prop="userID"
              label="用户ID"
              align="center">
            </el-table-column>
            <el-table-column
              prop="creditCard"
              label="银行卡"
              align="center">
            </el-table-column>
            <el-table-column
              prop="bankname"
              label="开户行"
              align="center">
            </el-table-column>
            <el-table-column
              prop="realName"
              label="持卡人姓名"
              align="center">
            </el-table-column>
            <el-table-column
              label="提现时间"
              align="center"
              width="100">
              <template slot-scope="scope">
                {{timestampToTime(scope.row.time)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="money"
              label="打款全额"
              align="center">
              <template slot-scope="scope">
                {{scope.row.money | str}}
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
              align="center"
              v-if="isReadOnly == 0">
              <template slot-scope="scope">
                <el-button type="primary" size="small" :disabled="scope.row.status == 1"
                           @click="comfirmWithdrawals(scope.row.id)">
                  {{scope.row.status == 1 ? '已打款':'打款'}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--分页-->
        <div style="line-height: 32px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[50, 100, 500]"
            :page-size="10"
            layout="total,sizes, prev, pager, next"
            :total="totalCount"
            style="display: inline-block">
            <!--<template>-->
            <!--</template>-->
          </el-pagination>
          <span style="color: #666;">共计提现金额：{{returnTotal}}元  </span>
        </div>
      </div>
    </div>
</template>

<script>
  import Qs from 'qs';
  import {getWinHeight, timestampToTime} from '@/common/common'
  import {MessageBox, Message} from 'element-ui';

  export default {
    name: "money",
    data() {
      return {
        returnTotal:0,
        isReadOnly: this.Cookie.get('isReadOnly'),
        listHeight: this.getWinHeight() - 145,
        activeName: 'first',
        orderId: '',
        type: '0',
        tableData: [{id: 1}],
        level: this.Cookie.get('level'),
        // 分页
        currentPage: 1,
        pageCount: 50,
        totalCount: 0,
        payMents: [{
          value: '',
          label: '全部'
        }, {
          value: 1,
          label: '已打款'
        }, {
          value: 0,
          label: '未打款'
        }],
        userID:'',
        status:'',
        realName:'',
        phone:''
      }
    },
    methods: {
      getWinHeight: getWinHeight,
      timestampToTime: timestampToTime,
      /* 分页 */
      handleCurrentChange(val) {
        this.currentPage = val;  // 当前页数
        this.getWithdrawals(this.datePicker);
      },
      handleSizeChange(val) {
        this.pageCount = val; // 每页条数
        this.getWithdrawals(this.datePicker);
      },
      handleClick(tab, event) {
        console.log(tab);
        if (tab) {
          if (tab.name == 'first') {
            this.getRechargeList()
          } else {
            this.getWithdrawals()
          }
        } else {
          this.getRechargeList()
        }
      },
      //获取充值列表
      getRechargeList() {
        this.$http({
          url: "/order/getRechargeList",
          method: 'POST',
          data: {page: this.currentPage, pageSize: this.pageCount},
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
          if (data.errCode == 0) {
            this.totalCount = data.info.count;
            this.tableData = data.info.data.data;
            this.returnTotal = data.info.data.returnTotal
          } else {
            Message({
              showClose: true,
              message: data.info,
              type: 'error'
            });
          }
        }).catch(err => {
          Message({
            showClose: true,
            message: '请求失败!',
            type: 'error'
          });
        })
      },
      //获取提现列表
      getWithdrawals() {
        let query = JSON.stringify({realName:this.realName,userID:this.userID,phone:this.phone});
        if(!this.realName&&!this.userID&&!this.status){
          query = "";
        }
        this.$http({
          url: "/order/getWithdrawals",
          method: 'POST',
          data: {page: this.currentPage, pageSize: this.pageCount,status:this.status,query:query},
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
          if (data.errCode == 0) {
            this.totalCount = data.info.count;
            this.tableData = data.info.data.data;
            this.returnTotal = data.info.data.returnTotal
          } else {
            Message({
              showClose: true,
              message: data.info,
              type: 'error'
            });
          }
        }).catch(err => {
          Message({
            showClose: true,
            message: '请求失败!',
            type: 'error'
          });
        })
      },
      //确认充值
      comfirmRecharge(id) {
        MessageBox({
          title: '提示',
          message: `确认充值？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              done();
              this.$http({
                url: "/order/comfirmRecharge",
                method: 'POST',
                data: {orderID: id},
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8'
                },
                transformRequest: [function (data) {
                  let json = JSON.stringify(Qs.parse(data));
                  return json;
                }]
              }).then(data => {
                if (data.errCode == 0) {
                  this.getRechargeList();
                  Message({
                    showClose: true,
                    message: data.info,
                    type: 'success'
                  });
                } else {
                  Message({
                    showClose: true,
                    message: data.info,
                    type: 'error'
                  });
                }
              }).catch(err => {
                console.log(err)
                Message({
                  showClose: true,
                  message: '请求失败!',
                  type: 'error'
                });
              })
              return true
            } else {
              done();
              return false
            }
          }
        })

      },
      //确认提现
      comfirmWithdrawals(id) {
        MessageBox({
          title: '提示',
          message: `确认打款？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              done();
              let _this = this;
              this.$http({
                url: "/order/comfirmWithdrawals",
                method: 'POST',
                data: {orderID: id},
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8'
                },
                transformRequest: [function (data) {
                  let json = JSON.stringify(Qs.parse(data));
                  return json;
                }]
              }).then(data => {
                if (data.errCode == 0) {
                  _this.getWithdrawals();
                  Message({
                    showClose: true,
                    message: data.info,
                    type: 'success'
                  });
                } else {
                  Message({
                    showClose: true,
                    message: data.info,
                    type: 'error'
                  });
                }
              })
              return true
            } else {
              done();
              return false
            }
          }
        })
      }
    },
    created() {
      console.log(this.level == 1);
      if (this.level == 1) {
        this.activeName = 'first'
      } else if (this.level == 2) {
        this.activeName = 'second'
      }
      this.getWithdrawals();
    },
    filters: {
      Ment(value) {
        var type = null;
        if (value == 1) {
          type = '支付宝'
        } else if (value == 2) {
          type = '微信'
        } else if (value == 3) {
          type = '银行卡'
        } else if (value == 4) {
          type = '余额'
        }
        return type;
      },
      status(value) {
        var status = null;
        if (value == 0) {
          status = '财务未确认'
        } else {
          status = '财务已确认'
        }
        return status
      },
      str(value) {
        if (value) {
          if (value.indexOf('-') != -1) {
            return value.split('-')[1];
          } else {
            return value
          }
        }
      }
    }
  }
</script>

<style lang="less">
  .withdraw_container {
    @media screen and (max-width: 1280px) {
      .main {
        width: 1100px;
        margin: 0 auto;
      }
    }
    @media screen and (min-width: 1366px) {
      .main {
        /*width: 80%;*/
        margin: 0 auto;
      }
    }
    .main {
      border: solid 1px #e6e6e6;
      .el-tabs__header {
        margin: 0;
        /*margin-top: 10px;*/
      }
      .el-tabs--card > .el-tabs__header .el-tabs__nav {
        overflow: hidden;
      }
      .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
        background: #3387dc;
        color: white;
      }
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
          width: 79%;
        }
      }
      .table_container {
        .el-table {
          .has-gutter {
            th {
              color: #333;
            }
          }
        }
      }
    }
  }
</style>
