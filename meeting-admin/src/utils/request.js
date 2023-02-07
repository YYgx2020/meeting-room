// 封装 axios
import axios from 'axios';
import { Notification } from 'element-ui';
import store from '../store/index';
import Cookies from 'js-cookie';

// const baseURL = process.env.NODE_ENV === 'production' ? 'https://www.lianghongyi.com': '/api'
// const baseURL = process.env.VUE_APP_URL

let config = {
  baseURL: '/api',
  timeout: 5000       //设置最大请求时间
}

const _axios = axios.create(config)

/* 请求拦截器（请求之前的操作） */
_axios.interceptors.request.use(req => {
  // const token = localStorage.getItem('token')
  // console.log('baseURL: ', baseURL);
  // const token = Cookies.get('yg_c_token')
  // 发请求之前先查看 access_token 是否过期，如果没有则正常发送请求，否则提示用户过期，重新刷新网页登录以获取新的 access_token
  // const token = store.state.token
  const access_token = Cookies.get('access_token');
  console.log('req: ', req);
  console.log(access_token);
  // 先看是不是登录请求
  if (req.url === '/cgi-bin/token' || access_token) {
    // 继续发送请求
    return req;
  } else {
    // 提示用户 access_token 过期
    // console.log('access_token过期或者无效');
    this.$message({
      message: '无效access_token，请重新登录',
      type: 'warning'
    });
    return;
  }
}, err => {
  this.$message.error('请求出错！');
  return Promise.reject(err);
})

/* 响应拦截器 */
_axios.interceptors.response.use(resp => {
  console.log('响应拦截器数据：', resp);
  // 返回的数据在 data 中
  const data = resp.data
  if (resp.status != 200) {
    // Message({
    //   type: 'error',
    //   message: data.message,
    //   offset: 60
    // })
    Notification({
      title: '错误',
      type: 'error',
      message: data.message,
    })
    return Promise.reject(resp)
  }
  return resp
}, err => {
  console.log('拦截出错', err);
  if (err.response.status === 403) {
    localStorage.removeItem("token")
    localStorage.removeItem('userInfo')
    // Message({
    //   type: 'error',
    //   message: '登陆已过期,请重新登陆',
    //   offset: 60
    // })
    Notification({
      title: '错误',
      type: 'error',
      message: '登陆已过期,请重新登陆',
    })
  }
  // else if (err.response.status === 500) {
  //   Notification({
  //     title: '错误',
  //     type: 'error',
  //     message: err.response.data.meassage,
  //   })
  // }
  return Promise.reject(err)
})

export default _axios