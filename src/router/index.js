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
      {path: '/order', name: '订单管理', component: _import('order/index')},
      {path: '/shop', name: '商城管理', component: _import('shop/index')},
      {path: '/money', name: '财务管理', component: _import('money/index')},
      {path: '/consignment', name: '寄售管理', component: _import('consignment/index')},
      {path: '/vip', name: '会员管理', component: _import('vip/index')},
      {path: '/jurisdiction', name: '权限管理', component: _import('jurisdiction/index')},
      {path: '/dataAnalysis', name: '数据分析', component: _import('dataAnalysis/index')}
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
