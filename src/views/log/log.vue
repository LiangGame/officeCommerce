<template>
  <div class="log_container">
    <div class="main">
      <el-table
        :data="tableData"
        border
        stripe
        :height="listHeight"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="time"
          label="操作时间"
          width="180"
          align="center">
          <template slot-scope="scope">
            {{timestampToTime(scope.row.time)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="userID"
          label="管理员"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="info"
          label="操作日志"
          align="center">
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
    </div>
  </div>
</template>

<script>
  import {timestampToTime,getWinHeight} from '@/common/common.js';

  export default {
    name: "log",
    data() {
      return {
        tableData:[],
        listHeight: this.getWinHeight() - 120,
        // 分页
        currentPage: 1,
        pageCount: 50,
        totalCount: 0,
      }
    },
    methods: {
      getWinHeight:getWinHeight,
      timestampToTime:timestampToTime,
      /* 分页 */
      handleCurrentChange(val) {
        this.currentPage = val;  // 当前页数
        this.getLog();
      },
      handleSizeChange(val) {
        this.pageCount = val; // 每页条数
        this.getLog();
      },
      getLog() {
        this.$http({
          url: '/admin/getLog',
          method: 'GET',
          params: {page:this.currentPage,pageSize:this.pageCount}
        }).then(data => {
          if(data.errCode == 0){
            this.totalCount = data.info.count;
            this.tableData = data.info.data
          }
          console.log(data);
        })
      }
    },
    created() {
      this.getLog();
    }
  }
</script>

<style lang="less" scoped>
  .log_container {
    width: 1100px;
    margin: 0 auto;
    .main{

    }
  }
</style>
