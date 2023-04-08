// pages/index/index.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '', // 用户的 openid
    adminInfo: [], // 管理员的 openid
    // 黄浩的 o3Eih4hBfwf7VZnk3P7zkP6H4ldY,  我的 o3Eih4kn_apmZslq5B6Y5HTmEWd4, 小星星的 o3Eih4unAn7mRzNknrBs3a_4wqw8， 梁海老师的 o3Eih4oJy0k1aTCTmSeBbNVYu8EM
    showRegister: true,
    userInfo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '程序加载中',
      mask: true,
      duration: 3000,
      icon: 'loading'
    })
    // 获取用户的 openid
    this.getOpenid();
  },

  // 初始化一个获取用户openid的函数
  getOpenid() {
    wx.cloud.callFunction({
        name: 'getOpenId',
      })
      .then(res => {
        console.log(res);
        // 关闭消息提示框
        wx.hideToast();
        this.setData({
          openid: res.result.openid
        })
        // 将用户的 openid 进行全局的存储
        app.globalData.openid = res.result.openid;
      })

      .catch(err => {
        wx.hideToast();
        wx.showModal({
          title: '提示',
          content: '请重新打开小程序'
        })
        console.log(err);
      })
  },

  // 判断是不是管理员
  judgeAdmin(openid) {
    wx.cloud.database().collection('adminOpenid')
      .where({
        openid,
      })
      .get()
      .then(res => {
        // 关闭加载提示
        wx.hideLoading();
        console.log(res);
        if (res.data.length > 0) {
          app.globalData.adminInfo = res.data[0];
          app.globalData.isAdmin = true;
          this.setData({
            adminInfo: res.data[0],
            isAdmin: true,
          })
        } else {
          app.globalData.isAdmin = false;
          this.setData({
            isAdmin: false,
          })
        }
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 非管理员登录
  handleLogin(e) {
    let {
      openid,
    } = this.data;
    // 标记是否是游客
    let isRegistered = false;
    // 标记是否认证通过
    let isPassed = false;
    // 标记通过后是否是第一次使用，用于展示消息红点


    
    let isFirst = false;
    // 弹起消息提示框
    wx.showToast({
      title: '程序加载中',
      mask: true,
      duration: 3000,
      icon: 'loading'
    })
    // 根据 openid 发送请求去确认当前用户的身份
    // 查询学生信息表和教师信息表
    let res1 = wx.cloud.database().collection('studentInfo')
      .where({
        openid,
      }).get()
    let res2 = wx.cloud.database().collection('teacherInfo')
      .where({
        openid,
      }).get()

    Promise.all([res1, res2]).then(resArr => {

      app.globalData.isAdmin=false
      wx.hideToast();
      console.log(resArr);
      let studentInfo = resArr[0].data[0]
      console.log(studentInfo);
      let teacherInfo = resArr[1].data[0]
      console.log(teacherInfo);
      // 判断是学生还是老师
      // 0 表示学生，1 表示教师, 2 表示游客
      if (studentInfo != undefined) {
        console.log(0);
        wx.setStorageSync('studentInfo', studentInfo)
        wx.setStorageSync('role', 0)
        isRegistered = true;
        if (studentInfo.isProve == 1) {
          wx.setStorageSync('job', 'student')
          isPassed = true;
        }
        if (studentInfo.isFirst == 0) {
          isFirst = true
        }
      } else if (teacherInfo != undefined) {
        console.log(1);
        wx.setStorageSync('teacherInfo', teacherInfo)
        wx.setStorageSync('role', 1)
        isRegistered = true;
        if (teacherInfo.isProve == 1) {
          wx.setStorageSync('job', 'teacher')
          isPassed = true;
        }
        if (teacherInfo.isFirst == 0) {
          isFirst = true;
        }
      }
      // 新建一个用户预约表
      // this.getUserAppoint(openid);
    }).catch(err => {
      wx.hideToast();
      wx.showModal({
        title: '提示',
        content: '身份信息获取失败，无法登录，请重新尝试',
      })
      console.log(err);
    })

    wx.getUserProfile({
      desc: '用于完善管理员信息',
      success: (res) => {
        wx.hideLoading();
        console.log("获取用户信息成功", res);
        console.log('isRegistered: ', isRegistered);
        let userInfo = res.userInfo;
        // 将用户的信息存入缓存中
        wx.setStorageSync('userInfo', userInfo);
        // 将第一次进入游客页面的标志写入缓存中
        wx.setStorageSync('firstEnterTourists', 1)
        wx.setStorageSync('isRegistered', isRegistered)
        // 获取用户信息成功后再跳转到非管理员界面
        if (!isRegistered || (isRegistered && isFirst)) {
          wx.reLaunch({
            url: '/pages/tourists/tourists',
          })
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })
        } else {
          // 新建一个用户预约表
          // this.getUserAppoint(openid);
          // 老师和教师的用户界面
          wx.reLaunch({
            url: '/pages/user/user',
          })
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })
        }

      },
      fail: (err) => {
        console.log("获取用户信息失败", err);
        wx.showToast({
          title: '授权失败',
          icon: 'error'
        })
      }
    })
  },

  // 管理员登录 -- handleAdminLogin
  // handleLogin(e) {
  //   wx.showToast({
  //     title: '程序加载中',
  //     mask: true,
  //     duration: 3000,
  //     icon: 'loading'
  //   })
  //   // 如果当前用户的 openid 与管理员的 openid 一致，则允许用户跳转至管理员页面，否则跳转至普通用户界面

  //   let {
  //     openid,
  //     isAdmin
  //   } = this.data;
  //   // 标记是否是游客
  //   let isRegistered = false;
  //   // 标记是否认证通过
  //   let isPassed = false;
  //   // 标记通过后是否是第一次使用
  //   let isFirst = false;
  //   if (isAdmin) {
  //     console.log("当前用户是管理员，跳转至管理员页面");
  //     // 获取当前管理员的微信头像和昵称
  //     // wx.getUserProfile({
  //     //   desc: '用于完善管理员信息',
  //     //   success: (res) => {
  //     //     wx.hideLoading();
  //     //     console.log("获取用户信息成功", res);
  //     //     let userInfo = res.userInfo;
  //     //     // 将用户的信息存入缓存中
  //     //     wx.setStorageSync('userInfo', userInfo);
  //     //     this.setData({
  //     //       userInfo
  //     //     })
  //     //     // 获取用户信息成功后再跳转到管理员界面
  //     //     wx.reLaunch({
  //     //       url: '/pages/admin/admin',
  //     //     })
  //     //     wx.showToast({
  //     //       title: '登录成功',
  //     //       icon: 'success'
  //     //     })
  //     //   },
  //     //   fail: (err) => {
  //     //     wx.hideLoading();
  //     //     console.log("获取用户信息失败", err);
  //     //     wx.showToast({
  //     //       title: '授权失败',
  //     //       icon: 'error'
  //     //     })
  //     //   }
  //     // })
  //   } else {
  //     // 如果不是管理员，则去查看是否是老师还是学生还是游客
  //     // 查询学生信息表和教师信息表
  //     let res1 = wx.cloud.database().collection('studentInfo')
  //       .where({
  //         openid,
  //       }).get()
  //     let res2 = wx.cloud.database().collection('teacherInfo')
  //       .where({
  //         openid,
  //       }).get()

  //     Promise.all([res1, res2]).then(resArr => {
  //       wx.hideLoading();
  //       console.log(resArr);
  //       let studentInfo = resArr[0].data[0]
  //       console.log(studentInfo);
  //       let teacherInfo = resArr[1].data[0]
  //       console.log(teacherInfo);
  //       // 判断是学生还是老师
  //       // 0 表示学生，1 表示教师, 2 表示游客
  //       if (studentInfo != undefined) {
  //         console.log(0);
  //         wx.setStorageSync('studentInfo', studentInfo)
  //         wx.setStorageSync('role', 0)
  //         isRegistered = true;
  //         if (studentInfo.isProve == 1) {
  //           wx.setStorageSync('job', 'student')
  //           isPassed = true;
  //         } 
  //         if (studentInfo.isFirst == 0) {
  //           isFirst = true
  //         }
  //       } else if (teacherInfo != undefined) {
  //         console.log(1);
  //         wx.setStorageSync('teacherInfo', teacherInfo)
  //         wx.setStorageSync('role', 1)
  //         isRegistered = true;
  //         if (teacherInfo.isProve == 1) {
  //           wx.setStorageSync('job', 'teacher')
  //           isPassed = true;
  //         }
  //         if (teacherInfo.isFirst == 0) {
  //           isFirst = true;
  //         }
  //       }
  //       // 新建一个用户预约表
  //       // this.getUserAppoint(openid);
  //     }).catch(err => {
  //       console.log(err);
  //     })
  //   }

  //   wx.getUserProfile({
  //     desc: '用于完善管理员信息',
  //     success: (res) => {
  //       wx.hideLoading();
  //       console.log("获取用户信息成功", res);
  //       console.log('isRegistered: ', isRegistered);
  //       let userInfo = res.userInfo;
  //       // 将用户的信息存入缓存中
  //       wx.setStorageSync('userInfo', userInfo);
  //       // 将第一次进入游客页面的标志写入缓存中
  //       wx.setStorageSync('firstEnterTourists', 1)
  //       wx.setStorageSync('isRegistered', isRegistered)
  //       // 获取用户信息成功后再跳转到非管理员界面
  //       if (isAdmin) {
  //         wx.reLaunch({
  //           url: '/pages/admin/admin',
  //         })
  //         wx.showToast({
  //           title: '登录成功',
  //           icon: 'success'
  //         })
  //       } else if (!isRegistered || (isRegistered && isFirst)) {
  //         wx.reLaunch({
  //           url: '/pages/tourists/tourists',
  //         })
  //         wx.showToast({
  //           title: '登录成功',
  //           icon: 'success'
  //         })
  //       } else {
  //         // 新建一个用户预约表
  //         this.getUserAppoint(openid);
  //         wx.reLaunch({
  //           url: '/pages/user/user',
  //         })
  //         wx.showToast({
  //           title: '登录成功',
  //           icon: 'success'
  //         })
  //       }

  //     },
  //     fail: (err) => {
  //       console.log("获取用户信息失败", err);
  //       wx.showToast({
  //         title: '授权失败',
  //         icon: 'error'
  //       })
  //     }
  //   })
  // },

  // 获取用户的预约表（普通用户）
  getUserAppoint(openid) {
    wx.cloud.database().collection('userAppointInfo')
      .where({
        openid,
      })
      .get()
      .then(res => {
        console.log(res.data);
        if (res.data.length == 0) {
          this.addUserAppoint(openid);
        }
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 为当前用户添加一个预约表
  addUserAppoint(openid) {
    wx.cloud.callFunction({
        name: 'addUserAppoint',
        data: {
          openid: openid
        }
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 扫码图标的点击事件 -- 调用手机相机扫码
  handleSaoma() {
    let path = '';
    // 允许从相机和相册扫码
    wx.scanCode({
      // onlyFromCamera: true,
      success(res) {
        console.log(res);
        console.log(res.path);
        path = res.path;
        // 扫码并跳转到room详情页面
        wx.redirectTo({
          url: '/' + path,
        })
      }
    })
  },

  // 企业员工注册
  handleRegistered() {
    console.log("用户点击了企业员工注册");
    // 跳转到企业员工注册页面
    wx.navigateTo({
      url: '/pages/registered/registered',
    })
  },

  // 管理员登录，跳转到管理员登陆页面
  toAdminLoginPage() {
    wx.navigateTo({
      url: '/pages/adminLogin/adminLogin',
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