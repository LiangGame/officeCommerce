<template>
  <div class="vip_container">
    <div class="main">
      <el-row class="top" :gutter="10">
        <el-input v-model="user_id" size="mini" style="width: 150px" placeholder="用户ID"></el-input>
        <el-input v-model="user_phone" size="mini" style="width: 150px" placeholder="手机号"></el-input>
        <el-input v-model="user_name" size="mini" style="width: 150px" placeholder="姓名"></el-input>
        <el-select v-model="order_type" size="mini" placeholder="请选择类型" collapse-tags class="filter">
          <el-option
            v-for="item in types"
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
            label="ID"
            align="center">
            <template slot-scope="scope">
              {{scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            align="center">
          </el-table-column>
          <el-table-column
            label="余额"
            align="center"
            width="100">
            <template slot-scope="scope">
              <span style="display: inline-block;">{{scope.row.balance}}</span>
              <el-button style="padding: 3px 5px;float: right" type="success" size="small"
                         @click="billInfo = true;getListAdminByUserID(scope.row.id)">查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="rewardPoint"
            label="迈达币"
            align="center">
          </el-table-column>
          <el-table-column
            prop="registTime"
            label="注册时间"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="类型"
            align="center">
            <!--:filters="[{ text: '代', value: '4' }, { text: '售', value: '1' }, { text: '无', value: '2' }]"-->
            <!--:filter-method="filterTag"-->
            <!--:filter-multiple="false"-->
            <!--filter-placement="bottom-end"-->
            <template slot-scope="scope">
              <el-button style="background: red;color:#fff" size="mini" disabled v-if="scope.row.isAgent">代</el-button>
              <el-button style="background: #3a8ee6;color:#fff" size="mini" disabled v-if="scope.row.count>0">售
              </el-button>
              <el-button style="background: black;color:#fff" size="mini" disabled
                         v-if="scope.row.isAgent == 0&&scope.row.count<=0">无
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="实名认证"
            align="center">
          </el-table-column>
          <el-table-column
            prop="agentEndTime"
            label="代理资格过期时间"
            align="center"
            width="100">
            <template slot-scope="scope">
              {{timestampToTime(scope.row.agentEndTime)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="isAuto"
            label="是否自动续费"
            align="center">
            <template slot-scope="scope">
              {{scope.row.isAuto==0?'未设置':scope.row.isAuto==1?'自动续费':'不续费'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="member"
            label="下线会员"
            align="center">
            <template slot-scope="scope">
              {{scope.row.member}}
              <el-button style="padding: 3px 5px;float: right" type="success" size="small" @click="seeVip(scope.row)">
                详情
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="count"
            label="订单数量"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="400"
            v-if="isReadOnly == 0">
            <template slot-scope="scope">
              <!--<el-button type="success" size="small" @click="showVipInfo = true;VipInfo=scope.row">查看</el-button>-->
              <el-button type="success" size="small" :disabled="scope.row.status == '已认证'"
                         @click.native="SMRZ = true;userID=scope.row.id">添加实名认证
              </el-button>
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
    <!--弹窗-->
    <el-dialog
      title="余额明细"
      :visible="billInfo"
      width="800px"
      :closeOnClickModal="false"
      :before-close="handleClose"
      class="vipInfo">
      <el-table
        :data="billList"
        border
        height="400px"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="time"
          label="交易时间"
          align="center"
          width="260">
          <template slot-scope="scope">
            {{timestampToTime(scope.row.time)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="sum"
          label="金额"
          align="center">
        </el-table-column>
        <el-table-column
          prop="payMent"
          label="支付方式"
          align="center">
          <template slot-scope="scope">
            {{scope.row.payMent | Ment}}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="余额变动类型"
          align="center">
          <template slot-scope="scope">
            {{scope.row.type | status}}
          </template>
        </el-table-column>
        <el-table-column
          prop="fromUserID"
          label="代言费的来源会员ID"
          align="center">
          <template slot-scope="scope">
            {{scope.row.fromUserID}}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--弹窗-->
    <el-dialog
      title="会员详情"
      :visible="showVipInfo"
      width="500px"
      :closeOnClickModal="false"
      :before-close="handleClose"
      class="vipInfo">
      <el-row>
        <el-col :span="4">会员ID：</el-col>
        <el-col :span="8">{{VipInfo.id}}</el-col>
        <el-col :span="4">姓名：</el-col>
        <el-col :span="8">{{VipInfo.realName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">注册时间：</el-col>
        <el-col :span="8">{{VipInfo.registTime}}</el-col>
        <el-col :span="4">手机号：</el-col>
        <el-col :span="8">{{VipInfo.phone}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">余额：</el-col>
        <el-col :span="8">{{VipInfo.balance}}</el-col>
        <el-col :span="4">订单数量：</el-col>
        <el-col :span="8">{{VipInfo.count}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">上级ID：</el-col>
        <el-col :span="8">{{VipInfo.chief}}</el-col>
        <el-col :span="4">下级会员：</el-col>
        <el-col :span="8">{{VipInfo.member}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">实名认证：</el-col>
        <el-col :span="8">{{VipInfo.status}}</el-col>
        <el-col :span="4">身份证号：</el-col>
        <el-col :span="8">{{VipInfo.IDcard}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">密码：</el-col>
        <el-col :span="8">{{VipInfo.password}}</el-col>
        <el-col :span="4">银行卡号：</el-col>
        <el-col :span="8">{{VipInfo.creditCard}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">开户行：</el-col>
        <el-col :span="20">{{VipInfo.bankname}}</el-col>
      </el-row>
      <hr>
      <div class="first_vip">
        <h3><img slot="icon" src="../../../src/assets/pic/group_fill.png" alt="">一级会员({{member.level1Count}})</h3>
        <ul>
          <li v-for="item in member.level1Res">
            <div class="left fl">
              <p class="vipType" style="background: #e93b3b" v-if="item.isAgent"></p>
              <p class="vipType" style="background: #5a5a5a" v-if="item.isAgent == 0&&item.orderCount == 0"></p>
              <p class="vipType" style="background: #56abf2" v-if="item.orderCount > 0"></p>
            </div>
            <div class="right fl">
              <p>{{item.realName ? item.realName:'未实名'}} x {{item.orderCount}}</p>
              <p>ID:{{item.id}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="second_vip">
        <h3><img slot="icon" src="../../../src/assets/pic/group_fill.png" alt="">二级会员({{member.level2Count}})</h3>
        <ul>
          <li v-for="item in member.level2Res">
            <div class="left fl">
              <p class="vipType" style="background: #e93b3b" v-if="item.isAgent"></p>
              <p class="vipType" style="background: #5a5a5a" v-if="item.isAgent == 0&&item.orderCount == 0"></p>
              <p class="vipType" style="background: #56abf2" v-if="item.orderCount > 0"></p>
            </div>
            <div class="right fl">
              <p>{{item.realName ? item.realName:'未实名'}} x {{item.orderCount}}</p>
              <p>ID:{{item.id}}</p>
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
    <!--弹窗-->
    <el-dialog
      title="添加实名认证"
      :visible="SMRZ"
      width="500px"
      :closeOnClickModal="false"
      :before-close="handleClose">
      <el-form :model="SMRZData" label-width="80px">
        <!--<el-form-item label="用户ID">-->
        <!--<el-input v-model="SMRZData.id" disabled></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="姓名">
          <el-input v-model="SMRZData.realName"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="SMRZData.IDcard"></el-input>
        </el-form-item>
        <el-form-item label="开户行">
          <el-input v-model="SMRZData.bankname"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号">
          <el-input v-model="SMRZData.creditCard"></el-input>
        </el-form-item>
        <p style="color: #e93b3b">开户行请填写 xx银行xx支行，如：“中国银行北京分行”</p>
        <el-form-item label-width="0" align="center">
          <el-button type="primary" size="small" @click="addSMRZD">提交</el-button>
        </el-form-item>
      </el-form>
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
        isReadOnly: this.Cookie.get('isReadOnly'),
        listHeight: this.getWinHeight() - 180,
        orderId: '',
        userID: '',
        type: '',
        tableData: [],
        phone: '',
        // 分页
        currentPage: 1,
        pageCount: 50,
        totalCount: 0,
        //弹窗
        visible: false,
        showVipInfo: false,
        billInfo: false,
        billList: [],
        VipInfo: {},
        member: {},
        SMRZ: false,
        SMRZData: {},
        //筛选
        types: [
          {
            value: '',
            label: '全部'
          }, {
            value: '1',
            label: '代理'
          }, {
            value: '2',
            label: '有代售订单'
          }, {
            value: '3',
            label: '无'
          },
        ],
        order_type:'',
        user_id:'',
        user_name:'',
        user_phone:''
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
        this.showVipInfo = false;
        this.billInfo = false;
        this.SMRZ = false;
      },
      loadData() {
        let query = JSON.stringify({phone:this.user_phone,realName:this.user_name,userID:this.user_id})

        if(!this.order_type&&!this.user_phone&&!this.user_id&&!this.user_name){
          query = "";
        }
        this.$http({
          url: "/admin/getAllUser",
          method: "POST",
          data: {page: this.currentPage, pageSize: this.pageCount,type:this.order_type,query:query},
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
      resetUserStatus(userID) {
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
      },
      //获取指定用户的余额
      getListAdminByUserID(id) {
        this.$http({
          url: "/balance/getListAdminByUserID",
          method: "GET",
          params: {userID: id}
        }).then(data => {
          console.log(data);
          if (data.errCode == 0) {
            this.billList = data.info;
          } else {
            Message({
              showClose: true,
              message: data.info,
              type: 'error'
            });
          }
        })
      },
      //添加实名认证
      addSMRZD() {
        this.SMRZData.id = this.userID;
        this.$http({
          url: "/admin/addUserStatus",
          method: "POST",
          data: this.SMRZData,
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
            this.SMRZ = false;
          } else {
            Message({
              showClose: true,
              message: data.info,
              type: 'error'
            });
          }
        })
      },
      //查看会员详情
      seeVip(userInfo) {
        this.showVipInfo = true;
        this.VipInfo = userInfo;
        console.log(userInfo);
        this.$http({
          url: "/user/getMember",
          method: "GET",
          params: {id: userInfo.id}
        }).then(data => {
          if (data.errCode == 0) {
            this.member = data.info
          }
        })
      }
    },
    created() {
      this.loadData()
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
        // 余额变动类型：1，购买。2，代售回款。3，代言费。4，提现。5，充值
        var status = null;
        if (value == 1) {
          status = '购买'
        } else if (value == 2) {
          status = '代售回款'
        } else if (value == 3) {
          status = '提成'
        } else if (value == 4) {
          status = '提现'
        } else if (value == 5) {
          status = '充值'
        } else if (value == 6) {
          status = '购买代理资格'
        } else if (value == 7) {
          status = '代理资格提成'
        } else if (value == 8) {
          status = '代理资格回款'
        } else if (value == 9) {
          status = '代理资格退款'
        } else if (value == 10) {
          status = '自提订单回款'
        } else if (value == 11) {
          status = '购买迈达币'
        }
        return status
      }
    }
  }
</script>

<style lang="less">
  .vip_container {
    .fl {
      float: left;
    }
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
      .yes {
        float: left;
        display: inline-block;
        width: 20px;
        height: 20px;
        background: #67c23a;
        border-radius: 50%;
      }
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
          .el-button + .el-button {
            margin-left: 0;
          }
          .cell {
            line-height: normal;
          }
        }
        .el-table__body-wrapper {
          overflow-x: hidden;
        }
      }
    }
    .vipInfo {
      .el-dialog__body {
        height: 500px;
        overflow-y: auto;
      }
      .el-row {
        line-height: 35px;
        .el-col {
          height: 35px;
        }
      }
      h3 {
        color: #666;
        margin-bottom: 8px;
        img {
          width: 32px;
          height: 32px;
        }
      }
      ul {
        overflow: hidden;
        margin-bottom: 8px;
        li {
          height: 46px;
          width: 33.33%;
          overflow: hidden;
          float: left;
          margin: 5px 0;
          .left {
            margin-right: 5px;
            .vipType {
              display: block;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              margin-top: 0px;
              margin-right: 0px;
            }
          }
          .right {
            width: auto;
          }
        }
      }
      .first_vip {
        overflow: hidden;
      }
      .second_vip {
        overflow: hidden;
      }
    }
  }
</style>
