// import { Message } from 'element-ui';
import { apiUrl } from '@/common/common.js';
import axios from 'axios';
import Cookie from 'js-cookie'
import Qs from 'qs';
import { vue } from '@/main.js'
axios.defaults.baseURL = apiUrl;
axios.defaults.timeout = 15 * 1000;
// axios.defaults.headers = {'Authorization': 'BasicAuth ' + Cookie.get('ticket')};
//添加一个请求拦截器
axios.interceptors.request.use(function(config){
    //在请求发出之前进行一些操作
    // if(vue.Cookie.get('ticket')==undefined){
    //     vue.$router.push('/login');
    // }
    config.data = Qs.stringify(config.data);
    return config;
},function(err){
    //Do something with request error
    return Promise.reject(error);
});



//添加一个响应拦截器
axios.interceptors.response.use(function(res){
    //在这里对返回的数据进行处理
    return res.data;
},function(err){
    // Message({
    //     message: translate('网络开了小差！请重试...'),
    //     type: 'error',
    //     showClose: true
    // })
    return Promise.reject(err);
})

export default axios
