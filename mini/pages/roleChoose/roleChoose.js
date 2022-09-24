// pages/roleChoose/roleChoose.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    if (JSON.stringify(options) != '{}') {
      let {applyStatus, role} = options;
      // this.setData({
      //   applyStatus,
      //   role,
      // })
      this.initSearch(applyStatus, role);
    }
  },

  initSearch(applyStatus, role) {
    applyStatus  *= 1;
    role *= 1;
    let teacherInfo = wx.getStorageSync('teacherInfo')
    let studentInfo = wx.getStorageSync('studentInfo')
    // 教师认证
    if (role == 1) {
      if (applyStatus == 0) {
        wx.showModal({
          title: '提示',
          content: '您的教师认证申请正在审核中，不可重复申请',
          success: res => {
            wx.navigateBack({
              url: '/pages/tourists/tourists',
            })
          }
        })
      } else if (applyStatus == 1) {
        wx.showModal({
          title: '提示',
          content: '您的教师认证申请已通过，可跳转至教师用户页面',
          success: res => {
            if (res.confirm) {
              console.log('用户点击确定')
              // 更新用户的教师认证信息
              teacherInfo.isFirst = 1;
              console.log(teacherInfo);
              this.updateTeacherInfo(teacherInfo);
              // 跳转至教师用户页面
              wx.reLaunch({
                url: '/pages/user/user?role=1',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
              wx.setStorageSync('showRegister', false)
              wx.navigateBack({
                url: '/pages/tourists/tourists',
              })
            }
          }
        })
      } else {
        wx.setStorageSync('showRegister', false)
        wx.showModal({
          title: '提示',
          content: '您的教师认证申请未通过，可继续申请',
          success: res => {}
        })
      }
    } else {
      // 学生认证
      if (applyStatus == 0) {
        wx.showModal({
          title: '提示',
          content: '您的学生认证申请正在审核中，不可重复申请',
          success: res => {
            wx.navigateBack({
              url: '/pages/tourists/tourists',
            })
          }
        })
      } else if (applyStatus == 1) {
        wx.showModal({
          title: '提示',
          content: '您的学生认证申请已通过，可跳转至学生用户页面',
          success: res => {
            if (res.confirm) {
              console.log('用户点击确定')
              // 更新用户的学生认证信息
              studentInfo.isFirst = 1;
              console.log(studentInfo);
              this.updateStudentInfo(studentInfo);
              // 跳转至学生用户页面
              wx.reLaunch({
                url: '/pages/user/user?role=0',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
              wx.setStorageSync('showRegister', false)
              wx.navigateBack({
                url: '/pages/tourists/tourists',
              })
            }
          }
        })
      } else {
        wx.setStorageSync('showRegister', false)
        wx.showModal({
          title: '提示',
          content: '您的学生认证申请未通过，可继续申请',
          success: res => {}
        })
      }
    }
  },

  // 更新学生信息
  updateStudentInfo(item) {
    wx.cloud.callFunction({
        name: 'updateStudentInfo',
        data: item,
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 更新教师信息
  updateTeacherInfo(item) {
    wx.cloud.callFunction({
        name: 'updateTeacherInfo',
        data: item,
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  navToStudentPage() {
    wx.navigateTo({
      url: '/pages/studentRegistered/studentRegistered',
    })
  },

  navToTeacherPage() {
    wx.navigateTo({
      url: '/pages/teacherRegistered/teacherRegistered',
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