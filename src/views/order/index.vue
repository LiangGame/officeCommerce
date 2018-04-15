<template>
  <div class="home_container">
    <div class="main">
      <el-row class="top" :gutter="10">
        <el-col :span="6">
          <span>订单号 : </span>
          <el-input v-model="orderId" size="mini" placeholder="订单号"></el-input>
        </el-col>
        <el-col :span="7">
          <span>收货状态 : </span>
          <el-select v-model="type" size="mini" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" size="mini" circle></el-button>
        </el-col>
      </el-row>
      <div class="table_container">
        <el-table
          :data="tableData"
          border
          :height="listHeight"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="订单号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="date"
            label="用户姓名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="下单时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="date"
            label="购买数量"
            align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="总金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="付款时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="payMent"
            label="支付方式"
            align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="订单状态"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="200">
            <template slot-scope="scope">
              <el-button type="success" size="small" @click="showOperate(scope.row.id)">查看</el-button>
              <el-button type="primary" size="small" @click="confirmOrder(scope.row.id)">发货</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[50, 100, 500]"
        :page-size="10"
        layout="total,sizes, prev, pager, next"
        :total="totalCount">
      </el-pagination>
      <!--弹窗-->
      <el-dialog
        title="查看订单详情"
        :visible="visible"
        width="1000px"
        :closeOnClickModal="false"
        :before-close="handleClose">
        <el-form :model="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="商品名称" prop="goodName">
                <span class="good_info"></span>
              </el-form-item>
              <el-form-item label="商品描述" prop="goodDescribe">
                <span class="good_info"></span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品名称" prop="goodName">
                <span class="good_info"></span>
              </el-form-item>
              <el-form-item label="商品描述" prop="goodDescribe">
                <span class="good_info"></span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {getWinHeight} from '@/common/common'

  export default {
    name: "index",
    data() {
      return {
        listHeight: this.getWinHeight() - 180,
        orderId: '',
        options: [{
          value: '0',
          label: '已付款'
        }, {
          value: '1',
          label: '已发货'
        }],
        type: '0',
        tableData: [{id:1}],
        // 分页
        currentPage: 1,
        pageCount: 10,
        totalCount: 0,
        //弹窗
        visible:false,
        ruleForm: {
          goodName: '',
          goodDescribe: '',
          rewardTotal: '',
          rewardSecond: '',
          max: '',
          img: [],
          price: '',
        },
      }
    },
    methods: {
      getWinHeight: getWinHeight,
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
      showOperate(id){
        if(id){
          this.$http({
            url: "/order/getListAdminByUserID",
            method: "GET",
            params: {userID:id}
          }).then(data => {
            console.log(data);
            if (data.errCode == 0) {
              this.ruleForm = data.info;
            }
          }).catch(error => {
          })
        }
        this.visible = true;
      },
      //发货
      confirmOrder(){
        this.$http({
          url: "/order/confirmOrder",
          method: "GET",
          params: {orderID:'',userID:'',count:'',goodID:''}
        }).then(data => {
          console.log(data);
          if (data.errCode == 0) {
            this.ruleForm = data.info;
          }
        }).catch(error => {
        })
      },
      //关闭弹窗
      handleClose(done) {
        this.visible = false;
      },
      //获取订单列表
      loadData(){
        this.$http({
          url: "/order/getListAdmin",
          method: "GET",
          params: {}
        }).then(data => {
          console.log(data);
          if (data.errCode == 0) {

          }
        }).catch(error => {
        })
      }
    },
    created(){
      this.loadData();
    }
  }
</script>

<style lang="less">
  .home_container {
    @media screen and (max-width: 1280px) {
      .main {
        width: 1100px;
        margin: 0 auto;
      }
    }
    @media screen and (min-width: 1366px) {
      .main {
        width: 80%;
        margin: 0 auto;
      }
    }
    .main {
      .top {
        margin-left: 0 !important;
        margin-right: 0 !important;
        margin: 10px 0;
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
          .el-button--small{
            padding: 4px 6px;
          }
        }
      }
    }
  }
</style>
