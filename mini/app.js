/*
 * @Author: your name
 * @Date: 2021-08-25 15:16:07
 * @LastEditTime: 2021-09-10 11:54:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \roomAppointment\app.js
 */
// app.js
App({
  onLaunch() {
    // var that = this;
    wx.cloud.init({
      env: 'meeting-0gpffok549a159d3'
    })
    // 获取管理员openid列表
    // wx.cloud.database().collection('adminInfo')
    //   .get()
    //   .then(res => {
    //     console.log(res);
    //     this.globalData.adminInfo = res.data;
    //     console.log(this.globalData.adminInfo);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
  },
  globalData: {
    isAdmin: false,
    openid: '',
    userInfo: '',
    roomInfo: [],
    adminInfo: [], // 管理员的 openid
    // 黄浩的 o3Eih4hBfwf7VZnk3P7zkP6H4ldY,  我的 o3Eih4kn_apmZslq5B6Y5HTmEWd4, 小星星的 o3Eih4unAn7mRzNknrBs3a_4wqw8， 梁海老师的 o3Eih4oJy0k1aTCTmSeBbNVYu8EM
  }
  // 'o3Eih4oJy0k1aTCTmSeBbNVYu8EM', 'o3Eih4kn_apmZslq5B6Y5HTmEWd4', 'o3Eih4unAn7mRzNknrBs3a_4wqw8', 'o3Eih4hBfwf7VZnk3P7zkP6H4ldY'
})

/**
 * 需要填写电话的页面：
 * 企业员工注册页面 -- pages/registered/registered
 * 企业用户预约页面 -- 
 * 新增教室页面 -- 
 */