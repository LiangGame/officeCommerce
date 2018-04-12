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
            prop="name"
            label="下单时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="收货人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="总金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="订单状态"
            align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            align="center"
            width="100">
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
        tableData: [],
        // 分页
        currentPage: 1,
        pageCount: 10,
        totalCount: 0,
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
        }
      }
    }
  }
</style>
