// pages/showRoomQrimg/showRoomQrimg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodeImgURL: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("传过来的fileID：", options.fileID);
    wx.cloud.getTempFileURL({
        fileList: [{
          fileID: options.fileID,
        }]
      })
      .then(res => {
        console.log(res.fileList);
        this.setData({
          qrcodeImgURL: res.fileList[0].tempFileURL
        })
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