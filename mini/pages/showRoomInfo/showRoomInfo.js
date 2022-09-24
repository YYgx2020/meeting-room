// pages/showRoomInfo/showRoomInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: '',
    currentRoomid: '',
    roomInfo: [],
    roomid: '',
    roomName: '',
    roomContactName: '',
    roomContactPhone: '',
    roomType: '',
    roomPeople: '',
    roomBriefText: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      currentRoomid: options.roomid,
    })
    // 初始化页面数据
    wx.showLoading({
      title: '加载中',
    })
    // 数据初始化
    this.getRoomInfo(options.roomid);
  },

  // 获取 roomInfo
  getRoomInfo(roomid) {
    // 获取教室信息
    wx.cloud.database().collection('roomInfo')
    .where({
      roomid: roomid * 1,
    })
    .get()
    .then(res => {
      wx.hideLoading()
      console.log(res);
      let roomInfo = res.data[0];
      this.setData({
        tempFilePaths: roomInfo.roomCoverImg,
        roomid: roomInfo.roomid,
        roomName: roomInfo.roomName,
        roomContactName: roomInfo.roomContactName,
        roomContactPhone: roomInfo.roomContactPhone,
        roomType: roomInfo.roomType,
        roomPeople: roomInfo.roomPeople,
        roomBriefText: roomInfo.roomBriefInfo,
        imageList: [roomInfo.roomCoverImg],
      })
    })
    .catch(err => {
      wx.showToast({
        title: '数据获取失败',
        icon: 'error'
      })
      console.log(err);
    })
  },

  preview(e) {
    // let {} = this.data;
    console.log(e);
    let currentUrl = e.currentTarget.dataset.src;
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.imageList // 需要预览的图片http链接列表
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