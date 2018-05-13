import Vue from 'vue'
import Router from 'vue-router'
import Cookie from 'js-cookie'
import {vue} from "../main";

const _import = require('./_import_' + process.env.NODE_ENV)


Vue.use(Router)

var routes = [
  {
    path: '/', name: '首页', component: _import('layout/index'),
    redirect: '/order',
    children: [
      {path: '/order', name: '订单管理', component: _import('order/index'),
        redirect:'/order/BookingOrder',
        children:[
          {path: '/order/BookingOrder', name: '代售订单', component: _import('order/dsOrder')},
          {path: '/order/ToOrder', name: '自提订单', component: _import('order/ztOrder')},
          {path: '/order/shopOrder', name: '商城订单', component: _import('order/scOrder')}
        ]
      },
      {path: '/shop', name: '商城管理', component: _import('shop/index'),
        redirect:'/shop/resellsMall',
        children:[
          {path: '/shop/resellsMall', name: '代售商城', component: _import('shop/dsShop')},
          {path: '/shop/walletMall', name: '钱包商城', component: _import('shop/qbShop')},
        ]
      },
      {path: '/money', name: '财务管理', component: _import('money/index'),
        redirect:'/money/recharge',
        children:[
          {path: '/money/recharge', name: '充值', component: _import('money/recharge')},
          {path: '/money/withdraw', name: '提现', component: _import('money/withdraw')},
        ]
      },
      // {path: '/consignment', name: '寄售管理', component: _import('consignment/index')},
      {path: '/vip', name: '会员管理', component: _import('vip/index')},
      {path: '/jurisdiction', name: '权限管理', component: _import('jurisdiction/index')},
      {path: '/dataAnalysis', name: '数据分析', component: _import('dataAnalysis/index')},
      // {path: '/setting', name: '设置', component: _import('setting/setting')},
      // {path: '/status', name: '代理资格', component: _import('status/status')},
      {path: '/risk', name: '风控管理', component: _import('risk/risk')},
      {path: '/config', name: '系统设置', component: _import('config/index'),
        redirect: '/config/weChatSer',
        children:[
          {path: '/config/weChatSer', name: '微信客服', component: _import('config/weChatSer')},
          {path: '/config/shopPic', name: '商城滚动图', component: _import('config/shopPic')},
          {path: '/config/shopAddress', name: '自提地址', component: _import('config/shopAddress')},
          {path: '/config/setting', name: '支付方式', component: _import('setting/setting')}
        ]
      },
      {path: '/log', name: '操作日志', component: _import('log/log')},
    ],
    beforeEnter: (to, from, next) => {
      if (to.path.indexOf('/login') == -1 && Cookie.get('level') == undefined) {
        next({path: '/login'})
      } else {
        next();
      }
    }
  },
  {path: '/login', name: '登录', component: _import('login/index')},
]


//去除地址栏 #
export default new Router({
  mode: 'history',
  routes: routes
})
