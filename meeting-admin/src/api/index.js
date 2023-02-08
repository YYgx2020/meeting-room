import axios from "../utils/request";
import Cookies from "js-cookie";
import { env } from "@/utils/constant";

// 从 cookie 中获取 access_token
const access_token = Cookies.get('access_token');

// 获取 access_token
/* 
  data: {
    // 详情见微信小程序官方文档：
    https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-access-token/getAccessToken.html
    grant_type,  // 一个常量字符串
    appid,  // 小程序的 APPID
    secret,  // 小程序的密钥
  }
*/
export function getAccessToken(data) {
  return axios({
    url: '/cgi-bin/token',
    method: 'get',
    params: data,
  })
}

// 登录验证
/**
 * @name 登录验证
 * @param { string } access_token
 * @param { string } phone 
 * @param { string } password
 * @return { axios }
 */

export function loginAuth(access_token, phone, password) {
  console.log('查看', access_token, phone, password);
  return axios({
    url: `/tcb/databasequery?access_token=${access_token}`,
    method: 'post',
    data: {
      env,
      query: `db.collection(\"adminInfo\").where({phone: '${phone}', password: '${password}'}).get()`,
    }
  })
}