// pages/teacherRegistered/teacherRegistered.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherName: '',
    teacherPhone: '',
    phoneError: false,
    teacherEmail: '',
    lab: '',
    openid: '',
    isteacher: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // // 查看是否已经认证为教师
    // let isTeacher = wx.getStorageSync('isTeacher');
    // // 查看审核状态
    // let teacherIsProve = wx.getStorageSync('teacherIsProve')
    // let teacherInfo = wx.getStorageSync('teacherInfo')
    // // 获取当前用户的 openid
    this.setData({
      openid: app.globalData.openid,
    })
  },

  getTeacherName(e) {
    console.log(e);
    this.setData({
      teacherName: e.detail.value,
    })
  },

  getTeacherPhone(e) {
    console.log(e);
    let myreg = /^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(16([0-9]))|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9|5]))\d{8}$/;
    if (e.detail.value.length === 0) {
      return
    }
    console.log(e.detail.value.length);
    if (e.detail.value.length <= 10 && e.detail.value.length > 0) {
      console.log(2);
      this.setData({
        phoneError: true,
      })
    } else {
      console.log(myreg.test(e.detail.value));
      if (!myreg.test(e.detail.value)) {
        this.setData({
          phoneError: true,
        })
      } else {
        console.log(123);
        this.setData({
          teacherPhone: e.detail.value,
          phoneError: false,
        })
      }
    }
  },

  getTeacherEmail(e) {
    console.log(e);
    let myreg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (e.detail.value.length === 0) {
      return
    }
    // let f = e.detail.value.split("@")[0];
    // 电子邮箱的展示有bug，可能会超出盒子宽度
    if (!myreg.test(e.detail.value)) {
      // 如果正则匹配失败，则继续提示用户输入合法的电子邮箱
      wx.showToast({
        title: '请输入正确的电子邮箱',
        icon: 'none',
      })
    } else {
      this.setData({
        teacherEmail: e.detail.value,
      })
    }
  },

  getLabNumber(e) {
    console.log(e);
    this.setData({
      lab: e.detail.value,
    })
  },

  // 提交按钮
  handleSubmit(e) {
    console.log(e);
    // 先检测必填项有没有填
    let {
      teacherName,
      teacherPhone,
      phoneError,
    } = this.data;
    if (phoneError) {
      return
    }
    if (teacherName === '' || teacherPhone === '') {
      wx.showToast({
        title: '请按要求输入完整的认证信息',
        icon: 'none',
      })
    } else {
      // 提交到数据库中
      wx.showLoading({
        title: '数据上传中',
        mask: true,
      })
      this.addTeacher();
    }
  },

  addTeacher() {
    let {
      teacherName,
      teacherPhone,
      teacherEmail,
      lab,
      openid,
    } = this.data;
    wx.cloud.callFunction({
        name: 'addTeacher',
        data: {
          teacherName,
          teacherPhone,
          teacherEmail,
          lab,
          openid,
        }
      })
      .then(res => {
        wx.hideLoading();
        console.log(res);
        // 提交成功后跳转回游客页面
        wx.setStorageSync('applyStatus', 0)
        wx.setStorageSync('role', 1)
        wx.setStorageSync('isRegistered', true) 
        wx.navigateBack({
          delta: 2,
        })
        wx.showToast({
          title: '上传成功',
          icon: 'success',
        })
      })
      .catch(err => {
        wx.showModal({
          title: '提示',
          content: '提交失败，请重新尝试提交',
          success: res => {},
        })
        console.log(err);
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