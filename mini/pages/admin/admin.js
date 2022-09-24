// pages/admin/admin.js
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
    this.setData({
      userInfo
    })
  },

  // 跳转至企业员工认证页面
  handleEmployee() {
    wx.navigateTo({
      url: '/pages/handleEmployee/handleEmployee',
    })
  },

  // 处理查看预约的跳转
  handleAppointed() {
    console.log("跳转到预约处理页面");
    wx.navigateTo({
      url: '/pages/appointedEdit/appointedEdit',
    })
  },

  // 处理教室编辑的跳转
  handleRoomEdit() {
    console.log("跳转到教室编辑页面");
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