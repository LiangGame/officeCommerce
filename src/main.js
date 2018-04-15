// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//cookie
import Cookie from 'js-cookie'
Vue.prototype.Cookie = Cookie;

//axios
import axios from '@/common/axios.js'
Vue.prototype.$http = axios;

import $ from 'jquery'

//element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false


/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })
export const vue = new Vue({
  el: '#app',
  router,
  render: h => h(App),
  data:{
    Bus: new Vue()
  }
})

// cookie失效重新登陆
router.beforeResolve((to, from, next) => {
  if( to.path.indexOf('/login')==-1 && vue.Cookie.get('level')==undefined){
    next({ path: '/login'})
  }else{
    next();
  }
})
