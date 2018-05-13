<template>
  <div class="shopAddress_container">
    <el-row>
      <el-col style="text-align: right;height: 45px;line-height: 45px;border-bottom: solid 1px #e6e6e6" v-if="isReadOnly == 0">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click.native="visible = true;isEdit = false">添加</el-button>
      </el-col>
    </el-row>
    <el-table
      border
      :data="formData"
      style="width: 100%;margin: 10px 0 0 0">
      <el-table-column
        fixed
        prop="id"
        label="ID"
        align="center"
        width="50px">
      </el-table-column>
      <el-table-column
        fixed
        prop="address"
        label="自提地址"
        align="center">
      </el-table-column>
      <el-table-column
        fixed
        label="操作"
        align="center"
        width="200px"
        v-if="isReadOnly == 0">
        <template slot-scope="scope">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click.native="isEdit = true;editAddress(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click.native="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--弹窗-->
    <el-dialog
      title="自提地址"
      :visible="visible"
      width="500px"
      :closeOnClickModal="false"
      :before-close="handleClose">
      <el-row>
        <el-col :span="24">
          <el-input v-model="address" placeholder="自提地址"></el-input>
        </el-col>
        <el-col :span="24" align="center" style="margin-top: 25px">
          <el-button type="primary" size="small" @click="submit(item.id)">确认</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import {MessageBox, Message} from 'element-ui';

  export default {
    name: "shopAddress",
    data() {
      return {
        isReadOnly: this.Cookie.get('isReadOnly'),
        isEdit:true,
        formData: [],
        visible: false,
        address: "",
        item:{}
      }
    },
    methods: {
      handleClose(done) {
        this.visible = false;
      },
      //编辑
      editAddress(info){
        this.visible = true;
        this.item = info;
        this.address=info.address;
      },
      //删除
      del(id = null){
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
                url: "/config/delAddress",
                method: "GET",
                params: {id:id}
              }).then(data => {
                if (data.errCode == 0) {
                  this.getAddress();
                  Message({
                    showClose: true,
                    message: '操作成功!',
                    type: 'success'
                  });
                }
              })
            }else {
              done();
              return false
            }
          }
        })
      },
      //提交数据
      submit(id) {
        let url = '';
        if(this.isEdit){
          url = '/config/editAddress'
        }else {
          url = '/config/addAddress'
        }
        this.$http({
          url: url,
          method: "GET",
          params: {address: this.address,id:id}
        }).then(data => {
          if (data.errCode == 0) {
            this.visible = false;
            this.getAddress();
            Message({
              showClose: true,
              message: '操作成功!',
              type: 'success'
            });
          }
        })
      },
      //获取自提地址
      getAddress() {
        this.$http({
          url: "/config/getAddress",
          method: "GET",
          params: {}
        }).then(data => {
          if (data.errCode == 0) {
            this.formData = data.info
          }
        })
      },
    },
    created() {
      this.getAddress();
    }
  }
</script>

<style lang="less" scoped>
  .shopAddress_container {

  }
</style>
