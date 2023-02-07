// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenid();
  },

  // 初始化一个获取用户openid的函数
  getOpenid() {
    wx.cloud.callFunction({
        name: 'getOpenId',
      })
      .then(res => {
        console.log(res);
        this.setData({
          openid: res.result.openid
        })
      })
      .catch(err => {
        console.log(err);
      })
  },

  copyUserOpenid(e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.openid,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  // 测试发短信功能
  sendSms() {
    wx.cloud.callFunction({
      name: "sendSms",    //这个名字要跟上传并部署的那个文件名一样
      data: {
        name: '15778003016',
      }
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
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