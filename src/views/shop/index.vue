<template>
  <div class="shop_container">
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
            prop="id"
            label="编号"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="img"
            label="图片"
            align="center"
            width="150">
            <template slot-scope="scope">
              <img :src="fileUrl+scope.row.img" :alt="scope.row.goodName" width="120" height="120">
              <!--<img src="https://ss0.bdstatic.com/6ONWsjip0QIZ8tyhnq/it/u=3618554304,2887917621&fm=77&w_h=121_75&cs=2820658166,1330608299"-->
                <!--:alt="scope.row.goodName" width="120" height="120">-->
            </template>
          </el-table-column>
          <el-table-column
            prop="goodName"
            label="商品名称"
            align="center"
            width="300">
          </el-table-column>
          <el-table-column
            prop="goodDescribe"
            label="商品描述"
            align="center">
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="rewardTotal"
            label="一级佣金"
            align="center"
            width="110">
          </el-table-column>
          <el-table-column
            prop="rewardSecond"
            label="二级佣金"
            align="center"
            width="110">
          </el-table-column>
          <el-table-column
            prop="max"
            label="最大购买数量"
            align="center"
            width="110">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            align="center"
            width="300">
            <template slot-scope="scope">
              <buttons @edit="operate(scope.row,1)"
                       @delete="del(scope.row.ID)"/>
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
    <!--操作弹窗-->
    <shop-operate v-if="isShowOperate" :visible="isShowOperate" :isEdit="isEdit" :info="info"
                  @updateIsShow="val => isShowOperate = val" @updateInfo="loadData"/>
  </div>
</template>

<script>
  import {getWinHeight,fileUrl} from '@/common/common'
  import {MessageBox, Message} from 'element-ui';
  import shopOperate from './operate/shopOperate'
  import Buttons from '@/components/Buttons'

  export default {
    name: "shop",
    components: {shopOperate, Buttons},
    data() {
      return {
        listHeight: this.getWinHeight() - 180,
        fileUrl:fileUrl,
        orderId: '',
        type: '0',
        tableData: [],
        isEdit: '0',//0是添加，1是编辑,2是查看
        isShowOperate: false,
        info: null,
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
      //获取订单列表
      loadData() {
        this.$http({
          url: "/goods",
          method: "GET",
          params: {}
        }).then(data => {
          console.log(data);
          if (data.length) {
            this.tableData = data;
          }
        }).catch(error => {
        })
      },
      operate(item, type) {
        this.isShowOperate = true;
        this.isEdit = type;
        this.info = item;
      },
      del(id) {
        MessageBox({
          title: '提示',
          message: `确定删除这条记录？`,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              done();
              this.$http({
                url: "/goods/delGoods",
                method: 'POST',
                data:{id:id}
              }).then(data => {
                if(data.errCode == 0){
                  this.loadData();
                  Message({
                    showClose: true,
                    message: '删除成功!',
                    type: 'success'
                  });
                }else {
                  Message({
                    showClose: true,
                    message: data.info,
                    type: 'success'
                  });
                }

              }).catch(err => {
                Message({
                  showClose: true,
                  message: '删除失败!',
                  type: 'error'
                });
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
      console.log('文件路径:',this.fileUrl);
      this.loadData();
    }
  }
</script>

<style lang="less">
  .shop_container {
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
        .el-button--mini, .el-button--mini.is-round {
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
