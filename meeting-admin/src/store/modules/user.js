/*
 * @Author: liangminqiang
 * @Description:
 * @Date: 2023-03-18 15:26:25
 * @LastEditTime: 2023-03-20 18:44:00
 */
const user = {
  state: {
    isLogin: false, // 登录状态，默认没有登录
    token: "", // 使用微信小程序 https 接口的 access_token 来当作本项目的 token，时间为 2 小时
    userInfo: "",
  },
  mutations: {},
  actions: {},
};

export default user;
