// pages/registered/registered.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyName: '', // 公司名称
    EmployeeName: '',
    EmployeePhone: '',
    phoneError: false,
    EmployeeEmail: '',
    EmployeeJob: '',
    openid: '',
    isEmployee: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 是否是企业用户
    let isEmployee = wx.getStorageSync('isEmployee');
    // 审核状态
    let employeeIsProve = wx.getStorageSync('employeeIsProve');
    let employeeInfo = wx.getStorageSync('employeeInfo');
    // 获取用户的openid
    this.setData({
      openid: app.globalData.openid,
      isEmployee,
      employeeIsProve,
      employeeInfo,
    })
    this.initSearch();
  },

  // 初始查询
  initSearch() {
    let {
      isEmployee,
      employeeIsProve,
      employeeInfo,
    } = this.data;
    console.log(isEmployee);
    console.log(employeeIsProve);
    // 先看用户是否有申请过
    if (!isEmployee) {
      return
    } else {
      if (employeeIsProve == 0) {
        console.log("弹窗提示待审核，不可申请");
        wx.showModal({
          title: '提示',
          content: '您的注册申请正在审核中，不可重复申请',
          success: res => {
            if (res.confirm) {
              console.log('用户点击确定')
              // 跳转回游客页面
              wx.navigateBack({
                url: '/pages/tourists/tourists',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
              wx.navigateBack({
                url: '/pages/tourists/tourists',
              })
            }
          }
        })
      } else if (employeeIsProve == 1) {
        console.log("已经通过审核，可直接跳转至企业用户页面");
        wx.showModal({
          title: '提示',
          content: '您的注册申请已通过，可跳转至企业用户页面',
          success: res => {
            if (res.confirm) {
              console.log('用户点击确定')
              // 更新用户的企业信息
              employeeInfo.isFirst = 1;
              console.log(employeeInfo);
              this.updateEmployeeInfo(employeeInfo);
              // 跳转至企业用户页面
              wx.reLaunch({
                url: '/pages/user/user',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
              wx.navigateBack({
                url: '/pages/tourists/tourists',
              })
            }
          }
        })
      } else if (employeeIsProve == 2) {
        console.log("没通过审核，可继续申请注册");
        wx.showModal({
          title: '提示',
          content: '您的注册申请未通过，可继续申请',
          success: res => {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  },

  // 更新企业员工信息
  updateEmployeeInfo(item) {
    wx.cloud.callFunction({
        name: 'updateEmployeeInfo',
        data: {
          openid: item.openid,
          isProve: item.isProve,
          companyName: item.companyName,
          employeeName: item.employeeName,
          employeePhone: item.employeePhone,
          employeeEmail: item.employeeEmail,
          employeeJob: item.employeeJob,
          isFirst: item.isFirst,
        }
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 获取企业员工的公司
  getCompanyName(e) {
    console.log(e);
    this.setData({
      companyName: e.detail.value,
    })
  },

  // 获取企业员工的姓名
  getEmployeeName(e) {
    console.log(e);
    this.setData({
      EmployeeName: e.detail.value,
    })
  },

  // 获取企业员工的电话
  getEmployeePhone(e) {
    console.log(e);
    let myreg = /^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(16([0-9]))|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9|5]))\d{8}$/;
    if (e.detail.value.length === 0) {
      return
    }
    console.log(e.detail.value.length);
    if (e.detail.value.length <= 10 && e.detail.value.length > 0) {
      console.log(2);
      // 提示用户输入电话号码
      // wx.showToast({
      //   title: '请输入正确的电话号码',
      //   icon: 'none',
      // })
      this.setData({
        phoneError: true,
      })
    } else {
      console.log(myreg.test(e.detail.value));
      if (!myreg.test(e.detail.value)) {
        // 如果正则匹配失败，则继续提示用户输入合法的电话号码
        // wx.showToast({
        //   title: '请输入正确的电话号码',
        //   icon: 'none',
        // })
        this.setData({
          phoneError: true,
        })
      } else {
        console.log(123);
        this.setData({
          EmployeePhone: e.detail.value,
          phoneError: false,
        })
      }
    }
  },

  // 获取企业员工的邮箱
  getEmployeeEmail(e) {
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
        EmployeeEmail: e.detail.value,
      })
    }
  },

  // 获取企业员工的职务
  getEmployeeJob(e) {
    console.log(e);
    this.setData({
      EmployeeJob: e.detail.value,
    })
  },

  // 提交按钮
  handleSubmit(e) {
    console.log(e);
    // 先检测必填项有没有填
    let {
      companyName,
      EmployeeName,
      EmployeePhone,
      phoneError,
    } = this.data;
    if (phoneError) {
      return
    }
    if (companyName === '' || EmployeeName === '' || EmployeePhone === '') {
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
      this.addEmployee();
    }
  },

  // 新增注册用户信息
  addEmployee() {
    let {
      companyName,
      EmployeeName,
      EmployeePhone,
      EmployeeEmail,
      EmployeeJob,
      openid
    } = this.data;
    wx.cloud.callFunction({
        name: 'addEmployee',
        data: {
          companyName,
          employeeName: EmployeeName,
          employeePhone: EmployeePhone,
          employeeEmail: EmployeeEmail,
          employeeJob: EmployeeJob,
          openid
        }
      })
      .then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '上传成功，请耐心等待管理员审核',
          icon: 'none',
        })
        console.log(res);
        // 提交成功后跳转回首页
        wx.navigateBack({
          url: '/pages/tourists/tourists',
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