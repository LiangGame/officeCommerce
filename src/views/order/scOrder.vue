<template>
  <div class="scOrder_container">
    <div class="main">
      <!--<el-row class="top" :gutter="10">-->
      <!--<el-col :span="5">-->
      <!--<span>用户ID : </span>-->
      <!--<el-input v-model="userID" size="mini" placeholder="用户ID"></el-input>-->
      <!--<el-button type="primary" icon="el-icon-search" size="mini" circle @click="showOperate"></el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="12">-->
      <!--<span>订单状态 : </span>-->
      <!--<el-select v-model="status" size="mini" placeholder="请选择" multiple collapse-tags class="filter">-->
      <!--<el-option-->
      <!--v-for="item in payMents"-->
      <!--:key="item.value"-->
      <!--:label="item.label"-->
      <!--:value="item.value">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--<span>支付方式 : </span>-->
      <!--<el-select v-model="payMent" size="mini" placeholder="请选择" multiple collapse-tags class="filter">-->
      <!--<el-option-->
      <!--v-for="item in status1"-->
      <!--:key="item.value"-->
      <!--:label="item.label"-->
      <!--:value="item.value">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-button type="primary" icon="el-icon-search" size="mini" @click="loadData">筛选</el-button>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <div class="table_container">
        <el-table
          :data="tableData"
          border
          :height="listHeight"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="订单号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="userID"
            label='用户ID'
            align="center"
            width="160"
            :render-header="renderHeader">
          </el-table-column>
          <el-table-column
            prop="cerateTime"
            label="下单时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="count"
            label="购买数量"
            align="center">
          </el-table-column>
          <el-table-column
            prop="totalPrice"
            label="总金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="payTime"
            label="付款时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="payMent"
            label="支付方式"
            align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="订单状态"
            align="center"
            :filters="filters"
            :filter-method="filterTag"
            :filter-multiple="false"
            filter-placement="bottom-end">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <!--<el-button type="success" size="small" @click="showOperate(scope.row.userID)">查看</el-button>-->
              <el-button type="primary" size="small" :disabled="scope.row.status == '已付款'||scope.row.status != '财务未确认'"
                         @click="confirmOrder(scope.row.id,scope.row.userID,scope.row.count,scope.row.goodID)">
                {{scope.row.status == '已付款'||scope.row.status != '财务未确认' ? '已发货':'发货'}}
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
        <span style="color: #666;">共计已付款金额：3500元    共计未付款金额：3500元</span>
      </div>
      <!--弹窗-->
      <el-dialog
        title="查看订单详情"
        :visible="visible"
        width="1000px"
        :closeOnClickModal="false"
        :before-close="handleClose">

        <!--  <el-row :gutter="20">
            <el-col :span="12">
              <el-col :span="12">商品名称</el-col>
              <el-col :span="12">{{ruleForm.goodName}}</el-col>
              <el-col :span="12">单价</el-col>
              <el-col :span="12">{{ruleForm.price}}</el-col>
              <el-col :span="12">数量</el-col>
              <el-col :span="12">{{ruleForm.count}}</el-col>
              <el-col :span="12">总价</el-col>
              <el-col :span="12">{{ruleForm.totalPrice}}</el-col>
              <el-col :span="12">商品图片</el-col>
              <el-col :span="12">
                <img :src="fileUrl+ruleForm.img" :alt="ruleForm.goodName">
              </el-col>
              &lt;!&ndash;<el-form-item label="商品名称" prop="goodName">&ndash;&gt;
                &lt;!&ndash;<span class="good_info" v-text="ruleForm.goodName"></span>&ndash;&gt;
                &lt;!&ndash;<el-input v-model="ruleForm.goodName"></el-input>&ndash;&gt;
              &lt;!&ndash;</el-form-item>&ndash;&gt;
              &lt;!&ndash;<el-form-item label="单价" prop="goodName">&ndash;&gt;
                &lt;!&ndash;<span class="good_info" v-text="ruleForm.price"></span>&ndash;&gt;
              &lt;!&ndash;</el-form-item>&ndash;&gt;
              &lt;!&ndash;<el-form-item label="数量" prop="goodName">&ndash;&gt;
                &lt;!&ndash;<span class="good_info">{{ruleForm.count}}</span>&ndash;&gt;
              &lt;!&ndash;</el-form-item>&ndash;&gt;
              &lt;!&ndash;<el-form-item label="总价" prop="goodName">&ndash;&gt;
                &lt;!&ndash;<span class="good_info">{{ruleForm.totalPrice}}</span>&ndash;&gt;
              &lt;!&ndash;</el-form-item>&ndash;&gt;
              &lt;!&ndash;<el-form-item label="商品图片" prop="goodDescribe">&ndash;&gt;
                &lt;!&ndash;<img :src="fileUrl+ruleForm.img" :alt="ruleForm.goodName">&ndash;&gt;
              &lt;!&ndash;</el-form-item>&ndash;&gt;
            </el-col>
            <el-col :span="12">
              &lt;!&ndash;<el-form-item label="用户名称" prop="goodName">&ndash;&gt;
                &lt;!&ndash;<span class="good_info">{{ruleForm.userID}}</span>&ndash;&gt;
              &lt;!&ndash;</el-form-item>&ndash;&gt;
              &lt;!&ndash;<el-form-item label="下单时间" prop="goodName">&ndash;&gt;
                &lt;!&ndash;<span class="good_info">{{ruleForm.cerateTime}}</span>&ndash;&gt;
              &lt;!&ndash;</el-form-item>&ndash;&gt;
              &lt;!&ndash;<el-form-item label="付款时间" prop="goodName">&ndash;&gt;
                &lt;!&ndash;<span class="good_info">{{ruleForm.payTime}}</span>&ndash;&gt;
              &lt;!&ndash;</el-form-item>&ndash;&gt;
              &lt;!&ndash;<el-form-item label="支付方式" prop="goodName">&ndash;&gt;
                &lt;!&ndash;<span class="good_info">{{ruleForm.payMent}}</span>&ndash;&gt;
              &lt;!&ndash;</el-form-item>&ndash;&gt;
              &lt;!&ndash;<el-form-item label="订单状态" prop="goodName">&ndash;&gt;
                &lt;!&ndash;<span class="good_info">{{ruleForm.status}}</span>&ndash;&gt;
              &lt;!&ndash;</el-form-item>&ndash;&gt;


            </el-col>
          </el-row>-->
        <!--</el-form>-->
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
        fileUrl: fileUrl,
        listHeight: this.getWinHeight() - 100,
        userID: '',
        type: '0',
        tableData: [],
        //筛选条件
        payMent: [],
        status: [],
        filters: [
          {text: '未支付', value: '0'},
          {text: '财务未确认', value: '1'},
          {text: '已付款', value: '2'},
          {text: '已返第一次佣金', value: '3'},
          {text: '已返全部佣金', value: '4'}
        ],
        payMents: [{
          value: 0,
          label: '未支付'
        }, {
          value: 1,
          label: '财务未确认'
        }, {
          value: 2,
          label: '已付款'
        }, {
          value: 3,
          label: '已返第一次佣金'
        }, {
          value: 4,
          label: '已返全部佣金'
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
        ruleForm: {},
      }
    },
    methods: {
      getWinHeight: getWinHeight,
      timestampToTime: timestampToTime,
      renderHeader(createElement, {column}) {
        return createElement(
          'div',
          [
            createElement('el-input', {
              attrs: {
                type: 'text'
              }
            }),
            createElement('el-button',{
              attrs: {
                icon: 'el-icon-search',
                type:'primary',
                circle:'',
                size:'mini'
              }
            }),
            createElement('span', [column.label])
          ])
      },
      filterTag(value, row) {
        return row.tag === value;
      },
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
      showOperate() {
        if (this.userID) {
          this.$http({
            url: "/order/getListAdminByUserID",
            method: "GET",
            params: {userID: this.userID}
          }).then(data => {
            console.log(data);
            if (data.errCode == 0) {
              this.tableData = data.info;
              this.tableData.map(item => {
                item.cerateTime = this.timestampToTime(item.cerateTime)
                item.payTime = this.timestampToTime(item.payTime)
                if (item.status == 0) {
                  item.status = '未支付'
                } else if (item.status == 1) {
                  item.status = '财务未确认'
                } else if (item.status == 2) {
                  item.status = '已付款'
                } else if (item.status == 3) {
                  item.status = '已返第一次佣金'
                } else if (item.status == 4) {
                  item.status = '已返全部佣金'
                }
                if (item.payMent == 1) {
                  item.payMent = '支付宝'
                } else if (item.payMent == 2) {
                  item.payMent = '微信'
                } else if (item.payMent == 3) {
                  item.payMent = '银行卡'
                } else if (item.payMent == 4) {
                  item.payMent = '余额'
                }
              })
            }
          }).catch(error => {
          })
        } else {
          this.loadData();
        }
      },
      //发货
      confirmOrder(orderID, userID, count, goodID) {
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
                url: "/order/confirmOrder",
                method: "GET",
                params: {orderID: orderID, userID: userID, count: count, goodID: goodID}
              }).then(data => {
                console.log(data);
                if (data.errCode == 0) {
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
        const data = {type:3,page: this.currentPage, pageSize: this.pageCount, payMent: this.payMent, status: this.status};
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
            this.tableData = data.info.data;
            this.tableData.map(item => {
              item.cerateTime = this.timestampToTime(item.cerateTime)
              item.payTime = this.timestampToTime(item.payTime)
              if (item.status == 0) {
                item.status = '未支付'
              } else if (item.status == 1) {
                item.status = '财务未确认'
              } else if (item.status == 2) {
                item.status = '已付款'
              } else if (item.status == 3) {
                item.status = '已返第一次佣金'
              } else if (item.status == 4) {
                item.status = '已返全部佣金'
              }
              if (item.payMent == 1) {
                item.payMent = '支付宝'
              } else if (item.payMent == 2) {
                item.payMent = '微信'
              } else if (item.payMent == 3) {
                item.payMent = '银行卡'
              } else if (item.payMent == 4) {
                item.payMent = '余额'
              }
            })
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
                  button{
                    float: left;
                    margin: 0 5px;
                  }
                  .el-button.is-circle{
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

  }
</style>
