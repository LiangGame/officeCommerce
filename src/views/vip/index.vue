<template>
  <div class="vip_container">
    <div class="main">
      <el-row class="top" :gutter="10">
        <el-col :span="6">
          <span>关键字 : </span>
          <el-input v-model="orderId" size="mini" placeholder="关键字"></el-input>
        </el-col>
        <el-col :span="6">
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
            prop="id"
            label="编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="balance"
            label="余额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="registTime"
            label="注册时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="实名认证"
            align="center">
          </el-table-column>
          <el-table-column
            prop="member"
            label="下线会员"
            align="center">
          </el-table-column>
          <el-table-column
            prop="count"
            label="订单数量"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="visible = true;userID=scope.row.id">修改手机号</el-button>
              <el-button type="danger" size="small"
                         @click="resetUserStatus(scope.row.id)">重置实名认证
              </el-button>
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
    </div>
    <!--弹窗-->
    <el-dialog
      title="修改手机号"
      :visible="visible"
      width="500px"
      :closeOnClickModal="false"
      :before-close="handleClose">
      <el-row>
        <el-col :span="4"><span style="line-height: 40px">手机号：</span></el-col>
        <el-col :span="20">
          <el-input v-model="phone" placeholder="手机号"></el-input>
        </el-col>
        <el-col :span="24" align="center" style="margin-top: 25px">
          <el-button type="primary" size="small" @click="editUserPhone">确认修改</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import Qs from 'qs';
  import {getWinHeight, timestampToTime} from '@/common/common'
  import {MessageBox, Message} from 'element-ui';

  export default {
    name: "vip",
    data() {
      return {
        listHeight: this.getWinHeight() - 180,
        orderId: '',
        userID: '',
        type: '0',
        tableData: [],
        phone: '',
        // 分页
        currentPage: 1,
        pageCount: 50,
        totalCount: 0,
        //弹窗
        visible: false,
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
      //关闭弹窗
      handleClose(done) {
        this.visible = false;
      },
      loadData() {
        this.$http({
          url: "/admin/getAllUser",
          method: "POST",
          data: {page: this.currentPage, pageSize: this.pageCount},
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          transformRequest: [function (data) {
            let json = JSON.stringify(Qs.parse(data));
            return json;
          }]
        }).then(data => {
          console.log(data);
          if (data.errCode == 0) {
            this.totalCount = data.info.count;
            this.tableData = data.info.data;
            this.tableData.map(item => {
              item.registTime = this.timestampToTime(item.registTime);
              if (item.status) {
                item.status = '已认证'
              } else {
                item.status = '未认证'
              }
            })
          }
        }).catch(error => {
        })
      },
      //修改手机号
      editUserPhone() {
        this.$http({
          url: "/admin/editUserPhone",
          method: "POST",
          data: {phone: this.phone, userID: this.userID},
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          transformRequest: [function (data) {
            let json = JSON.stringify(Qs.parse(data));
            return json;
          }]
        }).then(data => {
          console.log(data);
          if (data.errCode == 0) {
            Message({
              showClose: true,
              message: data.info,
              type: 'success'
            });
            this.loadData();
            this.visible = false;
          } else {
            Message({
              showClose: true,
              message: data.info,
              type: 'error'
            });
          }
        })
      },
      //重置实名认证
      resetUserStatus(userID){
        MessageBox({
          title: '提示',
          message: `确定重置该记录？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              done();
              this.$http({
                url: "/admin/resetUserStatus",
                method: "GET",
                params: {userID: userID}
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
              })
              return true
            } else {
              done();
              return false
            }
          }
        });
      }
    },
    created() {
      this.loadData()
    }
  }
</script>

<style lang="less">
  .vip_container {
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
        .el-table__body-wrapper {
          overflow-x: hidden;
        }
      }
    }
  }
</style>
