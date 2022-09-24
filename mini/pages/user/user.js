// pages/user/user.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [], // 用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    let userInfo = wx.getStorageSync('userInfo');
    let role = wx.getStorageSync('role');
    this.setData({
      userInfo,
      role,
    })
    wx.showLoading({
      title: '程序加载中',
      mask: true,
    })
    this.initSearch(role)
  },

  // 查询用户姓名
  initSearch(role) {
    if (role == 0) {
      // 学生认证用户
      wx.cloud.database().collection('studentInfo')
      .where({
        openid: app.globalData.openid,
      })
      .get()
      .then(res => {
        wx.hideLoading();
        console.log(res);
        let name = res.data[0].studentName + '同学'
        this.setData({
          name,
        })
      })
      .catch(err => {
        wx.hideLoading();
        console.log(err);
      })
    } else {
      // 教师认证用户
      wx.cloud.database().collection('teacherInfo')
      .where({
        openid: app.globalData.openid,
      })
      .get()
      .then(res => {
        wx.hideLoading();
        console.log(res);
        let name = res.data[0].teacherName + '老师'
        this.setData({
          name,
        })
      })
      .catch(err => {
        wx.hideLoading();
        console.log(err);
      })
    }
  },

  // 查看预约的跳转
  handleAppointed() {
    console.log("跳转到查看预约页面");
    wx.navigateTo({
      url: '/pages/showUserAppoint/showUserAppoint',
    })
  },

  // 查看教室列表
  handleRoomEdit() {
    console.log("跳转到查看教室列表");
    // 将第一次进入教室列表页面的标志写进缓存中
    wx.setStorageSync('firstEnterRoomsEdit', 1)
    wx.navigateTo({
      url: '/pages/roomsEdit/roomsEdit',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})