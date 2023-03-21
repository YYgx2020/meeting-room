/*
 * @Author: liangminqiang
 * @Description:
 * @Date: 2023-03-15 13:05:14
 * @LastEditTime: 2023-03-21 10:29:13
 */
// 封装 axios
import axios from "axios";
import { Notification } from "element-ui";
import router from "../router";
import Cookies from "js-cookie";

let config = {
  baseURL: "/api", // 跨域匹配的路径，当发送请求遇到 /api 时就转发到微信的地址上，然后再拼接具体的路径
  timeout: 5000, //设置最大请求时间
};

const _axios = axios.create(config);

/* 请求拦截器（请求之前的操作） */
_axios.interceptors.request.use(
  (req) => {
    // const token = localStorage.getItem('token')
    // console.log('baseURL: ', baseURL);
    // const token = Cookies.get('yg_c_token')
    // 发请求之前先查看 access_token 是否过期，如果没有则正常发送请求，否则提示用户过期，重新刷新网页登录以获取新的 access_token
    // const token = store.state.token
    const access_token = Cookies.get("access_token");
    // console.log("req: ", req);
    console.log(access_token);
    // 先看是不是登录请求
    if (req.url === "/cgi-bin/token" || access_token) {
      // 继续发送请求
      return req;
    } else {
      // 提示用户 access_token 过期
      // console.log('access_token过期或者无效');
      this.$message({
        message: "无效access_token，请重新登录",
        type: "warning",
      });
      return;
    }
  },
  (err) => {
    this.$message.error("请求出错！");
    return Promise.reject(err);
  }
);

/* 响应拦截器 */
_axios.interceptors.response.use(
  (resp) => {
    console.log("响应拦截器数据：", resp);
    // 返回的数据在 data 中
    const data = resp.data;
    if (resp.status != 200) {
      Notification({
        title: "错误",
        type: "error",
        message: data.message,
      });
      return Promise.reject(resp);
    } else {
      // resp.data.errcode = 40001 //测试token过期
      if (resp.data.errcode === 40001) {
        // console.log(resp.data.errcode === 40001);
        //跳转回登录界面
        //修复重复跳转
        // console.error("log");
        // console.log(window.location.href);
        if (window.location.href !== "http://127.0.0.1:8080/") {
          router.replace({
            name: "登录",
          });
          Notification({
            title: "错误",
            type: "error",
            message: "登陆已过期,请重新登陆",
          });
          return Promise.reject("登录token失效");
        } else {
        }
      }
    }
    return resp;
  },
  (err) => {
    console.log("拦截出错", err);
    if (err.response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");

      Notification({
        title: "错误",
        type: "error",
        message: "登陆已过期,请重新登陆",
      });
    }
    return Promise.reject(err);
  }
);

export default _axios;
