// pages/handleEmployee/handleEmployee.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navData: [{
      'id': 0,
      'navName': '待审核'
    }, {
      'id': 1,
      'navName': '已通过'
    }, {
      'id': 2,
      'navName': '未通过'
    }],
    navId: 0,
    current: 0,
    employeeList: [],
    swiperItem: new Array(3).fill([]),
    pageData1: [], // 待审核
    pageData2: [], // 审核通过
    pageData3: [], // 不通过
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading'
    })
    this.getRoleInfo()
    // this.getEmployeeInfo();
  },

  // 获取教师和学生的认证信息表
  getRoleInfo() {
    let {
      pageData1
    } = this.data;
    /* 
      这里的思路应该是按照审核的状态获取最新的10条或者20条数据，
      然后在展示页面设置上拉刷新，获取旧的记录
      目前版本只是个demo，所以暂时不做这个功能
    */
      wx.showToast({
        title: '数据加载中',
        mask: true,
        duration: 3000,
        icon: 'loading'
      });
    // 待审核的学生列表 

    this.getData2(1, 0)
    // console.log(pageData1);
    // this.setData({
    //   pageData1,
    // })
  },

  // 获取数据的函数
  async getData(sheetName, isProve) {
    const db = wx.cloud.database()
    let count = await db.collection(sheetName).count()
    count = count.total
    let all = []
    for (let i = 0; i < count; i += 20) {
      let list = await db.collection(sheetName)
        .skip(i)
        .where({
          isProve
        })
        .get()
      all = all.concat(list.data)
    }
    return all;
  },

  // 获取企业用户认证表
  getEmployeeInfo() {
    // let {openid} = this.data;
    wx.cloud.database().collection('employeeInfo')
      .get()
      .then(res => {
        console.log(res);
        let swiperItem = [];
        let i = 0;
        while (i < 3) {
          swiperItem.push(res.data);
          i++;
        }
        this.setData({
          employeeList: res.data,
          swiperItem
        })
      })
      .catch(err => {
        console.log(err);
      })
  },

  // 封装请求获取学生和老师数据的函数
  getData2(page, isProve) {
    let {swiperItem} = this.data;
    let studentList = this.getData('studentInfo', isProve)
    let teacherList = this.getData('teacherInfo', isProve)
    wx.showToast({
      title: '数据加载中',
      mask: true,
      duration: 3000,
      icon: 'loading'
    });
    let p = Promise.all([studentList, teacherList])
    p.then(res => {
        wx.hideToast();
        console.log(res);
        let all = res[0].concat(res[1])
        console.log(all);
        if (swiperItem[page - 1].length == 0) {
          swiperItem[page - 1] = all;
        } else {
          swiperItem[page - 1] = swiperItem[page - 1].concat(all);
        }
        // swiperItem = swiperItem[page - 1].concat(all)
        console.log(swiperItem);
        this.setData({
          swiperItem,
        });
        // switch (page) {
        //   case 1: this.setData({
        //     pageData1: all,
        //   }); break;
        //   case 2: this.setData({
        //     pageData2: all,
        //   }); break;
        //   case 3: this.setData({
        //     pageData3: all,
        //   }); break;
        //   default: break;
        // }
      })
      .catch(err => {
        wx.hideToast();
        wx.showToast({
          title: '数据获取失败',
          icon: 'error'
        })
        console.log(err);
      })
  },

  // 导航栏点击事件
  changeNav(e) {
    let {
      swiperItem,
    } = this.data;
    console.log(e);
    let navId = e.currentTarget.id * 1;
    // 先看是否已经请求过数据，如果没有则发送请求，有则跳过
    if (navId == 1 && swiperItem[1].length == 0) {
      // 发送请求
      this.getData2(2, 1);
    }

    if (navId == 2 && swiperItem[2].length == 0) {
      // 发送请求
      this.getData2(3, -1);
    }
    
    let current;
    if (e.currentTarget.id * 1 == 2) {
      current = -1;
    } else {
      current = e.currentTarget.id * 1;
    }
    console.log('current: ', current);
    console.log('navId: ', navId);
    this.setData({
      // addNewAppoint: true,
      current,
      navId: e.currentTarget.id * 1
    })
  },

  // 监听swiper变换事件
  swiperChange(e) {
    let {
      swiperItem,
    } = this.data;

    if (e.detail.current * 1 == 1 && swiperItem[1].length == 0) {
      // 发送请求
      this.getData2(2, 1)
    }

    if (e.detail.current * 1 == 2 && swiperItem[2].length == 0) {
      // 发送请求
      this.getData2(3, -1)
    }

    // 变换之后查看当前页的安排是程序自动生成的还是数据库中有安排的
    console.log(e);
    let current;
    if (e.detail.current * 1 == 2) {
      current = -1
    } else {
      current = e.detail.current * 1
    }
    this.setData({
      // addNewAppoint: true,
      current,
      navId: e.detail.current * 1
    })
  },

  /**
   * 可以给通过或者不通过的条目加一个动画，不然管理员不清楚是否已经删除
   */
  // 不通过事件
  handleDisagree(e) {
    console.log(e.currentTarget.dataset);
    let {navId} = this.data;
    let {index, item} = e.currentTarget.dataset;
    item.isProve = -1;
    if (item.role == 0) {
      // 更新学生信息
      this.updateUserInfo('studentInfo', item, index, navId);
    } else {
      this.updateUserInfo('teacherInfo', item, index, navId);
    }
  },

  // 通过事件
  /* 
    处理逻辑：
    获取当前条目的信息，以及索引，
    先去数据库更新，更新成功后再更新页面
  */
  handleAgree(e) {
    console.log(e.currentTarget.dataset);
    let {navId} = this.data;
    let {index, item} = e.currentTarget.dataset;
    item.isProve = 1;
    if (item.role == 0) {
      // 更新学生信息
      this.updateUserInfo('studentInfo', item, index, navId);
    } else {
      this.updateUserInfo('teacherInfo', item, index, navId);
    }

  },

  // 更新学生和老师信息
  updateUserInfo(sheetName, item, index, navId) {
    let {swiperItem} = this.data;
    wx.cloud.callFunction({
      name: 'updateSTInfo',
      data: {
        openid: item.openid,
        sheetName,
        isProve: item.isProve,
      }
    })
    .then(res => {
      console.log(res);
      // 更新页面数据，把审核成功的项目移除
      // swiperItem[navId][index] = item;
      swiperItem[navId].splice(index, 1)
      this.setData({
        swiperItem,
      })
    })
    .catch(err => {
      // wx.hideLoading()
      wx.showToast({
        title: '审核失败',
        icon: 'error',
      })
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
    console.log("监听页面卸载");
    // 更新企业员工信息


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