// pages/tourists/tourists.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [], // 用户信息
    openid: '',
    isStudent: false,
    isTeacher: false,
    isRegistered: false,
    applyStatus: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('tourists');
    // 获取用户信息
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo,
      openid: app.globalData.openid,
    })
    // this.getEmployeeInfo(app.globalData.openid);
    // 查看当前用户是否有申请认证，如果有，是学生还是老师
    this.confirmUserRole(app.globalData.openid);
    // this.getStduentInfo(app.globalData.openid);
  },

  confirmUserRole(openid) {
    let studentInfo = wx.getStorageSync('studentInfo')
    let teacherInfo = wx.getStorageSync('teacherInfo')
    let isRegistered = wx.getStorageSync('isRegistered')
    let {
      showRegister,
      applyStatus,
    } = this.data;

    // 查看申请认证状态
    if (studentInfo != '') {
      applyStatus = studentInfo.isProve
      console.log(applyStatus);
      if (studentInfo.isProve == -1) {
        // 删除用户的申请信息
        wx.showLoading({
          title: '加载中',
          mask: true,
        })
        this.delStudentInfo(openid);
      }
      // 小红点消息提示
      if (wx.getStorageSync('showRegister') !== '') {
        showRegister = wx.getStorageSync('showRegister')
      } else {
        showRegister = true
      }

    } else if (teacherInfo != '') {
      applyStatus = teacherInfo.isProve;
      console.log(applyStatus);
      if (teacherInfo.isProve == -1) {
        // 删除用户的申请信息
        wx.showLoading({
          title: '加载中',
          mask: true,
        })
        this.delTeacherInfo(openid);
      }
      // 小红点消息提示
      console.log(wx.getStorageSync('showRegister'));
      if (wx.getStorageSync('showRegister') !== '') {
        showRegister = wx.getStorageSync('showRegister')
      } else {
        console.log(23);
        showRegister = true;
      }

    } else {
      showRegister = false;
    }
    console.log(applyStatus);
    this.setData({
      showRegister,
      applyStatus,
      isRegistered,
    })
  },

  // 删除学生信息
  delStudentInfo(openid) {
    wx.cloud.callFunction({
        name: 'delStudentInfo',
        data: {
          openid,
        }
      })
      .then(res => {
        wx.hideLoading();
        wx.removeStorageSync('studentInfo')
        wx.setStorageSync('isRegistered', false)
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 删除教师信息
  delTeacherInfo(openid) {
    wx.cloud.callFunction({
        name: 'delTeacherInfo',
        data: {
          openid,
        }
      })
      .then(res => {
        wx.hideLoading();
        wx.removeStorageSync('teacherInfo')
        wx.setStorageSync('isRegistered', false)
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 注册功能
  handleRegistered() {
    let {
      isRegistered,
      applyStatus,
    } = this.data;
    console.log("用户点击了注册功能");
    // 点击一次之后，消息提示的小红点应该消失
    wx.setStorageSync('showRegister', false);
    // 先查看当前用户是否申请了认证，如果没有则先跳转到角色选择页面
    // 先跳转过去，然后在下一个页面判断是否已经申请
    if (wx.getStorageSync('applyStatus') !== '') {
      applyStatus = wx.getStorageSync('applyStatus')
    }
    if (!isRegistered) {
      wx.navigateTo({
        url: '/pages/roleChoose/roleChoose',
      })
    } else {
      // 携带申请状态和角色信息
      let role = wx.getStorageSync('role')
      wx.navigateTo({
        url: `/pages/roleChoose/roleChoose?applyStatus=${applyStatus}&role=${role}`,
      })
    }
  },

  // 跳转至教室/会议室页面
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
    console.log("监听页面显示");
    let first = wx.getStorageSync('firstEnterTourists');
    let isRegistered = wx.getStorageSync('isRegistered');
    // let showRegister = wx.getStorageSync('showRegister')
    this.setData({
      isRegistered
    })
    if (first == 1) {
      wx.setStorageSync('firstEnterTourists', 0)
      return
    }
    console.log(123);
    this.confirmUserRole(app.globalData.openid);
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