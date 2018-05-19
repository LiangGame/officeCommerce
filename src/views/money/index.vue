<template>
  <div class="home_container">
    <div class="left fl">
      <div class="sideBar">
        <p>
          <img src="../../assets/pic/u81.png" height="21" width="21"/>
          操作
        </p>
        <ul ref="wrapper">
          <!--<li v-for="(item, index) in navData" :key = 'index' :class="[item.icon?'arrow':'']">-->
            <!--<router-link :to = "item.path" active-class="active" @click.native="$emit('updateKey')">{{item.name}}</router-link>-->
          <!--</li>-->
          <li v-if="level == 0||level == 1||level == 2">
            <router-link to="/money/withdraw" active-class="active">提现</router-link>
          </li>
          <li v-if="level == 0||level == 1">
            <router-link to="/money/recharge" active-class="active">充值</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="right fl">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import sideBar from '@/components/silder/index'
  import {setSize} from '@/common/common.js'

  export default {
    components: {sideBar},
    data(){
      return{
        level:this.Cookie.get('level')
      }
    },
    methods:{
      setSize:setSize
    },
    mounted() {
        this.setSize(110);
        window.onresize = () => {
          this.setSize(110);
        }
    }
  }
</script>

<style lang="less">
  .fl{
    float: left;
  }
  .home_container{
    width: 1100px;
    margin: 0 auto;
  }
  .right{
    width: 938px;
  }
  .sideBar{
    @theme-color:#56abf2;
    @font-color:#474747;
    width: 160px;
    height: 100%;
    border: 1px solid #b6b4b4;
    background: #e4e2e2;
    >p{
      margin: 12px 0 0 0;
      text-align: center;
      font-size: 20px;
      padding-bottom: 5px;
    }
    >ul{
      overflow-y: auto;
      overflow-x: hidden;
      >li{
        font-size: 14px;
        margin-bottom: 8px;
        text-align: center;
        position: relative;
        border-top: solid 1px #fff;
        border-bottom: solid 1px #fff;
        a{
          outline: none;
          color: @font-color;
          display: block;
          padding: 6px 16px;
          border: 2px solid transparent;
          &:hover{
          }
        }
        a.active{
          color: #ed0000;
        }
      }
      /* 箭头 */
      li.arrow:after{
        @w:5px;
        content: '';
        display: block;
        width: 0;
        height: 0;
        border-top: @w solid transparent;
        border-bottom: @w solid transparent;
        border-left: @w solid #fff;
        position: absolute;
        right: 10px;
        top:12px;
      }
    }
  }
</style>
