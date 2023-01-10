// pages/adminLogin/adminLogin.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'password',
    userPhone: '',  // 用户手机号
    password: '',  // 用户密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 获取手机号
  getUserPhone(e) {
    console.log(e);
    let userPhone = e.detail.value;
    this.setData({
      userPhone
    })
  },

  getPassword(e) {
    let password = e.detail.value;
    this.setData({
      password
    })
  },

  // 眼睛点击事件
  eyeClick() {
    console.log(1);
    let type = this.data.type;
    if (type === 'password') {
      this.setData({
        type: 'text',
      })
    } else {
      this.setData({
        type: 'password'
      })
    }
  },

  // 登录事件
  loginEvent() {
    const {userPhone, password} = this.data;
    // 合法性检测
    if (userPhone === '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'error',
      });
      return;
    }
    if (password === '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'error',
      });
      return;
    }
    wx.showToast({
      title: '数据加载中',
      mask: true,
      duration: 3000,
      icon: 'loading'
    })
    // 发请求验证手机号密码是否正确
    wx.cloud.database().collection('adminInfo')
    .where({
      phone: userPhone,
      password,
    })
    .get()
    .then(res => {
      // wx.hideToast();
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 500,
      })
      console.log(res);
      if (res.data.length === 0) {
        wx.showModal({
          title: '提示',
          content: '手机号或密码错误',
        })
      }
      
      // 设置全局属性
      app.globalData.isAdmin = true;
      // 设置用户信息
      app.globalData.userInfo = {
        avatarUrl: res.data[0].avatarUrl,
        nickName: res.data[0].nickName,
      }
      setTimeout(function(){
        wx.reLaunch({
          url: '/pages/admin/admin',
        })
      },500)
    })
    .catch(err => {
      wx.hideToast();
      console.log(err);
      wx.showModal({
        title: '提示',
        content: '登录出错，请退出重试',
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})