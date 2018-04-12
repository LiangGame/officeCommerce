<template>
  <div class="jurisdiction_container">
    <div class="main">
      <el-row class="top" :gutter="10">
        <el-col :span="6">
          <span>关键字 : </span>
          <el-input v-model="orderId" size="mini" placeholder="关键字"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search" size="mini" circle></el-button>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button type="danger" icon="el-icon-plus" size="mini" @click="operate(0,0)">添加</el-button>
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
            label="编号"
            align="center"
            width="260">
          </el-table-column>
          <el-table-column
            prop="name"
            label="管理员名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="权限等级"
            align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            align="center">
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
    <!--操作弹窗-->
    <jurisdiction-operate v-if="isShowOperate" :visible="isShowOperate" :isEdit="isEdit" :ID="ID"
                  @updateIsShow="val => isShowOperate = val" @updateInfo="loadData"/>
  </div>
</template>

<script>
  import jurisdictionOperate from './operate/jurisdictionOperate'
  import {getWinHeight} from '@/common/common'
  export default {
    name: "jurisdiction",
    components: {jurisdictionOperate},
    data() {
      return {
        listHeight: this.getWinHeight() - 180,
        orderId: '',
        type: '0',
        tableData: [],
        isEdit: '0',//0是添加，1是编辑,2是查看
        isShowOperate: false,
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
      loadData() {

      },
      operate(type, id) {
        this.isShowOperate = true;
        this.isEdit = type;
        this.ID = id;
      },
    }
  }
</script>

<style lang="less">
  .jurisdiction_container {
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
        .el-button--mini, .el-button--mini.is-round{
          padding: 6px 10px;
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
